from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, TourPackage, Hotel, GuideService
from .serializers import CategorySerializer, TourPackageSerializer, HotelSerializer, GuideServiceSerializer

from tourvista.auth.permissions import IsOwnerOrReadOnly, IsBusinessOrProvider

class TourPackageViewSet(viewsets.ModelViewSet):
    queryset = TourPackage.objects.select_related('owner', 'category')
    serializer_class = TourPackageSerializer
    search_fields = ['name', 'location', 'description']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'my_listings']:
            return [permissions.IsAuthenticated(), IsBusinessOrProvider(), IsOwnerOrReadOnly()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer): serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-listings')
    def my_listings(self, request):
        queryset = self.get_queryset().filter(owner=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.select_related('owner')
    serializer_class = HotelSerializer
    search_fields = ['name', 'location', 'description']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'my_listings']:
            return [permissions.IsAuthenticated(), IsBusinessOrProvider(), IsOwnerOrReadOnly()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer): serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-listings')
    def my_listings(self, request):
        queryset = self.get_queryset().filter(owner=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class GuideServiceViewSet(viewsets.ModelViewSet):
    queryset = GuideService.objects.select_related('owner')
    serializer_class = GuideServiceSerializer
    search_fields = ['guide_name', 'location', 'description']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'my_listings']:
            return [permissions.IsAuthenticated(), IsBusinessOrProvider(), IsOwnerOrReadOnly()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer): serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-listings')
    def my_listings(self, request):
        queryset = self.get_queryset().filter(owner=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
