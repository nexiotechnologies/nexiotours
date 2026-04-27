from rest_framework import serializers
from .models import HiddenLocation, GemRating, GemComment

class GemRatingSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    class Meta:
        model = GemRating
        fields = ['id', 'user', 'user_name', 'score', 'created_at']
    
    def get_user_name(self, obj):
        try:
            return obj.user.display_name or obj.user.username
        except:
            return "Nexio Explorer"

class GemCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    class Meta:
        model = GemComment
        fields = ['id', 'user', 'user_name', 'text', 'created_at']

    def get_user_name(self, obj):
        try:
            return obj.user.display_name or obj.user.username
        except:
            return "Nexio Explorer"

class HiddenLocationSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    ratings = GemRatingSerializer(many=True, read_only=True)
    comments = GemCommentSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = HiddenLocation
        fields = ['id', 'owner', 'owner_name', 'name', 'location', 'google_maps_url', 'description', 'images', 'video_url', 'ratings', 'comments', 'average_rating', 'created_at']
        read_only_fields = ['owner']

    def get_owner_name(self, obj):
        try:
            return obj.owner.display_name or obj.owner.username
        except:
            return "Unknown Discoverer"

    def get_average_rating(self, obj):
        try:
            ratings = obj.ratings.all()
            if not ratings: return 0
            return sum([r.score for r in ratings]) / len(ratings)
        except:
            return 0
