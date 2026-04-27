import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Compass, Building, UserCheck } from "lucide-react";
import { useUser } from "@clerk/react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const SERVICES = [
  { id: 'tours', label: 'Tours', icon: <Compass size={24} />, path: '/tours', desc: 'Curated adventures through the world\'s most breathtaking landscapes.' },
  { id: 'hotels', label: 'Hotels', icon: <Building size={24} />, path: '/hotels', desc: 'Hand-picked boutique stays and world-class luxury accommodations.' },
  { id: 'guides', label: 'Guides', icon: <UserCheck size={24} />, path: '/guides', desc: 'Expert local storytellers to unveil the hidden secrets of every culture.' }
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('tours');
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  React.useEffect(() => {
    if (isLoaded && user) {
      const rawRole = user.publicMetadata?.role || user.unsafeMetadata?.role;
      const normalizedRole = typeof rawRole === 'string' ? rawRole.toLowerCase() : "";
      const isVendor = normalizedRole.includes('business') || normalizedRole.includes('provider') || normalizedRole.includes('vendor');
      
      if (isVendor) {
        navigate('/business', { replace: true });
      }
    }
  }, [isLoaded, user, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/${activeTab}?q=${encodeURIComponent(searchQuery)}`);
    else navigate(`/${activeTab}`);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: 'var(--bg-dark)' }}>
      <Navbar />

      {/* Apple-style Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '140px 20px',
        overflow: 'hidden'
      }}>
        {/* Subtle Dynamic Gradients (Apple Wallpaper Style) */}
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '60%', height: '60%',
          background: 'radial-gradient(circle, rgba(0, 122, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(100px)', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '70%', height: '70%',
          background: 'radial-gradient(circle, rgba(175, 82, 222, 0.05) 0%, transparent 70%)',
          filter: 'blur(120px)', zIndex: 0
        }} />

        <div className="container" style={{ textAlign: 'center', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 style={{ fontSize: 'clamp(48px, 9vw, 90px)', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.04em' }}>
              Explore the <span className="text-gradient">Unknown.</span>
            </h1>
            <p style={{ fontSize: 20, color: 'var(--text-gray)', maxWidth: 650, margin: '0 auto 64px', lineHeight: 1.5, fontWeight: 500 }}>
              Discover the world's most exclusive destinations through our ultra-refined, curated gateway.
            </p>
          </motion.div>

          {/* Spotlight Search Hub */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: 800, margin: '0 auto' }}
          >
            <form onSubmit={handleSearch} className="glass" style={{
              borderRadius: '24px',
              padding: '6px',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '18px', padding: '0 24px' }}>
                <Search size={22} color="var(--text-gray)" style={{ cursor: 'pointer' }} onClick={handleSearch} />
                <input
                  type="text"
                  placeholder="Search destinations, villas, or guides..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ flex: 1, padding: '24px 20px', fontSize: 18, background: 'transparent', color: '#fff', fontWeight: 500, border: 'none', outline: 'none' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  {SERVICES.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveTab(s.id)}
                      style={{
                        background: activeTab === s.id ? '#fff' : 'rgba(255,255,255,0.05)',
                        color: activeTab === s.id ? '#000' : 'var(--text-gray)',
                        fontSize: 12, fontWeight: 700, padding: '8px 16px',
                        borderRadius: '10px', transition: 'all 0.3s', cursor: 'pointer',
                        border: 'none'
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.id}
                className="glass-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => navigate(s.path)}
                style={{ cursor: 'pointer', overflow: 'hidden', padding: 48, display: 'flex', flexDirection: 'column' }}
              >
                <div style={{
                  width: 52, height: 52,
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 14, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: 32, border: '1px solid var(--glass-border)'
                }}>
                  {React.cloneElement(s.icon, { size: 24, color: '#fff' })}
                </div>
                <h3 style={{ fontSize: 26, marginBottom: 16 }}>{s.label}</h3>
                <p style={{ color: 'var(--text-gray)', fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>{s.desc}</p>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, color: '#fff', fontWeight: 700, fontSize: 14 }}>
                  Browse Collection <ArrowRight size={18} className="arrow-icon" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .glass-card:hover .arrow-icon { transform: translateX(5px); transition: transform 0.3s; }
      `}</style>
    </div>
  );
}
