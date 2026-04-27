from django.contrib import admin
from .models import BlogPost, BlogComment

@admin.register(BlogPost)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['title','author','category','status','is_featured','created_at']
    list_filter = ['status','is_featured','category']
    prepopulated_fields = {'slug':('title',)}

admin.site.register(BlogComment)
