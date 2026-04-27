import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Share2, Clock, MessageSquare } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../utils/api";
import { CloudinaryImage } from "../components/common/CloudinaryMedia";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/blog/${slug}/`);
        setPost(res.data);
      } catch (err) {
        toast.error("Article not found");
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, navigate]);

  const submitComment = async () => {
    if (!commentContent.trim()) return;
    try {
      setIsSubmitting(true);
      const res = await api.post(`/blog/${post.id}/comments/`, { content: commentContent });
      setPost({ ...post, comments: [...post.comments, res.data] });
      setCommentContent("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-dark)", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #fff', borderTopColor: 'transparent' }} />
    </div>
  );

  if (!post) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-dark)" }}>
      <Navbar />
      
      {/* Article Hero */}
      <header style={{ paddingTop: 160, paddingBottom: 80, position: 'relative' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/blog")}
            style={{ background: 'none', border: 'none', color: 'var(--text-gray)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, fontWeight: 600, fontSize: 14 }}
          >
            <ArrowLeft size={16} /> Back to Blog
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div style={{ color: "var(--accent-purple)", fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>
              {post.category}
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 32, lineHeight: 1.1, letterSpacing: '-0.04em' }}>
              {post.title}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, color: 'var(--text-gray)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-aurora)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800 }}>
                  {post.author_name?.[0]}
                </div>
                <span style={{ fontWeight: 600, color: '#fff' }}>{post.author_name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={16} /> {new Date(post.created_at).toLocaleDateString()}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Clock size={16} /> 5 min read</div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
                style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 30, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}
              >
                <Share2 size={16} /> Share
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Featured Image */}
      <section className="container" style={{ maxWidth: 1100, marginBottom: 80 }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{ borderRadius: 40, overflow: 'hidden', height: 'clamp(300px, 60vh, 700px)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <CloudinaryImage 
            publicId={post.cover_image} 
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </motion.div>
      </section>

      {/* Article Content */}
      <article className="container" style={{ maxWidth: 800, paddingBottom: 160 }}>
        <div 
          className="blog-content"
          style={{ 
            color: 'rgba(255,255,255,0.85)', fontSize: 18, lineHeight: 1.8, 
            whiteSpace: 'pre-wrap', 
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Comments Section */}
        <div style={{ marginTop: 100, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 60 }}>
          <h3 style={{ fontSize: 24, marginBottom: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
            <MessageSquare size={24} color="var(--accent-blue)" /> {post.comments?.length || 0} Comments
          </h3>
          
          {user ? (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 30, marginBottom: 40 }}>
              <textarea 
                placeholder="Share your thoughts..." 
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                style={{ width: '100%', minHeight: 100, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff', fontSize: 16, marginBottom: 16, resize: 'vertical' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={submitComment} 
                  disabled={isSubmitting || !commentContent.trim()}
                  style={{ background: 'var(--accent-blue)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 30, fontWeight: 600, cursor: isSubmitting || !commentContent.trim() ? 'not-allowed' : 'pointer', opacity: isSubmitting || !commentContent.trim() ? 0.6 : 1 }}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 40, textAlign: 'center', marginBottom: 40 }}>
              <p style={{ color: 'var(--text-gray)', marginBottom: 20 }}>Join the conversation. Sign in to leave a comment.</p>
              <button className="btn-outline" onClick={() => navigate('/login')}>Sign In</button>
            </div>
          )}

          {/* Render comments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {post.comments?.map((comment, i) => (
              <div key={i} style={{ padding: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient-aurora)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 800 }}>
                    {comment.user_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{comment.user_name || 'User'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-gray)' }}>{new Date(comment.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
