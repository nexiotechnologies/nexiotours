import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Calendar, Users, MapPin, Package, CreditCard, ChevronRight, Clock, Award, Zap, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewModal from "../components/bookings/ReviewModal";

const statusColors = {
  pending: { bg: "rgba(255, 149, 0, 0.1)", color: "#FF9500" },
  confirmed: { bg: "rgba(48, 209, 88, 0.1)", color: "#30D158" },
  completed: { bg: "rgba(0, 122, 255, 0.1)", color: "#007AFF" },
  cancelled: { bg: "rgba(255, 69, 58, 0.1)", color: "#FF453A" },
  refunded: { bg: "rgba(255, 255, 255, 0.05)", color: "var(--text-gray)" }
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);
  const [filter, setFilter] = useState("All");
  const [loyalty, setLoyalty] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchLoyalty();
  }, []);

  const fetchLoyalty = async () => {
    try {
      const res = await api.get('/loyalty/account/');
      setLoyalty(res.data);
    } catch (err) {
      console.warn("No loyalty account found");
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/');
      const data = res.data.results || res.data || [];
      setBookings(data);
      setNextUrl(res.data.next || null);
    } catch (err) {
      toast.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextUrl || loadingMore) return;
    try {
      setLoadingMore(true);
      const res = await api.get(nextUrl);
      const newData = res.data.results || [];
      setBookings(prev => [...prev, ...newData]);
      setNextUrl(res.data.next || null);
    } catch (err) {
      toast.error("Failed to load more bookings");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCancelTrip = async (id, currentStatus) => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;
    try {
      await api.patch(`/bookings/${id}/`, { status: "cancelled" });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Cancelled" } : b));
      toast.success("Trip cancelled successfully. Inventory has been returned.");
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response?.data?.error || "Failed to cancel trip.");
    }
  };

  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status?.toLowerCase() === filter.toLowerCase());

  // Find nearest upcoming booking
  const upcomingBookings = bookings.filter(b => (b.status?.toLowerCase() === 'pending' || b.status?.toLowerCase() === 'confirmed') && new Date(b.check_in) >= new Date()).sort((a,b) => new Date(a.check_in) - new Date(b.check_in));
  const nearestTrip = upcomingBookings[0] || null;

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: "var(--bg-dark)", minHeight: "100vh", color: 'var(--text-white)' }}>
      <Navbar />
      
      {/* Background Gradients */}
      <div style={{ position: 'fixed', top: '20%', right: '0%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(0, 122, 255, 0.04) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '0%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(175, 82, 222, 0.04) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, paddingTop: 120, maxWidth: 1000, margin: "0 auto", padding: "120px 24px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>My Bookings</h1>
          <p style={{ color: "var(--text-gray)", fontSize: 16, marginBottom: 40, fontWeight: 500 }}>Manage your upcoming journeys and track your rewards.</p>
          
          {/* Dashboard Summary Widgets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
            
            {/* Loyalty Widget */}
            {loyalty && (
              <div className="glass-card" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 24, border: '1px solid var(--glass-border)' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gradient-aurora)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={28} color="#fff" />
                </div>
                <div>
                  <p style={{ color: 'var(--text-gray)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Loyalty Tier: <span style={{ color: '#fff' }}>{loyalty.tier}</span></p>
                  <h3 style={{ fontSize: 28, fontWeight: 800 }}>{loyalty.points} <span style={{ fontSize: 16, color: 'var(--text-gray)', fontWeight: 600 }}>pts</span></h3>
                </div>
              </div>
            )}

            {/* Next Trip Countdown */}
            {nearestTrip && (
              <div className="glass-card" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 24, border: '1px solid rgba(0, 122, 255, 0.3)', background: 'rgba(0,122,255,0.05)' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0, 122, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={28} color="var(--accent-blue)" />
                </div>
                <div>
                  <p style={{ color: 'var(--accent-blue)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Next Adventure</p>
                  <h3 style={{ fontSize: 18, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{nearestTrip.destination_name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-gray)', marginTop: 4 }}>{new Date(nearestTrip.check_in).toDateString()}</p>
                </div>
              </div>
            )}
          </div>
          
          <div style={{ display: "flex", gap: 12, marginBottom: 48, overflowX: 'auto', paddingBottom: 8 }}>
            {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map(s => (
              <button 
                key={s} 
                onClick={() => setFilter(s)} 
                style={{ 
                  padding: "10px 24px", 
                  borderRadius: 30, 
                  border: filter === s ? "1px solid var(--accent-blue)" : "1px solid var(--glass-border)", 
                  background: filter === s ? "rgba(0, 122, 255, 0.15)" : "rgba(255,255,255,0.03)", 
                  color: filter === s ? "var(--text-white)" : "var(--text-gray)", 
                  fontSize: 14, 
                  fontWeight: 600, 
                  cursor: "pointer",
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {loading ? (
            <div style={{ padding: 100, textAlign: 'center' }}>
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: 40, height: 40, border: '3px solid var(--accent-blue)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 20px' }} />
               <p style={{ color: 'var(--text-gray)' }}>Loading your trips...</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((b, i) => {
                const sc = statusColors[b.status?.toLowerCase()] || statusColors.pending;
                return (
                  <motion.div 
                    key={b.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card" 
                    style={{ padding: 0, overflow: "hidden", display: "flex", cursor: 'pointer' }}
                  >
                    <div style={{ width: 240, background: 'rgba(255,255,255,0.02)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {b.destination_image ? (
                        <img src={b.destination_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ fontSize: 48, opacity: 0.5 }}>{b.booking_type === 'hotel' ? '🏨' : b.booking_type === 'guide' ? '👤' : '🌅'}</div>
                      )}
                      <div style={{ position: 'absolute', top: 16, left: 16, background: sc.bg, color: sc.color, borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: `1px solid ${sc.color}30` }}>
                        {b.status}
                      </div>
                    </div>
                    
                    <div style={{ flex: 1, padding: 32 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                        <div>
                          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{b.destination_name || "Premium Experience"}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text-gray)', fontSize: 13, fontWeight: 600 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase' }}><Package size={14} /> {b.booking_type}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} /> {b.guests} Guests</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: 12, color: 'var(--text-gray)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Total Paid</p>
                          <p style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>₹{b.total_price}</p>
                        </div>
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr', gap: 24, background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: 16, marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,122,255,0.1)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={18} /></div>
                          <div>
                            <p style={{ fontSize: 11, color: 'var(--text-gray)', fontWeight: 700, textTransform: 'uppercase' }}>Check In</p>
                            <p style={{ fontSize: 14, fontWeight: 600 }}>{b.check_in}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(175, 82, 222, 0.1)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={18} /></div>
                          <div>
                            <p style={{ fontSize: 11, color: 'var(--text-gray)', fontWeight: 700, textTransform: 'uppercase' }}>Check Out</p>
                            <p style={{ fontSize: 14, fontWeight: 600 }}>{b.check_out}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", gap: 12 }}>
                        <button className="btn-outline" style={{ padding: "10px 24px", fontSize: 13 }}>View Invoice</button>
                        
                        {(b.status?.toLowerCase() === "confirmed" || b.status?.toLowerCase() === "pending") && (
                          <button onClick={() => handleCancelTrip(b.id, b.status)} className="btn-outline" style={{ padding: "10px 24px", fontSize: 13, borderColor: 'rgba(255,69,58,0.2)', color: '#FF453A' }}>
                            Cancel Trip
                          </button>
                        )}
                        
                        {b.status?.toLowerCase() === "completed" && (
                          <button onClick={() => setReviewBooking(b)} className="btn-primary" style={{ padding: "10px 24px", fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Star size={16} /> Leave Review
                          </button>
                        )}
                        
                        <button className="btn-outline" style={{ marginLeft: 'auto', padding: '10px 24px', fontSize: 13, border: 'none', background: 'rgba(255,255,255,0.05)' }}>Support</button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {!loading && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "80px 40px", background: 'rgba(255,255,255,0.01)', borderRadius: 32, border: '1px dashed var(--glass-border)' }}>
              <div style={{ fontSize: 64, marginBottom: 24 }}>🧳</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>No journeys found</h3>
              <p style={{ color: "var(--text-gray)", marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>It looks like you haven't booked any experiences yet. Start your next adventure today!</p>
              <Link to="/destinations" className="btn-primary" style={{ display: "inline-block", padding: '14px 32px' }}>Explore Destinations</Link>
            </motion.div>
          )}

          {nextUrl && filter === 'All' && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <button 
                onClick={handleLoadMore} 
                disabled={loadingMore}
                className="btn-outline"
                style={{ padding: '12px 32px', borderRadius: 30, fontSize: 15, fontWeight: 600 }}
              >
                {loadingMore ? "Fetching trips..." : "Load More Trips"}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ReviewModal 
        isOpen={!!reviewBooking} 
        onClose={() => setReviewBooking(null)} 
        booking={reviewBooking} 
      />
    </div>
  );
}
