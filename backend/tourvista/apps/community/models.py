from django.db import models
from tourvista.apps.users.models import User
from cloudinary.models import CloudinaryField

class HiddenLocation(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hidden_locations')
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    description = models.TextField()
    images = models.JSONField(default=list) # List of Cloudinary URLs
    video_url = models.URLField(blank=True, null=True)
    google_maps_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} by {self.owner.username}"

class GemRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.ForeignKey(HiddenLocation, on_delete=models.CASCADE, related_name='ratings')
    score = models.PositiveSmallIntegerField() # 1-5
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'location')

class GemComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.ForeignKey(HiddenLocation, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.location.name}"
