import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ReviewModal({ isOpen, onClose, booking, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        rating,
        title,
        comment,
        is_verified_booking: true // the backend might override this, but we send it
      };
      
      if (booking.booking_type === 'tour') payload.tour = booking.tour;
      else if (booking.booking_type === 'hotel') payload.hotel = booking.hotel;
      else if (booking.booking_type === 'guide') payload.guide_service = booking.guide_service;

      await api.post('/reviews/', payload);
      toast.success("Thank you for your review!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 1000 }} 
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              background: 'var(--bg-navy)', border: '1px solid var(--glass-border)',
              borderRadius: 24, padding: 32, width: '90%', maxWidth: 500,
              zIndex: 1001, boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>Rate Your Experience</h2>
                <p style={{ color: 'var(--text-gray)', fontSize: 14 }}>{booking.destination_name}</p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-gray)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={36}
                    fill={(hoverRating || rating) >= star ? "#FFD700" : "transparent"}
                    color={(hoverRating || rating) >= star ? "#FFD700" : "var(--glass-border)"}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: 8 }}>Headline (Optional)</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 12, color: '#fff', fontSize: 15 }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-gray)', textTransform: 'uppercase', marginBottom: 8 }}>Review</label>
                <textarea 
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you love? What could be improved?"
                  rows={4}
                  style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 12, color: '#fff', fontSize: 15, resize: 'none' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button type="button" onClick={onClose} className="btn-outline" style={{ flex: 1, padding: '14px', borderRadius: 12 }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Submit Review"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
