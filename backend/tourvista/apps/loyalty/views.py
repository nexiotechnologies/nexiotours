from rest_framework import generics, permissions
from .models import LoyaltyAccount
from .serializers import LoyaltyAccountSerializer

class LoyaltyAccountView(generics.RetrieveAPIView):
    serializer_class = LoyaltyAccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self):
        account, _ = LoyaltyAccount.objects.get_or_create(user=self.request.user)
        return account
