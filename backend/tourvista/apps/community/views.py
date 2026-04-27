from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import HiddenLocation, GemRating, GemComment
from .serializers import HiddenLocationSerializer, GemRatingSerializer, GemCommentSerializer

from tourvista.auth.permissions import IsOwnerOrReadOnly

class HiddenLocationViewSet(viewsets.ModelViewSet):
    queryset = HiddenLocation.objects.select_related('owner').prefetch_related('comments__user', 'ratings').order_by('-created_at')
    serializer_class = HiddenLocationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'location']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def rate(self, request, pk=None):
        location = self.get_object()
        score = request.data.get('score')
        if not score or not (1 <= int(score) <= 5):
            return Response({'error': 'Invalid score'}, status=status.HTTP_400_BAD_REQUEST)
        
        rating, created = GemRating.objects.update_or_create(
            user=request.user, location=location,
            defaults={'score': int(score)}
        )
        return Response({'status': 'rating set'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def comment(self, request, pk=None):
        location = self.get_object()
        text = request.data.get('text')
        if not text:
            return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        GemComment.objects.create(user=request.user, location=location, text=text)
        return Response({'status': 'comment added'}, status=status.HTTP_201_CREATED)
