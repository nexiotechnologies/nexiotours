import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Star, ArrowLeft, Check, Clock } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../utils/api";
import toast from "react-hot-toast";
import { CloudinaryImage } from "../components/common/CloudinaryMedia";

export default function ListingDetailPage({ type }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/destinations/${type}/${id}/`);
        setData(res.data);
      } catch (err) {
        toast.error("Collection not found");
        navigate(`/${type}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, id, navigate]);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent' }} /></div>;

  const price = data.base_price || data.price_per_night || data.hourly_rate;

  return (
    <div style={{ background: "var(--bg-dark)", minHeight: "100vh", color: "var(--text-white)" }}>
      <Navbar />

      {/* Apple-style Immersive Header */}
      <section style={{ height: '75vh', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          initial={{ scale: 1.1, filter: 'blur(15px)' }}
          animate={{ scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', height: '100%' }}
        >
          <CloudinaryImage
            publicId={data.main_image}
            alt={data.name || data.guide_name}
            className="header-image"
            width={2600}
            height={1600}
          />
        </motion.div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, var(--bg-dark))' }} />

        <div className="container" style={{ position: 'absolute', bottom: 60, left: 0, right: 0, zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }}>
            <button
              onClick={() => navigate(`/${type}`)}
              className="btn-outline"
              style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', fontSize: 13, borderRadius: '12px' }}
            >
              <ArrowLeft size={16} /> Back to Collection
            </button>
            <h1 style={{ fontSize: 'clamp(48px, 8vw, 84px)', marginBottom: 20, lineHeight: 1, letterSpacing: '-0.04em' }}>{data.name || data.guide_name}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32, fontSize: 16, color: 'var(--text-gray)', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={20} color="var(--accent-blue)" /> {data.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Star size={20} fill="#fff" color="#fff" /> {data.average_rating > 0 ? data.average_rating.toFixed(1) : "New"} ({data.review_count || 0} reviews)</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 80 }}>
            {/* Left: Narrative & Details */}
            <div>
              <h2 style={{ fontSize: 40, marginBottom: 32, letterSpacing: '-0.03em' }}>The <span className="text-gradient">Experience</span></h2>
              <p style={{ fontSize: 19, color: 'var(--text-gray)', marginBottom: 56, lineHeight: 1.7, fontWeight: 500 }}>{data.description}</p>

              {type === 'tours' && (
                <div className="glass" style={{ padding: 60, marginBottom: 64, borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                  <h3 style={{ fontSize: 32, marginBottom: 44, letterSpacing: '-0.02em' }}>The Journey</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 44, borderLeft: '1px solid var(--glass-border)', paddingLeft: 44, position: 'relative' }}>
                    {[
                      { day: 1, title: 'Arrival & Welcome', desc: 'Settle into your boutique accommodation and enjoy a sunset dinner overlooking the coast.' },
                      { day: 2, title: 'Secret Exploration', desc: 'A private guide takes you to the hidden gems known only to locals.' },
                      { day: 3, title: 'Local Immersion', desc: 'Dive deep into the culture with cooking classes and village tours.' },
                      { day: 4, title: 'Departure', desc: 'A final artisanal breakfast before your luxury transfer back.' }
                    ].map((step, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: -54.5, top: 0, width: 21, height: 21, background: '#fff', borderRadius: '50%', border: '4px solid var(--bg-dark)' }} />
                        <h4 style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-blue)', marginBottom: 8 }}>Day {step.day}</h4>
                        <h5 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{step.title}</h5>
                        <p style={{ color: 'var(--text-gray)', fontSize: 16 }}>{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div className="glass" style={{ padding: 32, borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                  <Clock color="var(--accent-blue)" style={{ marginBottom: 16 }} />
                  <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Flexible Cancellation</h4>
                  <p style={{ fontSize: 14, color: 'var(--text-gray)' }}>Free cancellation up to 48 hours before the start date.</p>
                </div>
                <div className="glass" style={{ padding: 32, borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                  <Users color="var(--accent-purple)" style={{ marginBottom: 16 }} />
                  <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Private Experience</h4>
                  <p style={{ fontSize: 14, color: 'var(--text-gray)' }}>This is a private service. Only your group will participate.</p>
                </div>
              </div>
            </div>

            {/* Right: Apple-style Booking Card */}
            <div style={{ position: 'relative' }}>
              <div className="glass" style={{
                padding: '48px', position: 'sticky', top: 120,
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
              }}>
                <div style={{ marginBottom: 32 }}>
                  <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em' }}>₹{price}</span>
                  <span style={{ color: 'var(--text-gray)', fontSize: 14, fontWeight: 500 }}> / {type === 'hotels' ? 'night' : type === 'guides' ? 'hour' : 'person'}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                  <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                    <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-gray)', display: 'block', marginBottom: 8, letterSpacing: '0.05em' }}>CHECK-IN / DATE</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600 }}><Calendar size={18} color="var(--accent-blue)" /> Select Date</div>
                  </div>
                  <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                    <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-gray)', display: 'block', marginBottom: 8, letterSpacing: '0.05em' }}>GUESTS</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600 }}><Users size={18} color="var(--accent-purple)" /> 2 Guests</div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/booking/${id}?type=${type}`)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '18px', fontSize: 16, marginBottom: 24, justifyContent: 'center' }}
                >
                  Reserve Now
                </button>

                <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-gray)', fontWeight: 500 }}>Secure checkout via encrypted gateway</p>

                <div style={{ marginTop: 40, borderTop: '1px solid var(--glass-border)', paddingTop: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)' }} />
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Exclusive Availability</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-gray)', lineHeight: 1.5, fontWeight: 500 }}>This selection is highly requested. We recommend booking in advance to secure your preferred dates.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
