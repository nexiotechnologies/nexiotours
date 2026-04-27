import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/react';
import { setTokenFetcher } from '../../utils/api';

/**
 * Syncs the Clerk getToken function with the axios api instance.
 * Place this component inside ClerkProvider and AuthProvider.
 */
export default function ClerkAuthHandler() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setTokenFetcher(async () => {
        try {
          return await getToken();
        } catch (err) {
          console.error("Clerk Token Error:", err);
          return null;
        }
      });

      // Role-Based Redirection
      const rawRole = user.publicMetadata?.role || user.unsafeMetadata?.role || 'traveler';
      const normalizedRole = typeof rawRole === 'string' ? rawRole.toLowerCase() : 'traveler';
      
      // Robust vendor check: includes 'business', 'provider', 'vendor', and common typos
      const isVendor = normalizedRole.includes('bus') || normalizedRole.includes('pro') || normalizedRole.includes('vendor');

      const currentPath = window.location.pathname;
      const isPublicLanding = currentPath === '/' || currentPath === '/login' || currentPath === '/register';
      
      if (isVendor && isPublicLanding) {
        console.log("DEBUG: vendor detected on landing page, redirecting to hub...");
        navigate('/business');
      }

      // After setting token fetcher, sync profile
      const syncProfile = async () => {
        try {
          const api = (await import('../../utils/api')).default;
          console.log("DEBUG: Attempting profile sync for", user.id);
          const res = await api.post('/users/clerk-sync/', {
            first_name: user.firstName,
            last_name: user.lastName,
            full_name: user.fullName,
            username: user.username,
            email: user.primaryEmailAddress?.emailAddress,
            role: user.publicMetadata?.role || user.unsafeMetadata?.role
          });
          
          // Align Clerk's metadata if the backend has an assigned role
          if (res.data.role && user.unsafeMetadata?.role !== res.data.role) {
            await user.update({
              unsafeMetadata: { ...user.unsafeMetadata, role: res.data.role }
            });
          }
        } catch (err) {
          console.error("Clerk sync failed:", err);
        }
      };
      syncProfile();
    } else if (isLoaded && !isSignedIn) {
      setTokenFetcher(() => null);
    }
  }, [isLoaded, isSignedIn, getToken, user]);

  return null;
}
