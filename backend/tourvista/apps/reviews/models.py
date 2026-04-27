from django.db import models
from tourvista.apps.users.models import User
from tourvista.apps.destinations.models import TourPackage, Hotel, GuideService

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    
    tour = models.ForeignKey(TourPackage, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
    guide_service = models.ForeignKey(GuideService, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')

    rating = models.PositiveSmallIntegerField(choices=[(i,i) for i in range(1,6)])
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    is_verified_booking = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)
    upvotes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.rating}★)"

class ReviewReply(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='replies')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
