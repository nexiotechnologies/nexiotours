import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, ArrowRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
          <div style={{ fontSize: 120, fontWeight: 900, letterSpacing: '-0.1em', opacity: 0.05, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0, pointerEvents: 'none' }}>404</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: 'clamp(40px, 8vw, 84px)', marginBottom: 24, letterSpacing: '-0.04em' }}>Lost in <span className="text-gradient">Space.</span></h1>
            <p style={{ color: 'var(--text-gray)', fontSize: 18, maxWidth: 500, margin: '0 auto 48px', fontWeight: 500 }}>The destination you're looking for doesn't exist or has moved to a new coordinate.</p>
            <Link to="/" className="btn-primary" style={{ padding: '16px 40px', fontSize: 16 }}>
              <Globe size={18} /> Return to Home
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
