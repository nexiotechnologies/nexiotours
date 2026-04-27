from django.contrib import admin
from .models import Review, ReviewReply

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user','rating','is_approved','is_verified_booking','created_at']
    list_filter = ['rating','is_approved','is_verified_booking']
    actions = ['approve_reviews']
    def approve_reviews(self, request, queryset): queryset.update(is_approved=True)

admin.site.register(ReviewReply)
