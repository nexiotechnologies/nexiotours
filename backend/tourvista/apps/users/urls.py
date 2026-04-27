from django.urls import path
from .views import RegisterView, ProfileView, UserListView, ClerkSyncView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('clerk-sync/', ClerkSyncView.as_view(), name='clerk-sync'),
    path('', UserListView.as_view(), name='user-list'),
]
