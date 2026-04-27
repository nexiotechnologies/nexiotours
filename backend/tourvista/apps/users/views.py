from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer, RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self):
        return self.request.user

class ClerkSyncView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        user = request.user
        changed = False
        
        first_name = request.data.get('first_name')
        if first_name and user.first_name != first_name:
            user.first_name = first_name
            changed = True
            
        last_name = request.data.get('last_name')
        if last_name and user.last_name != last_name:
            user.last_name = last_name
            changed = True
        
        username = request.data.get('username')
        full_name = request.data.get('full_name')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        
        # Priority: Full Name > Parts > Username fallback
        new_name = full_name
        if not new_name and (first_name or last_name):
            new_name = f"{first_name or ''} {last_name or ''}".strip()
        if not new_name:
            new_name = username
            
        if new_name and user.display_name != new_name:
            user.display_name = new_name
            changed = True
        
        if username and user.username != username:
            user.username = username
            changed = True
            
        email = request.data.get('email')
        if email and user.email != email:
            user.email = email
            changed = True
        
        role = request.data.get('role')
        if role:
            role_norm = str(role).lower().strip().replace(' ', '_')
            if 'business' in role_norm or 'busniss' in role_norm or 'businiess' in role_norm:
                role_norm = 'business'
            elif 'provider' in role_norm:
                role_norm = 'provider'
            
            if role_norm in dict(User.ROLE_CHOICES) and user.role != role_norm:
                user.role = role_norm
                changed = True
            
        if changed:
            user.save()
            print(f"DEBUG: Profile updated for {user.username}")
        
        return Response({'status': 'profile synced', 'role': user.role}, status=status.HTTP_200_OK)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    search_fields = ['username','email','first_name','last_name']
    filterset_fields = ['role','is_verified']
