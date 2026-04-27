import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth, useSignIn, useSignUp } from '@clerk/react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const { user } = useUser();
  const { isLoaded, userId, sessionId, getToken, signOut: clerkSignOut } = useAuth();
  const { isLoaded: signInLoaded, signIn: clerkSignIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp: clerkSignUp, setActive: setSignUpActive } = useSignUp();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(() => localStorage.getItem('user_role')); // Initialize from cache
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('user_name'));

  const syncProfile = async () => {
    if (isLoaded && user) {
      try {
        const api = (await import('../utils/api')).default;
        const res = await api.get(`/users/profile/?t=${Date.now()}`);

        if (res.data) {
          if (res.data.role) {
            const backendRole = res.data.role.toLowerCase().trim();
            setRole(backendRole);
            localStorage.setItem('user_role', backendRole); // Persist
            if (user.unsafeMetadata?.role !== backendRole) {
              await user.update({ unsafeMetadata: { ...user.unsafeMetadata, role: backendRole } });
            }
          }
          if (res.data.display_name) {
            setDisplayName(res.data.display_name);
            localStorage.setItem('user_name', res.data.display_name);
          }
        }
      } catch (err) {
        console.warn("Profile sync failed", err);
      } finally {
        setLoading(false);
      }
    } else if (isLoaded && !user) {
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      const rawRole = user.publicMetadata?.role || user.unsafeMetadata?.role;
      if (rawRole) {
        const r = String(rawRole).toLowerCase();
        setRole(r);
        localStorage.setItem('user_role', r);
      }
      setDisplayName(user.fullName || null);
    }
  }, [isLoaded, user]);

  // Sync with backend whenever user/isLoaded changes
  useEffect(() => {
    if (isLoaded && user) {
      syncProfile();
    } else if (isLoaded && !userId) {
      setLoading(false);
    }
  }, [isLoaded, userId]);

  // Fast safety timeout (2s is usually enough for local)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const signUp = async (email, password, role, fullName) => {
    if (!signUpLoaded) return { error: { message: "Sign up not loaded" } };
    try {
      const result = await clerkSignUp.create({
        emailAddress: email,
        password: password,
        unsafeMetadata: { role, full_name: fullName }
      });
      return { data: result, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const signIn = async (email, password) => {
    if (!signInLoaded) return { error: { message: "Sign in not loaded" } };
    try {
      const result = await clerkSignIn.create({
        identifier: email,
        password: password,
      });
      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId });
        const token = await getToken();
        if (token) localStorage.setItem('access_token', token);
      }
      return { data: result, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const signInWithGoogle = async () => {
    if (!signInLoaded) return;
    return clerkSignIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/'
    });
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // 1. Clear ALL local caches immediately
      localStorage.clear(); 
      sessionStorage.clear();
      
      // 2. Clear state
      setRole(null);
      setDisplayName(null);

      // 3. Tell Clerk to sign out and wait for it
      if (clerkSignOut) {
        await clerkSignOut();
      }
      
      // 4. Force a hard redirect to home
      window.location.replace('/');
    } catch (err) {
      console.error("Sign out failed, forcing redirect", err);
      localStorage.clear();
      window.location.replace('/');
    }
  };

  const resetPassword = async (email) => {
    if (!signInLoaded) return;
    try {
      const result = await clerkSignIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      return { data: result, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const updatePassword = async (newPassword) => {
    if (!user) return;
    try {
      const result = await user.update({ password: newPassword });
      return { data: result, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  return (
    <AuthContext.Provider value={{
      user: user || null,
      role,
      displayName,
      loading: loading,
      isLoaded: isLoaded,
      signUp, signIn, signInWithGoogle, signOut,
      resetPassword, updatePassword,
      syncProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
