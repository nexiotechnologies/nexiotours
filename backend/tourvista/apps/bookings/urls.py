from django.urls import path
from .views import (
    BookingListCreateView, BookingDetailView, ValidatePromoCodeView,
    VendorBookingListView, UpdateBookingStatusView
)

urlpatterns = [
    path('my-bookings/', BookingListCreateView.as_view(), name='booking-list'),
    path('vendor/', VendorBookingListView.as_view(), name='vendor-bookings'),
    path('<int:pk>/status/', UpdateBookingStatusView.as_view(), name='update-booking-status'),
    path('<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('promo/validate/', ValidatePromoCodeView.as_view(), name='validate-promo'),
]
