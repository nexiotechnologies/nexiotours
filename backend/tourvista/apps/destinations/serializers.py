from rest_framework import serializers
from .models import Category, TourPackage, Hotel, GuideService
from django.db.models import Avg

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name','icon']

class BaseDestinationSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        avg = reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0.0

    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()

class TourPackageSerializer(BaseDestinationSerializer):
    category_detail = CategorySerializer(source='category', read_only=True)
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), required=False, allow_null=True
    )
    class Meta:
        model = TourPackage
        fields = '__all__'
        read_only_fields = ['owner']

class HotelSerializer(BaseDestinationSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'
        read_only_fields = ['owner']

class GuideServiceSerializer(BaseDestinationSerializer):
    class Meta:
        model = GuideService
        fields = '__all__'
        read_only_fields = ['owner']
