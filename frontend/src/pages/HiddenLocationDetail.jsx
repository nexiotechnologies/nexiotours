import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star, MessageCircle, Share2, Send, PlayCircle, Map } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { CloudinaryImage, CloudinaryVideo } from "../components/common/CloudinaryMedia";

export default function HiddenLocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetchLocation();
  }, [id]);

  const fetchLocation = async () => {
    try {
      const res = await api.get(`/community/hidden-locations/${id}/`);
      setLocation(res.data);
    } catch (err) {
      toast.error("Failed to load discovery details");
      navigate('/hidden-gems');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (score) => {
    if (!user) return toast.error("Sign in to rate");
    setRating(score); // Immediate visual feedback
    try {
       await api.post(`/community/hidden-locations/${id}/rate/`, { score });
       toast.success("Thanks for rating!");
       fetchLocation();
    } catch (err) {
       toast.error("Rating failed");
       setRating(0); // Rollback on error
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Sign in to comment");
    if (!comment.trim()) return;
    try {
       await api.post(`/community/hidden-locations/${id}/comment/`, { text: comment });
       setComment("");
       toast.success("Comment added");
       fetchLocation();
    } catch (err) {
       toast.error("Comment failed");
    }
  };

  const shareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: location.name,
        text: location.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) return null;

  return (
    <div style={{ minHeight: "100vh", background: 'var(--bg-dark)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Immersive Modal Header */}
      <div style={{ height: '70vh', position: 'relative', overflow: 'hidden' }}>
        {location.images && location.images.length > 0 ? (
          <CloudinaryImage 
            publicId={location.images[0]} 
            alt={location.name} 
            className="header-image"
            width={2600}
            height={1600}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-gray)' }}>
            No visual available
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, var(--bg-dark))' }} />
        
        <div className="container" style={{ position: 'absolute', bottom: 60, left: 40, right: 40 }}>
           <motion.button 
             initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
             onClick={() => navigate('/hidden-gems')}
             style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 24px', borderRadius: 40, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
           >
             <ArrowLeft size={18} /> Back to Discoveries
           </motion.button>
           
           <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: 'clamp(32px, 5vw, 64px)', marginBottom: 20, letterSpacing: '-0.04em', color: '#fff' }}>
             {location.name}
           </motion.h1>
           
           <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-gray)', fontWeight: 600 }}>
               <MapPin size={18} color="var(--accent-blue)" /> {location.location}
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 700 }}>
               <Star size={18} color="#FFD700" fill="#FFD700" /> {location.average_rating.toFixed(1)}
             </div>
             <button onClick={shareLocation} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-gray)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
               <Share2 size={18} /> Share Gem
             </button>
             {location.google_maps_url && (
               <a 
                 href={location.google_maps_url} 
                 target="_blank" 
                 rel="noreferrer" 
                 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600, fontSize: 13 }}
               >
                 <Map size={18} /> View on Map
               </a>
             )}
           </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 120 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 80, marginTop: 60 }}>
          {/* Content */}
          <div>
            <div style={{ marginBottom: 60 }}>
              <h2 style={{ fontSize: 28, marginBottom: 24, letterSpacing: '-0.02em', color: '#fff' }}>The Discovery</h2>
              <p style={{ fontSize: 18, lineHeight: 1.8, color: 'var(--text-gray)', fontWeight: 500 }}>{location.description}</p>
            </div>

            {location.video_url && (
              <div style={{ marginBottom: 60 }}>
                <h3 style={{ fontSize: 20, marginBottom: 24, color: '#fff' }}>Video Walkthrough</h3>
                <div className="glass" style={{ borderRadius: 24, overflow: 'hidden', padding: 20, background: 'rgba(255,255,255,0.02)' }}>
                   {location.video_url.startsWith('http') ? (
                     <a href={location.video_url} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, color: '#fff' }}>
                       <PlayCircle size={64} style={{ opacity: 0.5 }} />
                       <span style={{ fontWeight: 600 }}>Watch community video</span>
                     </a>
                   ) : (
                     <CloudinaryVideo publicId={location.video_url} className="w-full h-full" />
                   )}
                </div>
              </div>
            )}

            {/* Comments */}
            <div>
              <h3 style={{ fontSize: 22, marginBottom: 32, color: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
                <MessageCircle size={22} /> Community Dialogue
              </h3>
              
              <div className="glass" style={{ padding: 32, borderRadius: 24, marginBottom: 40 }}>
                <form onSubmit={handleComment} style={{ position: 'relative' }}>
                   <textarea 
                     value={comment} onChange={e => setComment(e.target.value)}
                     placeholder="Share your thoughts on this discovery..."
                     style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: 20, fontSize: 15, color: '#fff', minHeight: 120, outline: 'none' }}
                   />
                   <button type="submit" style={{ position: 'absolute', bottom: 12, right: 12, background: 'var(--accent-blue)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                     Post <Send size={14} />
                   </button>
                </form>
              </div>

              <div style={{ display: 'grid', gap: 24 }}>
                 {location.comments.map(c => (
                   <div key={c.id} style={{ display: 'flex', gap: 20 }}>
                     <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>{c.user_name[0].toUpperCase()}</div>
                     <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                           <span style={{ fontWeight: 700, fontSize: 15 }}>{c.user_name}</span>
                           <span style={{ fontSize: 12, color: 'var(--text-gray)' }}>{new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        <p style={{ color: 'var(--text-gray)', fontSize: 15, lineHeight: 1.6 }}>{c.text}</p>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 120, height: 'fit-content' }}>
             <div className="glass" style={{ padding: 32, borderRadius: 24 }}>
                <h3 style={{ fontSize: 18, marginBottom: 24, color: '#fff' }}>Rate this Gem</h3>
                <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button 
                      key={s} 
                      onClick={() => handleRate(s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Star size={32} color={s <= rating ? "#FFD700" : "rgba(255,255,255,0.1)"} fill={s <= rating ? "#FFD700" : "none"} />
                    </button>
                  ))}
                </div>
                <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 16, fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.5 }}>
                   Community discoverability relies on high-quality ratings. Share your honest experience.
                </div>
             </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
