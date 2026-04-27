from rest_framework import serializers
from .models import Review, ReviewReply

class ReviewReplySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    class Meta:
        model = ReviewReply
        fields = ['id','user_name','comment','created_at']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    replies = ReviewReplySerializer(many=True, read_only=True)
    class Meta:
        model = Review
        fields = ['id','user_name','destination','rating','title','comment','is_verified_booking','upvotes','replies','created_at']
        read_only_fields = ['user','is_verified_booking','upvotes']
