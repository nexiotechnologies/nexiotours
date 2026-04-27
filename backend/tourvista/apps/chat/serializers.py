from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    class Meta:
        model = Message
        fields = ['id','conversation','sender_name','content','is_read','created_at']
        read_only_fields = ['sender']

class ConversationSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    class Meta:
        model = Conversation
        fields = ['id','participants','last_message','updated_at']
    def get_last_message(self, obj):
        msg = obj.messages.last()
        return MessageSerializer(msg).data if msg else None
