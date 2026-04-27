from rest_framework import serializers
from .models import Booking, PromoCode

class BookingSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    destination_name = serializers.SerializerMethodField()

    def get_destination_name(self, obj):
        if obj.tour: return obj.tour.name
        if obj.hotel: return obj.hotel.name
        if obj.guide_service: return obj.guide_service.name
        return "Unknown Service"
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['user','booking_reference','created_at']

    def validate(self, data):
        if data['check_in'] >= data['check_out']:
            raise serializers.ValidationError("Check-out date must be after check-in date.")
        from django.utils import timezone
        if data['check_in'] < timezone.now().date():
            raise serializers.ValidationError("Check-in date cannot be in the past.")
        return data

class PromoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCode
        fields = ['code','discount_percent','is_active']
