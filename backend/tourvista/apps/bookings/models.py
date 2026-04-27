from django.db import models
from tourvista.apps.users.models import User
from tourvista.apps.destinations.models import TourPackage, Hotel, GuideService

class Booking(models.Model):
    TYPE_CHOICES = [('tour','Tour'),('hotel','Hotel'),('guide','Guide')]
    STATUS_CHOICES = [('pending','Pending'),('confirmed','Confirmed'),('completed','Completed'),('cancelled','Cancelled'),('refunded','Refunded')]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    
    tour = models.ForeignKey(TourPackage, on_delete=models.CASCADE, null=True, blank=True, related_name='bookings')
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, null=True, blank=True, related_name='bookings')
    guide_service = models.ForeignKey(GuideService, on_delete=models.CASCADE, null=True, blank=True, related_name='bookings')
    
    booking_type = models.CharField(max_length=20, choices=TYPE_CHOICES, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    promo_code = models.CharField(max_length=50, blank=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    special_requests = models.TextField(blank=True)
    booking_reference = models.CharField(max_length=20, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        old_status = None
        if not is_new:
            try:
                old_instance = Booking.objects.get(pk=self.pk)
                old_status = old_instance.status
            except Booking.DoesNotExist:
                pass

        if not self.booking_reference:
            import uuid
            self.booking_reference = 'BK' + str(uuid.uuid4())[:8].upper()
        
        # Deduct inventory on new booking
        if is_new:
            if self.tour and self.tour.capacity >= self.guests:
                self.tour.capacity -= self.guests
                self.tour.save()
            elif self.hotel and self.hotel.total_rooms >= self.guests:
                self.hotel.total_rooms -= self.guests
                self.hotel.save()
        
        # Restore inventory on cancellation/refund if it was previously active
        elif old_status in ['pending', 'confirmed'] and self.status in ['cancelled', 'refunded']:
            if self.tour:
                self.tour.capacity += self.guests
                self.tour.save()
            elif self.hotel:
                self.hotel.total_rooms += self.guests
                self.hotel.save()
                
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_reference} - {self.user.username}"

class PromoCode(models.Model):
    code = models.CharField(max_length=50, unique=True, db_index=True)
    discount_percent = models.PositiveIntegerField()
    max_uses = models.PositiveIntegerField(default=100)
    uses_count = models.PositiveIntegerField(default=0)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self): return self.code
