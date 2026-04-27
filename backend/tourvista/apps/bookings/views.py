from django.db import models
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking, PromoCode
from .serializers import BookingSerializer, PromoCodeSerializer
import datetime

class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin': return Booking.objects.all()
        return Booking.objects.filter(user=user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        if self.request.user.role == 'admin': return Booking.objects.all()
        return Booking.objects.filter(user=self.request.user)
        
    def perform_update(self, serializer):
        user = self.request.user
        if user.role != 'admin' and 'status' in serializer.validated_data:
            new_status = serializer.validated_data['status']
            if new_status in ['completed', 'refunded']:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Travelers cannot set this status directly.")
        serializer.save()

class VendorBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Booking.objects.filter(
            models.Q(tour__owner=user) | 
            models.Q(hotel__owner=user) | 
            models.Q(guide_service__owner=user)
        ).select_related('user', 'tour', 'hotel', 'guide_service')

class UpdateBookingStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            # Check if user owns the service
            owner = None
            if booking.tour: owner = booking.tour.owner
            elif booking.hotel: owner = booking.hotel.owner
            elif booking.guide_service: owner = booking.guide_service.owner
            
            if owner != request.user and request.user.role != 'admin':
                return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            
            new_status = request.data.get('status')
            if new_status in dict(Booking.STATUS_CHOICES):
                booking.status = new_status
                booking.save()
                return Response({'status': 'updated'})
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        except Booking.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

class ValidatePromoCodeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        code = request.data.get('code')
        try:
            promo = PromoCode.objects.get(code=code, is_active=True)
            now = datetime.datetime.now(datetime.timezone.utc)
            if promo.valid_from <= now <= promo.valid_until and promo.uses_count < promo.max_uses:
                return Response({'valid': True, 'discount': promo.discount_percent})
        except PromoCode.DoesNotExist:
            pass
        return Response({'valid': False}, status=status.HTTP_400_BAD_REQUEST)
