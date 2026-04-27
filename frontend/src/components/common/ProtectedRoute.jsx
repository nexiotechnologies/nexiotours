import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoaded, role, loading } = useAuth();
  const [showSplash, setShowSplash] = React.useState(false);

  React.useEffect(() => {
    let timer;
    if ((loading || !isLoaded) && !role) {
      timer = setTimeout(() => setShowSplash(true), 800);
    } else {
      setShowSplash(false);
    }
    return () => clearTimeout(timer);
  }, [loading, isLoaded, role]);

  // Wait for session to load (guaranteed 2.5s safety timeout)
  if (loading && !role) {
    if (!showSplash) return null;
    return (
      <div style={{ minHeight: "100vh", background: "#050510", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: '#007AFF', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, letterSpacing: '0.05em' }}>VERIFYING ACCESS...</span>
      </div>
    );
  }

  // Not signed in
  if (!user) return <Navigate to="/login" replace />;

  // No role restriction — any authenticated user can access
  if (!allowedRoles) return children;

  // Check role directly from Clerk metadata (no backend needed)
  const rawRole = user.publicMetadata?.role || user.unsafeMetadata?.role;
  const currentRole = typeof rawRole === 'string' ? rawRole.toLowerCase() : '';

  const isAuthorized = allowedRoles.some(r => {
    const normalizedR = r.toLowerCase();
    return currentRole === normalizedR ||
      (normalizedR === 'business' && (currentRole.startsWith('bus') || currentRole.includes('business'))) ||
      (normalizedR === 'provider' && (currentRole.startsWith('pro') || currentRole.includes('provider')));
  });

  if (!isAuthorized) return <Navigate to="/" replace />;
  return children;
}
