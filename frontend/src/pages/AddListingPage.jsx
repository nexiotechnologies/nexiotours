import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, MapPin, CheckCircle2, Package } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function AddListingPage({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [type, setType] = useState('tour');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    base_price: '',
    price_per_night: '',
    duration_days: 1,
    capacity: '',
    total_rooms: '',
    category: '',
    amenities: []
  });

  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (isEdit && id) {
      fetchListingData();
    }
  }, [isEdit, id]);

  const fetchListingData = async () => {
    try {
      let res;
      try {
        res = await api.get(`/destinations/tours/${id}/`);
        setType('tour');
      } catch (e) {
        res = await api.get(`/destinations/hotels/${id}/`);
        setType('hotel');
      }

      const data = res.data;
      setFormData({
        name: data.name,
        location: data.location,
        description: data.description,
        base_price: data.base_price || '',
        price_per_night: data.price_per_night || '',
        duration_days: data.duration_days || 1,
        capacity: data.capacity || '',
        total_rooms: data.total_rooms || '',
        category: data.category?.id || data.category || '',
        amenities: data.amenities || []
      });
    } catch (err) {
      toast.error("Failed to load listing details");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/destinations/categories/');
      setCategories(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();

      data.append('name', formData.name);
      data.append('location', formData.location);
      data.append('description', formData.description);

      if (type === 'tour') {
        data.append('base_price', formData.base_price);
        data.append('duration_days', formData.duration_days);
        if (formData.capacity) data.append('capacity', formData.capacity);
        if (formData.category) data.append('category', formData.category);
      } else if (type === 'hotel') {
        data.append('price_per_night', formData.price_per_night);
        if (formData.total_rooms) data.append('total_rooms', formData.total_rooms);
        if (formData.amenities.length > 0) data.append('amenities', JSON.stringify(formData.amenities));
      }

      if (mainImage) data.append('main_image', mainImage);

      const endpoints = {
        tour: '/destinations/tours/',
        hotel: '/destinations/hotels/'
      };

      const endpoint = endpoints[type];
      const url = isEdit ? `${endpoint}${id}/` : endpoint;
      const method = isEdit ? 'patch' : 'post';

      await api[method](url, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(isEdit ? "Listing updated!" : "Listing published successfully!");
      navigate('/business?tab=listings');
    } catch (err) {
      const detail = err?.response?.data;
      let msg = `Failed to ${isEdit ? 'update' : 'create'} listing.`;
      if (detail && typeof detail === 'object') {
        const firstKey = Object.keys(detail)[0];
        if (firstKey) {
          const val = Array.isArray(detail[firstKey]) ? detail[firstKey][0] : detail[firstKey];
          msg += ` ${firstKey}: ${val}`;
        }
      } else if (typeof detail === 'string') {
        msg += ` ${detail}`;
      }
      toast.error(msg);
      console.error("Listing error:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, color: '#fff', fontSize: 15 };
  const labelStyle = { display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      <Navbar />

      <main style={{ maxWidth: 800, margin: '0 auto', paddingTop: 120, paddingBottom: 100 }}>
        <div style={{ padding: '0 20px' }}>
          <button
            onClick={() => navigate('/business')}
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 32 }}
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>

          <header style={{ marginBottom: 48 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>{isEdit ? 'Edit Listing' : 'Create New Listing'}</h1>
            <div style={{ display: 'flex', gap: 12 }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ flex: 1, height: 4, background: step >= s ? '#007AFF' : 'rgba(255,255,255,0.1)', borderRadius: 2 }} />
              ))}
            </div>
          </header>

          <AnimatePresence mode="wait">
            {/* ── STEP 1: Type + Name + Location ── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>What are you listing?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 40 }}>
                  {[
                    { id: 'tour', label: 'Tour Package', icon: <Package size={28} />, desc: 'Curated travel experiences, safaris, city tours & excursions.' },
                    { id: 'hotel', label: 'Accommodation', icon: <MapPin size={28} />, desc: 'Hotels, resorts, villas & boutique stays.' }
                  ].map(opt => (
                    <div
                      key={opt.id}
                      onClick={() => setType(opt.id)}
                      style={{
                        padding: 32, borderRadius: 24,
                        background: type === opt.id ? 'rgba(0,122,255,0.1)' : 'rgba(255,255,255,0.02)',
                        border: type === opt.id ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer', transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ color: type === opt.id ? '#007AFF' : 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{opt.icon}</div>
                      <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{opt.label}</h4>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{opt.desc}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <label style={labelStyle}>Listing Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={type === 'tour' ? "e.g. Serengeti Safari Adventure" : "e.g. Oceanview Resort & Spa"} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Location *</label>
                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Kozhikode, Kerala, India" style={inputStyle} />
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!formData.name.trim()) return toast.error("Please enter a listing name");
                    if (!formData.location.trim()) return toast.error("Please enter a location");
                    nextStep();
                  }}
                  className="btn-primary" style={{ width: '100%', marginTop: 40, padding: 18, borderRadius: 16, fontSize: 16, fontWeight: 600 }}
                >
                  Next Step
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: Details, Pricing, Image ── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Details & Pricing</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <label style={labelStyle}>Description *</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe what makes this listing special..." rows={5} style={{ ...inputStyle, resize: 'none' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div>
                      <label style={labelStyle}>{type === 'tour' ? 'Base Price (₹) *' : 'Price per Night (₹) *'}</label>
                      <input type="number" min="0" step="0.01" value={type === 'tour' ? formData.base_price : formData.price_per_night} onChange={(e) => setFormData({ ...formData, [type === 'tour' ? 'base_price' : 'price_per_night']: e.target.value })} placeholder="0.00" style={inputStyle} />
                    </div>
                    {type === 'tour' ? (
                      <div>
                        <label style={labelStyle}>Duration (Days)</label>
                        <input type="number" min="1" value={formData.duration_days} onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })} style={inputStyle} />
                      </div>
                    ) : (
                      <div>
                        <label style={labelStyle}>Total Rooms</label>
                        <input type="number" min="1" value={formData.total_rooms} onChange={(e) => setFormData({ ...formData, total_rooms: e.target.value })} placeholder="e.g. 50" style={inputStyle} />
                      </div>
                    )}
                  </div>

                  {type === 'tour' && (
                    <div>
                      <label style={labelStyle}>Capacity (Max Travelers)</label>
                      <input type="number" min="1" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} placeholder="e.g. 15" style={inputStyle} />
                    </div>
                  )}

                  {/* Image Upload */}
                  <div>
                    <label style={labelStyle}>Cover Photo</label>
                    <label style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      height: mainImage ? 'auto' : 200, minHeight: 120, background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 20, cursor: 'pointer', padding: 16
                    }}>
                      <input type="file" accept="image/*" hidden onChange={(e) => setMainImage(e.target.files[0])} />
                      {mainImage ? (
                        <div style={{ textAlign: 'center' }}>
                          <img src={URL.createObjectURL(mainImage)} alt="" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 12, marginBottom: 8 }} />
                          <p style={{ color: '#007AFF', fontSize: 13 }}>{mainImage.name} — Click to change</p>
                        </div>
                      ) : (
                        <>
                          <Upload size={32} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: 12 }} />
                          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>Click to upload cover photo</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
                  <button onClick={prevStep} style={{ flex: 1, padding: 18, borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 15 }}>Back</button>
                  <button
                    onClick={() => {
                      const price = type === 'tour' ? formData.base_price : formData.price_per_night;
                      if (!formData.description.trim()) return toast.error("Please add a description");
                      if (!price) return toast.error("Please set a price");
                      nextStep();
                    }}
                    className="btn-primary" style={{ flex: 2, padding: 18, borderRadius: 16, fontSize: 15, fontWeight: 600 }}
                  >
                    Review & Publish
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Review ── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Final Review</h3>
                <div className="glass-card" style={{ padding: 40, borderRadius: 32, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                    <div style={{ width: 120, height: 120, borderRadius: 20, background: '#1a1a1a', overflow: 'hidden', flexShrink: 0 }}>
                      {mainImage && <img src={URL.createObjectURL(mainImage)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div>
                      <span style={{ fontSize: 13, color: '#007AFF', fontWeight: 600, textTransform: 'uppercase' }}>{type === 'tour' ? 'Tour Package' : 'Hotel'}</span>
                      <h2 style={{ fontSize: 26, fontWeight: 700, margin: '4px 0' }}>{formData.name || 'Untitled'}</h2>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={16} /> {formData.location}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: type === 'tour' ? '1fr 1fr 1fr' : '1fr 1fr', gap: 32, marginBottom: 32 }}>
                    <div>
                      <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Pricing</label>
                      <p style={{ fontSize: 20, fontWeight: 600, color: '#1FBF85' }}>
                        ₹{formData.base_price || formData.price_per_night}
                        {type === 'hotel' && <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>/ night</span>}
                      </p>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{type === 'tour' ? 'Capacity' : 'Rooms'}</label>
                      <p style={{ fontSize: 20, fontWeight: 600 }}>
                        {(type === 'tour' ? formData.capacity : formData.total_rooms) || '—'}
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>{type === 'tour' ? 'travelers' : 'rooms'}</span>
                      </p>
                    </div>
                    {type === 'tour' && (
                      <div>
                        <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Duration</label>
                        <p style={{ fontSize: 20, fontWeight: 600 }}>{formData.duration_days} <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>days</span></p>
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 32 }}>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{formData.description}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
                  <button onClick={prevStep} style={{ flex: 1, padding: 18, borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 15 }}>Edit Details</button>
                  <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ flex: 2, padding: 18, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 15, fontWeight: 600 }}>
                    {loading ? 'Processing...' : <><CheckCircle2 size={20} /> {isEdit ? 'Save Changes' : 'Publish Listing'}</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
