from rest_framework import permissions

class IsBusinessOrProvider(permissions.BasePermission):
    """
    Allows access only to users with 'business' or 'provider' roles.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        role = request.user.role
        if not role:
            return False
            
        role_norm = role.lower()
        return (
            'business' in role_norm or 
            'provider' in role_norm or 
            'admin' in role_norm # Admins should have all access
        )

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `owner`.
        return obj.owner == request.user
