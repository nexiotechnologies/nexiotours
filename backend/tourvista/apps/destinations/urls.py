from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TourPackageViewSet, HotelViewSet, GuideServiceViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'tours', TourPackageViewSet)
router.register(r'hotels', HotelViewSet)
router.register(r'guides', GuideServiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
