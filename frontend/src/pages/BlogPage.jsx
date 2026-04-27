import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Globe, Calendar, User, ArrowRight, MessageCircle, Star } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../utils/api";
import { CloudinaryImage } from "../components/common/CloudinaryMedia";
import toast from "react-hot-toast";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [nextUrl, setNextUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  const categories = ["All", "Travel Guide", "Tips & Tricks", "Food & Culture", "Adventure", "Luxury"];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blog/');
      setPosts(res.data.results || res.data);
      setNextUrl(res.data.next || null);
    } catch (err) {
      toast.error("Failed to load blog articles");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextUrl) return;
    try {
      setLoadingMore(true);
      const res = await api.get(nextUrl);
      setPosts([...posts, ...(res.data.results || [])]);
      setNextUrl(res.data.next || null);
    } catch (err) {
      toast.error("Failed to load more articles");
    } finally {
      setLoadingMore(false);
    }
  };

  const filtered = posts.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featured = filtered.find(p => p.is_featured) || filtered[0];
  const remaining = filtered.filter(p => p.id !== featured?.id);

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
            <div style={{ color: "var(--accent-blue)", fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
              Travel Inspiration
            </div>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: 24, letterSpacing: '-0.04em' }}>
              NEXIOtour <span className="text-gradient">Blog.</span>
            </h1>
            <p style={{ color: 'var(--text-gray)', fontSize: 18, maxWidth: 600, margin: '0 auto 48px', fontWeight: 500 }}>
              Stories, guides, and tips from our world exploration community.
            </p>

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
              <Search size={20} color="var(--accent-blue)" style={{ opacity: 0.8 }} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none', border: 'none', color: '#fff',
                  fontSize: 16, width: '100%', outline: 'none',
                  fontWeight: 500
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container" style={{ flex: 1, paddingBottom: 120 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <>
            {/* Category Chips */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '10px 22px',
                    borderRadius: 30,
                    fontSize: 14,
                    fontWeight: 600,
                    background: activeCategory === cat ? 'var(--accent-blue)' : 'rgba(255,255,255,0.03)',
                    color: activeCategory === cat ? '#fff' : 'var(--text-gray)',
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Featured Post - Horizontal */}
            {activeCategory === "All" && !searchQuery && featured && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="glass-card"
                onClick={() => navigate(`/blog/${featured.slug}`)}
                style={{
                  display: 'flex', minHeight: 450, overflow: 'hidden', cursor: 'pointer',
                  marginBottom: 60, flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: '1 1 500px', position: 'relative', overflow: 'hidden' }}>
                  <CloudinaryImage
                    publicId={featured.cover_image}
                    alt={featured.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: 30, left: 30, padding: '8px 16px', background: 'var(--accent-blue)', borderRadius: 12, fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Featured
                  </div>
                </div>
                <div style={{ flex: '1 1 400px', padding: '60px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ color: 'var(--accent-purple)', fontSize: 13, fontWeight: 700, marginBottom: 20 }}>{featured.category}</div>
                  <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: 24, lineHeight: 1.1, letterSpacing: '-0.03em' }}>{featured.title}</h2>
                  <p style={{ color: 'var(--text-gray)', fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 500 }}>{featured.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: 'var(--text-gray)', fontSize: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><User size={16} /> {featured.author_name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={16} /> {new Date(featured.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Blog Grid - 4 Columns */}
            <div className="gem-grid">
              {(activeCategory === "All" && !searchQuery ? remaining : filtered).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="glass-card"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  style={{ overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ height: 220, position: 'relative', overflow: 'hidden' }}>
                    <CloudinaryImage
                      publicId={post.cover_image}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      className="gem-img"
                    />
                    <div style={{ position: 'absolute', top: 20, left: 20, padding: '6px 14px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 11, fontWeight: 700, color: '#fff' }}>
                      {post.category}
                    </div>
                  </div>
                  <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: 20, marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.3 }}>{post.title}</h3>
                    <p style={{ color: 'var(--text-gray)', fontSize: 14, lineHeight: 1.6, marginBottom: 24, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-gray)', fontSize: 11 }}>
                      <span>{post.author_name}</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-gray)', padding: 100 }}>
                <Search size={48} style={{ opacity: 0.2, marginBottom: 20 }} />
                <h3 style={{ fontSize: 24, color: '#fff' }}>No articles found.</h3>
                <p>Try a different keyword or category.</p>
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
                  {loadingMore ? 'Loading details...' : 'Load More Articles'}
                </button>
              </div>
            )}
          </>
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
