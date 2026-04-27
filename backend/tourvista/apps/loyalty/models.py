from django.db import models
from tourvista.apps.users.models import User

class LoyaltyAccount(models.Model):
    TIER_CHOICES = [('bronze','Bronze'),('silver','Silver'),('gold','Gold')]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='loyalty')
    points = models.PositiveIntegerField(default=0)
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='bronze')
    total_earned = models.PositiveIntegerField(default=0)
    total_redeemed = models.PositiveIntegerField(default=0)
    referral_code = models.CharField(max_length=20, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.referral_code:
            import uuid
            self.referral_code = 'REF' + str(uuid.uuid4())[:8].upper()
        if self.points >= 5000: self.tier = 'gold'
        elif self.points >= 1000: self.tier = 'silver'
        else: self.tier = 'bronze'
        super().save(*args, **kwargs)

class PointsTransaction(models.Model):
    TYPE_CHOICES = [('earn','Earn'),('redeem','Redeem'),('expire','Expire')]
    account = models.ForeignKey(LoyaltyAccount, on_delete=models.CASCADE, related_name='transactions')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    points = models.IntegerField()
    description = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta: ordering = ['-created_at']
