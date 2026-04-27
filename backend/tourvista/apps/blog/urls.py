from django.urls import path
from .views import BlogListView, BlogDetailView, BlogCommentCreateView
urlpatterns = [
    path('', BlogListView.as_view()),
    path('<int:post_id>/comments/', BlogCommentCreateView.as_view()),
    path('<slug:slug>/', BlogDetailView.as_view()),
]
