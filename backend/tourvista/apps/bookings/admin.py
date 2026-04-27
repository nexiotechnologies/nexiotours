from django.contrib import admin
from .models import Booking, PromoCode

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_reference','user','booking_type','status','total_price','created_at']
    list_filter = ['status','booking_type']
    search_fields = ['booking_reference','user__username']

admin.site.register(PromoCode)
