import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Video, Upload, X, MapPin, Map } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function AddHiddenLocationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    video_url: "",
    google_maps_url: ""
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error("Please add at least one image");
    setLoading(true);

    try {
      // Real Cloudinary Upload via the Backend or Direct (using unsigned preset)
      // Since we have the backend configured with Cloudinary, let's use it for the upload
      const uploadedImageUrls = [];
      
      for (const file of images) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("upload_preset", "ml_default"); // Standard default preset name
        formDataUpload.append("cloud_name", import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME);

        try {
          const cloudRes = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formDataUpload }
          );
          const cloudData = await cloudRes.json();
          if (cloudData.secure_url) {
            uploadedImageUrls.push(cloudData.secure_url);
          } else {
            console.error("Cloudinary Error Data:", cloudData);
            toast.error(`Cloudinary: ${cloudData.error?.message || "Upload failed"}`);
          }
        } catch (uploadErr) {
          console.error("Cloudinary Fetch Error:", uploadErr);
          toast.error("Network error during upload");
        }
      }

      if (uploadedImageUrls.length === 0) {
        throw new Error("Failed to upload images");
      }

      const payload = {
        ...formData,
        images: uploadedImageUrls
      };

      await api.post('/community/hidden-locations/', payload);
      toast.success("Discovery shared with the community!");
      navigate('/hidden-gems');
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error(err.response?.data?.error || err.message || "Failed to share discovery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: 'var(--bg-dark)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: 140, paddingBottom: 120, maxWidth: 800 }}>
        <motion.button 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/hidden-gems')}
          style={{ background: 'none', border: 'none', color: 'var(--text-gray)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, cursor: 'pointer', fontWeight: 600 }}
        >
          <ArrowLeft size={18} /> Back to Gallery
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
           <h1 style={{ fontSize: 40, marginBottom: 12, letterSpacing: '-0.03em', color: '#fff' }}>Share a Gem.</h1>
           <p style={{ color: 'var(--text-gray)', fontSize:16, marginBottom: 48, fontWeight: 500 }}>Contribute your unique discovery to the NexioTour elite explorer network.</p>
        </motion.div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 32 }}>
          <div className="glass" style={{ padding: 40, borderRadius: 24, display: 'grid', gap: 24 }}>
             <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'block' }}>Discovery Name</label>
                <input 
                  type="text" required placeholder="e.g. The Sapphire Lagoon"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: 16, color: '#fff', fontSize: 15, outline: 'none' }}
                />
             </div>
             
             <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'block' }}>Location Coordinate / Name</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
                  <input 
                    type="text" required placeholder="Hidden Valley, Iceland"
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: '16px 16px 16px 48px', color: '#fff', fontSize: 15, outline: 'none' }}
                  />
                </div>
             </div>

             <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'block' }}>Google Maps Link (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <Map size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
                  <input 
                    type="url" placeholder="https://maps.google.com/..."
                    value={formData.google_maps_url} onChange={e => setFormData({...formData, google_maps_url: e.target.value})}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: '16px 16px 16px 48px', color: '#fff', fontSize: 15, outline: 'none' }}
                  />
                </div>
             </div>

             <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'block' }}>The Story</label>
                <textarea 
                  required placeholder="Describe the discovery, the path to find it, and its magic..."
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: 16, color: '#fff', fontSize: 15, minHeight: 160, outline: 'none', lineHeight: 1.6 }}
                />
             </div>
          </div>

          <div className="glass" style={{ padding: 40, borderRadius: 24 }}>
             <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 24, display: 'block' }}>Imagery & Evidence</label>
             
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16, marginBottom: 24 }}>
                {previews.map((src, i) => (
                  <div key={i} style={{ aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                    <img src={src} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                       <X size={14} />
                    </button>
                  </div>
                ))}
                <label style={{ aspectRatio: '1/1', borderRadius: 12, border: '2px dashed var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-gray)', transition: 'all 0.3s' }} className="upload-btn">
                   <Camera size={24} />
                   <span style={{ fontSize: 11, fontWeight: 700 }}>Add Photo</span>
                   <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
             </div>

             <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, display: 'block' }}>Video URL (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <Video size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-gray)' }} />
                  <input 
                    type="url" placeholder="YouTube or Vimeo link"
                    value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: '16px 16px 16px 48px', color: '#fff', fontSize: 15, outline: 'none' }}
                  />
                </div>
             </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '20px', borderRadius: 16, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            {loading ? "Discovering..." : <><Upload size={20} /> Share Discovery</>}
          </button>
        </form>
      </div>

      <Footer />
      <style>{`
        .upload-btn:hover { background: rgba(255,255,255,0.02); border-color: #fff; color: #fff; }
      `}</style>
    </div>
  );
}
