from rest_framework import serializers
from .models import BlogPost, BlogComment

class BlogCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    class Meta:
        model = BlogComment
        fields = ['id','user_name','content','created_at']
    
    def get_user_name(self, obj):
        return obj.user.display_name or obj.user.get_full_name() or obj.user.username

class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    comments = BlogCommentSerializer(many=True, read_only=True)
    class Meta:
        model = BlogPost
        fields = ['id','author_name','title','slug','category','excerpt','content','cover_image','status','is_featured','views_count','likes_count','comments','created_at']
        read_only_fields = ['author','views_count','likes_count']

    def get_author_name(self, obj):
        return obj.author.display_name or obj.author.get_full_name() or obj.author.username
