from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email','first_name','last_name','display_name','role','phone','bio','avatar','is_verified','travel_preferences','created_at']
        read_only_fields = ['id','created_at','is_verified']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    class Meta:
        model = User
        fields = ['username','email','password','first_name','last_name','role']
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
