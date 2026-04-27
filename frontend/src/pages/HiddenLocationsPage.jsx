import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, MapPin, Star, Plus, Map, Share2, MessageCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { CloudinaryImage } from "../components/common/CloudinaryMedia";

export default function HiddenLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [nextUrl, setNextUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLocations(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchLocations = async (search = "") => {
    try {
      setLoading(true);
      setError(null);
      const url = search ? `/community/hidden-locations/?search=${search}` : '/community/hidden-locations/';
      const res = await api.get(url);
      setLocations(res.data.results || res.data);
      setNextUrl(res.data.next || null);
    } catch (err) {
      console.error("DEBUG: Failed to load gems", err.response?.data || err.message);
      setError("Failed to load community gems");
      toast.error("Failed to load community gems");
    } finally {
      setLoading(false);
    }
  };

  const [error, setError] = useState(null);

  const handleLoadMore = async () => {
    if (!nextUrl) return;
    try {
      setLoadingMore(true);
      const res = await api.get(nextUrl);
      setLocations([...locations, ...(res.data.results || [])]);
      setNextUrl(res.data.next || null);
    } catch (err) {
      toast.error("Failed to load more locations");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: 'var(--bg-dark)' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ paddingTop: 160, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '5%',
          width: '40%', height: '40%',
          background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)',
          filter: 'blur(100px)', zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: 24, letterSpacing: '-0.04em' }}>
              Hidden <span className="text-gradient">Gems.</span>
            </h1>
            <p style={{ color: 'var(--text-gray)', fontSize: 18, maxWidth: 600, margin: '0 auto 48px', fontWeight: 500 }}>
              Curated by our community of world explorers. Discover what's missing from the map.
            </p>

            {user && (
              <button
                onClick={() => navigate('/hidden-locations/add')}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 auto 48px', padding: '14px 28px' }}
              >
                <Plus size={18} /> Share a Discovery
              </button>
            )}

            {/* Search Bar */}
            <div style={{
              maxWidth: 500, margin: '0 auto', position: 'relative',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 20, padding: '12px 24px',
              display: 'flex', alignItems: 'center', gap: 15,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              <Globe size={20} color="var(--accent-blue)" style={{ opacity: 0.8 }} />
              <input
                type="text"
                placeholder="Search by location or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none', border: 'none', color: '#fff',
                  fontSize: 16, width: '100%', outline: 'none',
                  fontWeight: 500
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ background: 'none', border: 'none', color: 'var(--text-gray)', cursor: 'pointer' }}
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Discovery Grid */}
      <section className="container" style={{ flex: 1, paddingBottom: 120 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent' }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'var(--text-gray)', padding: 100 }}>
            <Map size={48} style={{ opacity: 0.2, marginBottom: 20 }} />
            <h3 style={{ fontSize: 24, color: '#fff' }}>{error}</h3>
            <p style={{ marginBottom: 32 }}>We couldn't reach the explorers' network.</p>
            <button onClick={() => fetchLocations(searchQuery)} className="btn-primary" style={{ padding: '10px 24px' }}>Try Again</button>
          </div>
        ) : locations.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-gray)', padding: 100 }}>
            <Map size={48} style={{ opacity: 0.2, marginBottom: 20 }} />
            <h3 style={{ fontSize: 24, color: '#fff' }}>The map is currently quiet.</h3>
            <p>Be the first to share a hidden gem!</p>
          </div>
        ) : (
          <div className="gem-grid">
            {locations.map((loc, i) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card"
                onClick={() => navigate(`/hidden-locations/${loc.id}`)}
                style={{ overflow: 'hidden', cursor: 'pointer' }}
              >
                <div style={{ height: 220, position: 'relative', overflow: 'hidden' }}>
                  <img src={loc.images[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000'} alt={loc.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }} className="gem-img" />
                  <div style={{ position: 'absolute', top: 20, left: 20, padding: '6px 14px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={14} color="#FFD700" fill="#FFD700" /> {loc.average_rating.toFixed(1)}
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-gray)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                    <MapPin size={14} color="var(--accent-blue)" /> {loc.location}
                  </div>
                  <h3 style={{ fontSize: 24, marginBottom: 16, letterSpacing: '-0.02em', color: '#fff' }}>{loc.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, color: 'var(--text-gray)', fontSize: 14, fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MessageCircle size={16} /> {loc.comments.length}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Share2 size={16} /> Share
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {nextUrl && (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              style={{
                padding: '12px 32px', borderRadius: 30,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 16, fontWeight: 600,
                cursor: loadingMore ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {loadingMore ? 'Loading gems...' : 'Load More Gems'}
            </button>
          </div>
        )}
      </section>

      <Footer />
      <style>{`
        .glass-card:hover .gem-img { transform: scale(1.08); }
        .gem-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1200px) {
          .gem-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .gem-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .gem-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
