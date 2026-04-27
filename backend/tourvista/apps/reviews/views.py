from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    def get_queryset(self):
        dest = self.request.query_params.get('destination')
        qs = Review.objects.filter(is_approved=True).select_related('user','destination')
        if dest: qs = qs.filter(destination__slug=dest)
        return qs
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        if self.request.user.role == 'admin': return Review.objects.all()
        return Review.objects.filter(user=self.request.user)
