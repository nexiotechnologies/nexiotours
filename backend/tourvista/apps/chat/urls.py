from django.urls import path
from .views import ConversationListView, MessageListView

urlpatterns = [
    path('', ConversationListView.as_view()),
    path('<int:conv_id>/messages/', MessageListView.as_view()),
]
