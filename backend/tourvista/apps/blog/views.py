from rest_framework import generics, permissions
from .models import BlogPost
from .serializers import BlogPostSerializer

class BlogListView(generics.ListCreateAPIView):
    serializer_class = BlogPostSerializer
    filterset_fields = ['category','is_featured','status']
    search_fields = ['title','excerpt','content']
    def get_queryset(self):
        return BlogPost.objects.select_related('author').prefetch_related('comments__user').filter(status='published')
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    def get_permissions(self):
        return [permissions.IsAdminUser()] if self.request.method == 'POST' else [permissions.AllowAny()]

class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BlogPost.objects.select_related('author').prefetch_related('comments__user')
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'
    def get_permissions(self):
        return [permissions.IsAdminUser()] if self.request.method in ['PUT','PATCH','DELETE'] else [permissions.AllowAny()]

from .serializers import BlogCommentSerializer
class BlogCommentCreateView(generics.CreateAPIView):
    serializer_class = BlogCommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
        post = generics.get_object_or_404(BlogPost, id=self.kwargs.get('post_id'))
        serializer.save(user=self.request.user, post=post)
