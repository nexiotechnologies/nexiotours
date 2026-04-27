from django.contrib import admin
from .models import HiddenLocation, GemRating, GemComment

@admin.register(HiddenLocation)
class HiddenLocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'location', 'created_at')
    search_fields = ('name', 'location', 'description')

@admin.register(GemRating)
class GemRatingAdmin(admin.ModelAdmin):
    list_display = ('location', 'user', 'score', 'created_at')

@admin.register(GemComment)
class GemCommentAdmin(admin.ModelAdmin):
    list_display = ('location', 'user', 'created_at')
