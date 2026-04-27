import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ListingPage from "./pages/ListingPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ChatPage from "./pages/ChatPage";
import LoyaltyPage from "./pages/LoyaltyPage";
import ProfilePage from "./pages/ProfilePage";
import BusinessPortalPage from "./pages/BusinessPortalPage";
import HiddenLocationsPage from "./pages/HiddenLocationsPage";
import HiddenLocationDetail from "./pages/HiddenLocationDetail";
import AddHiddenLocationPage from "./pages/AddHiddenLocationPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFoundPage from "./pages/NotFoundPage";
import AddListingPage from "./pages/AddListingPage";

import SmoothScroll from "./components/layout/SmoothScroll";
import ClerkAuthHandler from "./components/common/ClerkAuthHandler";
import { useAuth } from "./context/AuthContext";

const OnboardingFlow = ({ children }) => {
  const { user, loading, isLoaded, role } = useAuth();
  const [showSplash, setShowSplash] = React.useState(false);

  React.useEffect(() => {
    let timer;
    if ((loading || !isLoaded) && !role) {
      timer = setTimeout(() => setShowSplash(true), 1000); // 1s grace period
    } else {
      setShowSplash(false);
    }
    return () => clearTimeout(timer);
  }, [loading, isLoaded, role]);

  const currentPath = window.location.pathname;
  const isAuthPage = ['/', '/onboarding', '/login', '/register', '/404'].includes(currentPath);

  // Show loading until our internal safety timer (guaranteed 2.5s) is ready
  // OPTIMIZATION: If we already have a role (from cache), skip the splash entirely
  if (loading && !role && !isAuthPage) {
    if (!showSplash) return null; // Keep screen blank (black) for the first 400ms
    return (
      <div style={{ minHeight: "100vh", background: "#050510", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
        {/* Dynamic Background Gradients */}
        <div style={{ position: 'fixed', top: '10%', left: '5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(175, 82, 222, 0.05) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />

        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: '#007AFF', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, letterSpacing: '0.05em' }}>VERIFYING SESSION...</span>
      </div>
    );
  }

  // If logged in but no role, and not already on onboarding/login/register
  if (isLoaded && user && !role && !isAuthPage) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <SmoothScroll>
          <Router>
            <ClerkAuthHandler />
            <OnboardingFlow>
              <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'Outfit',sans-serif", fontSize: 14, background: 'var(--bg-navy)', color: 'var(--text-white)', border: '1px solid var(--glass-border)' } }} />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />

                <Route path="/hidden-gems" element={<HiddenLocationsPage />} />
                <Route path="/hidden-gems/:id" element={<HiddenLocationDetail />} />
                <Route path="/hidden-gems/add" element={<ProtectedRoute><AddHiddenLocationPage /></ProtectedRoute>} />

                {/* Dynamic Vendor Listings */}
                <Route path="/tours" element={<ListingPage type="tours" endpoint="/destinations/tours/" title="Tour Packages" subtitle="Curated travel experiences for your next adventure." />} />
                <Route path="/tours/:id" element={<ListingDetailPage type="tours" />} />

                <Route path="/hotels" element={<ListingPage type="hotels" endpoint="/destinations/hotels/" title="Luxury Hotels" subtitle="Find premium accommodations for a perfect stay." />} />
                <Route path="/hotels/:id" element={<ListingDetailPage type="hotels" />} />

                <Route path="/guides" element={<ListingPage type="guides" endpoint="/destinations/guides/" title="Local Guides" subtitle="Hire expert local guides to show you around." />} />
                <Route path="/guides/:id" element={<ListingDetailPage type="guides" />} />

                <Route path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
                <Route path="/blog/:slug" element={<ProtectedRoute><BlogDetailPage /></ProtectedRoute>} />

                <Route path="/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
                <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/loyalty" element={<ProtectedRoute><LoyaltyPage /></ProtectedRoute>} />
                <Route path="/business" element={<ProtectedRoute allowedRoles={["business", "provider", "business_owner", "service_provider"]}><BusinessPortalPage /></ProtectedRoute>} />
                <Route path="/business/add" element={<ProtectedRoute allowedRoles={["business", "provider", "business_owner", "service_provider"]}><AddListingPage /></ProtectedRoute>} />
                <Route path="/business/edit/:id" element={<ProtectedRoute allowedRoles={["business", "provider", "business_owner", "service_provider"]}><AddListingPage isEdit={true} /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/404" replace />} />
                <Route path="/404" element={<NotFoundPage />} />
              </Routes>
            </OnboardingFlow>
          </Router>
        </SmoothScroll>
      </BookingProvider>
    </AuthProvider>
  );
}
