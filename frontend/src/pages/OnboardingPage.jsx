import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Building, UserCheck, ArrowRight, CheckCircle2, Globe } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  {
    id: 'traveler',
    title: 'Explorer',
    subtitle: 'Plan, book & discover',
    desc: 'Access curated tours, hidden gems, and seamless booking for your next adventure.',
    icon: <Compass size={28} />,
    color: '#007AFF'
  },
  {
    id: 'business',
    title: 'Business Owner',
    subtitle: 'Manage hotels & tours',
    desc: 'List your properties, manage reservations, and grow your hospitality business.',
    icon: <Building size={28} />,
    color: '#AF52DE'
  },
  {
    id: 'provider',
    title: 'Service Provider',
    subtitle: 'Expert local guide',
    desc: 'Share your local knowledge, offer guided experiences, and reach global travelers.',
    icon: <UserCheck size={28} />,
    color: '#FF9500'
  }
];

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const { loading: isGlobalLoading, syncProfile } = useAuth();
  const [selected, setSelected] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleComplete = async () => {
    if (!selected || !user) return;
    setIsSubmitting(true);
    try {
      await user.update({ unsafeMetadata: { ...user.unsafeMetadata, role: selected } });
      if (syncProfile) await syncProfile();
      if (selected === 'business' || selected === 'provider') navigate('/business');
      else navigate('/');
    } catch (err) {
      console.error("Onboarding Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user && role && !isGlobalLoading) {
      const normalizedRole = String(role).toLowerCase();
      if (normalizedRole.includes('business') || normalizedRole.includes('provider')) {
        navigate('/business', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isLoaded, user, role, isGlobalLoading, navigate]);

  if (!user && isLoaded) return null;

  return (
    <div style={{ minHeight: "100vh", background: 'var(--bg-dark)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px' }}>
        <div style={{ maxWidth: 800, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
              <div style={{ width: 64, height: 64, background: 'var(--gradient-aurora)', borderRadius: 16, margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={32} color="#fff" />
              </div>
            </motion.div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 16 }}>Personalize your <span className="text-gradient">Experience.</span></h1>
            <p style={{ color: 'var(--text-gray)', fontSize: 18, maxWidth: 450, margin: '0 auto', fontWeight: 500 }}>Select your role to unlock specialized tools and features tailored for you.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 60 }}>
            {ROLES.map((role, idx) => (
              <motion.div
                key={role.id}
                onClick={() => setSelected(role.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                style={{
                  cursor: 'pointer',
                  padding: '40px 32px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  background: selected === role.id ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selected === role.id ? role.color : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '24px',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: role.color, marginBottom: 24 }}>
                  {role.icon}
                </div>
                <h3 style={{ fontSize: 20, marginBottom: 8, color: '#fff' }}>{role.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-gray)', lineHeight: 1.5 }}>{role.desc}</p>

                <AnimatePresence>
                  {selected === role.id && (
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} style={{ position: 'absolute', top: 20, right: 20, color: role.color }}>
                      <CheckCircle2 size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleComplete}
              disabled={!selected || isSubmitting}
              className="btn-primary"
              style={{
                padding: '16px 48px', fontSize: 16,
                opacity: !selected ? 0.3 : 1,
                cursor: !selected ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? "Finalizing..." : "Continue Journey"} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
