from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HiddenLocationViewSet

router = DefaultRouter()
router.register(r'hidden-locations', HiddenLocationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
