from django.db import models
from tourvista.apps.users.models import User
from cloudinary.models import CloudinaryField

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return self.name

class TourPackage(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tours')
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    location = models.CharField(max_length=200)
    description = models.TextField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveIntegerField(default=1)
    main_image = CloudinaryField('image', blank=True, null=True)
    capacity = models.PositiveIntegerField(default=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): return self.name

class Hotel(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hotels')
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    description = models.TextField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    amenities = models.JSONField(default=list)
    main_image = CloudinaryField('image', blank=True, null=True)
    total_rooms = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): return self.name

class GuideService(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='guides')
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    languages = models.CharField(max_length=200)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    main_image = CloudinaryField('image', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): return self.name
