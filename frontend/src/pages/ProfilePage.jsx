import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import { LogOut, Luggage, ExternalLink, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { SignOutButton, UserProfile } from "@clerk/react";

const TABS = ["Profile", "Preferences", "Notifications", "Security"];

export default function ProfilePage() {
  const { user, role, signOut, syncProfile } = useAuth();
  const [tab, setTab] = useState("Profile");
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadPromise = async () => {
      try {
        await user.setProfileImage({ file });
      } catch (err) {
        throw new Error("Failed to update profile photo");
      }
    };

    toast.promise(uploadPromise(), {
      loading: 'Uploading photo...',
      success: 'Photo updated!',
      error: (err) => err.message
    });
  };
  const [form, setForm] = useState({ 
    name: "", 
    username: "",
    email: "", 
    phone: "", 
    bio: "" 
  });
  const [notifs, setNotifs] = useState({ bookingUpdates: true, promoOffers: true, reviewReplies: true, newsletter: false });
  const [prefs, setPrefs] = useState({ categories: [], budget: "Mid-range", groupSize: "Solo" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile/');
        
        // Clerk is the source of truth for username
        // Backend may have a stale technical ID (user_3CXN...)
        const backendUsername = res.data.username || "";
        const clerkUsername = user?.username || "";
        const finalUsername = (backendUsername.startsWith('user_') || !backendUsername) 
          ? clerkUsername 
          : backendUsername;

        setForm({
          name: res.data.display_name || user?.fullName || "",
          username: finalUsername,
          email: res.data.email || user?.primaryEmailAddress?.emailAddress || "",
          phone: res.data.phone || user?.unsafeMetadata?.phone || "",
          bio: res.data.bio || user?.unsafeMetadata?.bio || ""
        });
        if (res.data.travel_preferences) {
          setPrefs(p => ({
            ...p,
            ...res.data.travel_preferences
          }));
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const setField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  
  const handleSave = async () => {
    setIsSaving(true);
    let backendSuccess = false;
    let identitySuccess = false;
    let errorDetail = "";
    let identityError = "";

    try {
      // 1. Update Backend (Database)
      await api.patch('/users/profile/', {
        display_name: form.name,
        username: form.username,
        phone: form.phone,
        bio: form.bio,
        travel_preferences: prefs
      });
      backendSuccess = true;
    } catch (err) {
      console.error("Backend Update Failed:", err);
      errorDetail = err.response?.data?.detail || JSON.stringify(err.response?.data) || "Server rejected changes.";
    }

    try {
      // 2. Update Clerk Profile (Global Identity)
      if (user) {
        const nameParts = form.name.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        
        const updateData = {
          unsafeMetadata: {
            ...user.unsafeMetadata,
            phone: form.phone,
            bio: form.bio,
            preferences: prefs
          }
        };

        // Only ask Clerk to update the username if it has ACTUALLY changed
        // This prevents the "additional verification required" error
        if (form.username !== user.username) {
          updateData.username = form.username;
        }

        console.log("Attempting Clerk user.update with:", { firstName, lastName, ...updateData });

        try {
          // Attempt 1: Try with names
          const payload1 = { ...updateData };
          if (firstName) payload1.firstName = firstName;
          if (lastName) payload1.lastName = lastName;
          
          await user.update(payload1);
          identitySuccess = true;
          console.log("Clerk update successful (with names)!");
        } catch (clerkErr) {
          console.warn("Clerk Full Update Failed. Reason:", clerkErr.errors?.[0]?.longMessage || clerkErr.message);
          console.warn("Retrying without names...");
          
          // Attempt 2: Try without names (names might be locked by Google)
          await user.update(updateData);
          identitySuccess = true;
          console.log("Clerk update successful (without names)!");
        }
      }
    } catch (err) {
      console.error("Identity Update Failed completely:", err);
      identityError = err.errors?.[0]?.longMessage || err.message || "Identity sync failed.";
    }

    if (backendSuccess && identitySuccess) {
      toast.success("Profile updated successfully!");
      await syncProfile();
    } else if (backendSuccess) {
      toast.error(`Backend saved, but Clerk failed: ${identityError}`);
      await syncProfile();
    } else {
      toast.error(`Update failed: ${errorDetail}`);
    }
    
    setIsSaving(false);
  };

  const inputStyle = { 
    width: "100%", 
    padding: "12px 16px", 
    background: 'rgba(255,255,255,0.03)',
    border: "1px solid var(--glass-border)", 
    borderRadius: 12, 
    fontSize: 14, 
    fontFamily: "inherit", 
    outline: "none",
    color: 'var(--text-white)',
    transition: 'var(--transition-smooth)'
  };

  const formatRole = (r) => {
    if (!r) return "Traveler";
    return r.charAt(0).toUpperCase() + r.slice(1).replace('_', ' ');
  };

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: "var(--bg-dark)", minHeight: "100vh", color: 'var(--text-white)' }}>
      <Navbar />
      
      {/* Dynamic Background Gradients */}
      <div style={{ position: 'fixed', top: '10%', left: '5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(175, 82, 222, 0.05) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 100, maxWidth: 1000, margin: "0 auto", padding: "120px 24px 80px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 40, background: "rgba(255,255,255,0.03)", padding: 6, borderRadius: 16, border: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)', width: "fit-content" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: tab === t ? "var(--accent-blue)" : "transparent", color: tab === t ? "#fff" : "var(--text-gray)", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: 'all 0.3s ease' }}>{t}</button>
          ))}
        </div>

        {tab === "Profile" && (
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 32 }}>
            <div className="glass-card" style={{ padding: 32, textAlign: "center", height: 'fit-content', position: 'sticky', top: 120 }}>
              <div style={{ position: 'relative', width: 120, height: 120, margin: "0 auto 24px" }}>
                <div style={{ width: '100%', height: '100%', borderRadius: "50%", background: "var(--gradient-aurora)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, boxShadow: '0 10px 30px rgba(0, 122, 255, 0.3)', overflow: 'hidden' }}>
                  {user?.imageUrl ? <img src={user.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                </div>
                <label 
                  htmlFor="photo-upload" 
                  style={{ 
                    position: 'absolute', 
                    bottom: 4, 
                    right: 4, 
                    width: 36, 
                    height: 36, 
                    borderRadius: '50%', 
                    background: 'var(--accent-blue)', 
                    color: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer', 
                    border: '3px solid var(--bg-dark)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Camera size={18} />
                </label>
                <input id="photo-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </div>
              
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user?.fullName || "Explorer"}</h3>
              <p style={{ color: "var(--text-gray)", fontSize: 13, marginBottom: 20 }}>{user?.primaryEmailAddress?.emailAddress || form.email}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 }}>
                <Link to="/my-bookings" className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px', fontSize: 13, textDecoration: 'none' }}>
                  <Luggage size={16} /> My Bookings
                </Link>
                
                {(role === 'admin' || role?.toLowerCase().includes('business') || role?.toLowerCase().includes('provider')) && (
                  <Link to={role === 'admin' ? '/admin' : '/business'} className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px', fontSize: 13, textDecoration: 'none', borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}>
                    <ExternalLink size={16} /> {role === 'admin' ? 'Admin Panel' : 'Vendor Hub'}
                  </Link>
                )}

                 <SignOutButton signOutCallback={() => window.location.href = '/'}>
                  <button 
                    style={{ 
                      marginTop: 8,
                      width: "100%", 
                      padding: "12px", 
                      borderRadius: 12, 
                      background: "rgba(255,69,58,0.1)", 
                      border: "1px solid rgba(255,69,58,0.2)", 
                      color: '#FF453A', 
                      fontSize: 13, 
                      fontWeight: 700, 
                      cursor: "pointer", 
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,69,58,0.2)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,69,58,0.1)'}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
            
            <div className="glass-card" style={{ padding: 40 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 32 }}>Personal Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div><label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-gray)", marginBottom: 8, display: "block", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label><input value={form.name} onChange={setField("name")} style={inputStyle} /></div>
                  <div><label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-gray)", marginBottom: 8, display: "block", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</label><input value={form.username} onChange={setField("username")} style={inputStyle} /></div>
                </div>
                <div><label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-gray)", marginBottom: 8, display: "block", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label><input type="email" value={form.email} disabled style={{ ...inputStyle, opacity: 0.6 }} /></div>
                <div><label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-gray)", marginBottom: 8, display: "block", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</label><input value={form.phone} onChange={setField("phone")} style={inputStyle} /></div>
                <div><label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-gray)", marginBottom: 8, display: "block", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bio</label><textarea value={form.bio} onChange={setField("bio")} style={{ ...inputStyle, height: 120, resize: "none" }} /></div>
                <button onClick={handleSave} disabled={isSaving} className="btn-primary" style={{ width: "fit-content", padding: "14px 40px", marginTop: 10 }}>{isSaving ? "Saving..." : "Save Changes"}</button>
              </div>
            </div>
          </div>
        )}

        {tab === "Preferences" && (
          <div className="glass-card" style={{ padding: 40 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 32 }}>Travel Preferences</h3>
            <div style={{ marginBottom: 40 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-gray)", marginBottom: 16, display: "block", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Favourite Categories</label>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {["Beach", "Mountains", "Cultural", "Luxury", "Wildlife", "City Tours", "Adventure"].map(c => {
                  const active = (prefs.categories || []).includes(c);
                  return (
                    <button 
                      key={c} 
                      onClick={() => setPrefs(p => ({ ...p, categories: active ? p.categories.filter(x => x !== c) : [...(p.categories || []), c] }))} 
                      style={{ 
                        padding: "10px 20px", 
                        borderRadius: 30, 
                        border: active ? "1px solid var(--accent-blue)" : "1px solid var(--glass-border)", 
                        background: active ? "rgba(0, 122, 255, 0.15)" : "rgba(255,255,255,0.03)", 
                        color: active ? "var(--accent-blue)" : "var(--text-gray)", 
                        fontSize: 14, 
                        fontWeight: 600, 
                        cursor: "pointer",
                        transition: 'all 0.3s'
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-gray)", marginBottom: 8, display: "block", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Budget Range</label>
                <select value={prefs.budget} onChange={e => setPrefs(p => ({ ...p, budget: e.target.value }))} style={{ ...inputStyle, width: "100%", cursor: 'pointer' }}>
                  {["Budget", "Mid-range", "Luxury"].map(b => <option key={b} value={b} style={{ background: '#111' }}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-gray)", marginBottom: 8, display: "block", textTransform: 'uppercase', letterSpacing: '0.05em' }}>Travel Group</label>
                <select value={prefs.groupSize} onChange={e => setPrefs(p => ({ ...p, groupSize: e.target.value }))} style={{ ...inputStyle, width: "100%", cursor: 'pointer' }}>
                  {["Solo", "Couple", "Family", "Group"].map(g => <option key={g} value={g} style={{ background: '#111' }}>{g}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleSave} disabled={isSaving} className="btn-primary" style={{ padding: "14px 40px" }}>{isSaving ? "Saving..." : "Save Preferences"}</button>
          </div>
        )}


        {tab === "Notifications" && (
          <div className="glass-card" style={{ padding: 40 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 32 }}>Notification Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ["bookingUpdates", "Booking Updates", "Get notified about booking status changes and confirmations"],
                ["promoOffers", "Promotional Offers", "Receive special deals, exclusive offers and discount codes"],
                ["reviewReplies", "Review Replies", "Get notified when someone replies to your destination reviews"],
                ["newsletter", "Weekly Newsletter", "Curated travel inspiration, tips and destination guides"]
              ].map(([key, label, desc]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", borderBottom: "1px solid var(--glass-border)" }}>
                  <div style={{ flex: 1, paddingRight: 40 }}>
                    <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{label}</p>
                    <p style={{ fontSize: 14, color: "var(--text-gray)" }}>{desc}</p>
                  </div>
                  <div 
                    onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))} 
                    style={{ 
                      width: 52, 
                      height: 28, 
                      borderRadius: 20, 
                      background: notifs[key] ? "var(--accent-blue)" : "rgba(255,255,255,0.1)", 
                      cursor: "pointer", 
                      position: "relative", 
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                      flexShrink: 0,
                      border: '1px solid var(--glass-border)'
                    }}
                  >
                    <div style={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: "50%", 
                      background: "#fff", 
                      position: "absolute", 
                      top: 3, 
                      left: notifs[key] ? 27 : 3, 
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", 
                      boxShadow: "0 2px 10px rgba(0,0,0,0.3)" 
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => toast.success("Settings saved locally.")} className="btn-primary" style={{ marginTop: 40, padding: "14px 40px" }}>Save Settings</button>
          </div>
        )}

        {tab === "Security" && (
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden', minHeight: 600, background: 'rgba(255,255,255,0.02)' }}>
            <UserProfile 
              routing="virtual"
              appearance={{
                variables: {
                  colorPrimary: '#007AFF',
                  colorText: '#ffffff',
                  colorBackground: 'transparent',
                  colorInputBackground: 'rgba(255,255,255,0.05)',
                  colorInputText: '#ffffff',
                  colorTextSecondary: '#d4d4d8',
                  fontFamily: "'Outfit', sans-serif"
                },
                elements: {
                  card: "bg-transparent shadow-none border-none",
                  navbar: "bg-transparent border-r border-white/5",
                  navbarButton: "text-zinc-300 hover:text-white hover:bg-white/10 transition-all",
                  headerTitle: "text-white text-2xl font-bold tracking-tight",
                  headerSubtitle: "text-zinc-200 font-medium",
                  profileSectionTitleText: "text-white font-bold text-lg",
                  breadcrumbsItem: "text-zinc-300",
                  breadcrumbsItem__active: "text-white font-semibold",
                  formButtonPrimary: "bg-blue-600 hover:bg-blue-700 transition-all font-bold",
                  userProfileContainer: "bg-transparent",
                  pageScrollBox: "bg-transparent",
                  profileSectionContent: "text-white",
                  formFieldLabel: "text-zinc-100 font-bold uppercase text-xs tracking-wider",
                  formFieldInput: "bg-white/5 border-white/10 text-white",
                  activeDeviceIcon: "text-blue-500",
                  footer: "hidden"
                }
              }}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
