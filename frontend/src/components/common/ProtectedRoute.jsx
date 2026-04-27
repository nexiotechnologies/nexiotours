import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoaded } = useUser();

  // Wait for Clerk to load (this is fast, just checking local session)
  if (!isLoaded) {
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
