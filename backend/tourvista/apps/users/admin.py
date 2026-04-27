from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username','email','role','is_verified','created_at']
    list_filter = ['role','is_verified']
    fieldsets = UserAdmin.fieldsets + (('Extra', {'fields': ('role','phone','bio','avatar','is_verified','travel_preferences')}),)
