from rest_framework import serializers
from .models import LoyaltyAccount, PointsTransaction

class PointsTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointsTransaction
        fields = ['id','type','points','description','created_at']

class LoyaltyAccountSerializer(serializers.ModelSerializer):
    transactions = PointsTransactionSerializer(many=True, read_only=True)
    class Meta:
        model = LoyaltyAccount
        fields = ['id','points','tier','total_earned','total_redeemed','referral_code','transactions']
