import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, ArrowRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../utils/api";
import { CloudinaryImage } from "../components/common/CloudinaryMedia";

export default function ListingPage({ type, endpoint, title, subtitle }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [nextUrl, setNextUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(location.search);
        const q = queryParams.get("q");
        let url = endpoint;
        if (q) url += `?search=${encodeURIComponent(q)}`;

        const res = await api.get(url);
        setListings(res.data.results || res.data);
        setNextUrl(res.data.next || null);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [endpoint, location.search]);

  const handleLoadMore = async () => {
    if (!nextUrl) return;
    try {
      setLoadingMore(true);
      const res = await api.get(nextUrl);
      setListings([...listings, ...(res.data.results || [])]);
      setNextUrl(res.data.next || null);
    } catch (err) {
      console.error("Error loading more:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filtered = listings.filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.location?.toLowerCase().includes(search.toLowerCase()) ||
    l.guide_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-dark)" }}>
      <Navbar />

      <div style={{ paddingTop: 160, paddingBottom: 60, position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: 20, letterSpacing: '-0.04em' }}>{title}</h1>
            <p style={{ color: 'var(--text-gray)', fontSize: 18, maxWidth: 600, margin: '0 auto 48px', fontWeight: 500 }}>{subtitle}</p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', maxWidth: 700, margin: '0 auto' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '0 18px' }}>
                <Search size={18} color="var(--text-gray)" />
                <input
                  type="text" placeholder={`Search ${type}...`}
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ flex: 1, background: 'transparent', padding: '16px', fontSize: 15, color: 'var(--text-white)', fontWeight: 500 }}
                />
              </div>
              <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: '14px', fontSize: 13 }}>
                <SlidersHorizontal size={16} /> Filters
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ flex: 1, padding: '0 48px 120px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-gray)' }}>
            <MapPin size={48} strokeWidth={1} style={{ opacity: 0.2, marginBottom: 16 }} />
            <h3 style={{ fontSize: 24, color: 'var(--text-white)' }}>No results found</h3>
            <p style={{ marginTop: 8 }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                className="glass-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: (idx % 3) * 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <Link to={`/${type}/${item.id}`} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: 260, overflow: 'hidden', position: 'relative' }}>
                    <CloudinaryImage
                      publicId={item.main_image}
                      alt={item.name || item.guide_name}
                      className="listing-img"
                      width={800}
                      height={500}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                    <div style={{ position: 'absolute', top: 16, right: 16, padding: '6px 14px', background: '#fff', borderRadius: '12px', fontSize: 13, fontWeight: 800, color: '#000' }}>
                      ₹{item.base_price || item.price_per_night || item.hourly_rate}
                    </div>
                  </div>
                  <div style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-gray)', fontSize: 13, fontWeight: 600, marginBottom: 10, letterSpacing: '-0.01em' }}>
                      <MapPin size={14} color="var(--accent-blue)" /> {item.location}
                    </div>
                    <h3 style={{ fontSize: 22, marginBottom: 12, color: 'var(--text-white)' }}>{item.name || item.guide_name}</h3>
                    <p style={{ color: 'var(--text-gray)', fontSize: 15, marginBottom: 28, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 600, fontSize: 14 }}>
                      View Details <ArrowRight size={18} className="arrow-icon" />
                    </div>
                  </div>
                </Link>
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
              {loadingMore ? 'Loading items...' : 'Load More Items'}
            </button>
          </div>
        )}
      </div>

      <Footer />
      <style>{`
        .glass-card:hover .listing-img { transform: scale(1.08); }
        .glass-card:hover .arrow-icon { transform: translateX(4px); transition: transform 0.3s; }
      `}</style>
    </div>
  );
}
