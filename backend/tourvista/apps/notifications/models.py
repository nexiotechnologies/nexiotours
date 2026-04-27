from django.db import models
from tourvista.apps.users.models import User

class Notification(models.Model):
    TYPE_CHOICES = [('booking','Booking'),('payment','Payment'),('review','Review'),('promo','Promo'),('system','System')]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta: ordering = ['-created_at']
