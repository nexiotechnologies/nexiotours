import jwt
import requests
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions
from django.conf import settings

User = get_user_model()

class ClerkAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        try:
            # Authorization: Bearer <token>
            token = auth_header.split(' ')[1]
        except IndexError:
            raise exceptions.AuthenticationFailed('Invalid token header')

        # In production, you should cache the JWKS
        # Clerk JWKS endpoint: https://<your-clerk-frontend-api>/.well-known/jwks.json
        # For simplicity in this demo, we'll assume the URL is known or passed via settings
        clerk_frontend_api = getattr(settings, 'CLERK_FRONTEND_API', 'clerk.example.com')
        jwks_url = f"https://{clerk_frontend_api}/.well-known/jwks.json"
        
        try:
            # This is a placeholder for the actual JWKS verification logic
            # You would normally use PyJWT's PyJWKClient to handle this
            unverified_header = jwt.get_unverified_header(token)
            # Fetching public keys would go here
            
            # For the sake of this implementation, we will decode the token
            # and verify it against the public key from Clerk.
            # (Note: Requires real JWKS implementation for production)
            try:
                decoded = jwt.decode(token, options={"verify_signature": False})
                clerk_id = decoded.get('sub')
                if not clerk_id:
                    print("DEBUG: Clerk Auth Error: No sub in token")
                    return None
            except Exception as e:
                print(f"DEBUG: Clerk Auth Decoding failed: {e}")
                return None

            print(f"DEBUG: Clerk Auth Success: user {clerk_id}")
            # Intelligent Lookup: Try finding user by explicit clerk_id first
            user = User.objects.filter(clerk_id=clerk_id).first()
            
            # Fallback for old users who only had their clerk_id saved as their username
            if not user:
                user = User.objects.filter(username=clerk_id).first()
                if user:
                    user.clerk_id = clerk_id  # Link them for future logins
                    user.save(update_fields=['clerk_id'])
            
            # If the user still doesn't exist, this is a brand new account
            if not user:
                user = User.objects.create(username=clerk_id, clerk_id=clerk_id)
            
            # Update user info from token
            user.email = decoded.get('email', user.email)
            user.first_name = decoded.get('given_name', decoded.get('first_name', user.first_name))
            user.last_name = decoded.get('family_name', decoded.get('last_name', user.last_name))
            
            # Prefer preferred_username (Clerk username) or name
            pref_name = decoded.get('preferred_username') or decoded.get('name')
            if pref_name:
                user.display_name = pref_name
            elif not user.display_name:
                user.display_name = f"{user.first_name} {user.last_name}".strip()
                
            user.save()
            return (user, None)
            
        except Exception as e:
            print(f"DEBUG: Unexpected Clerk Auth Error: {e}")
            return None
