from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', include('tourvista.apps.users.urls')),
    path('api/destinations/', include('tourvista.apps.destinations.urls')),
    path('api/bookings/', include('tourvista.apps.bookings.urls')),
    path('api/reviews/', include('tourvista.apps.reviews.urls')),
    path('api/chat/', include('tourvista.apps.chat.urls')),
    path('api/notifications/', include('tourvista.apps.notifications.urls')),
    path('api/blog/', include('tourvista.apps.blog.urls')),
    path('api/loyalty/', include('tourvista.apps.loyalty.urls')),
    path('api/community/', include('tourvista.apps.community.urls')),
]
