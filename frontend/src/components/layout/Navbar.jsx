import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Show, SignInButton, SignUpButton } from '@clerk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Settings } from 'lucide-react';

export default function Navbar() {
  const { user, role, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentRole = typeof role === 'string' ? role.toLowerCase() : '';
  const isVendor = currentRole.startsWith('bus') || currentRole.startsWith('pro') || currentRole.includes('vendor');

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '0 48px',
      height: 84,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, background: 'var(--accent-blue)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Globe size={18} color="#fff" />
        </div>
        <span style={{ fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-0.04em' }}>NexioTour</span>
      </div>

      <div className="desktop-only" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <Link to={isVendor ? "/business" : "/"} style={{ fontWeight: 700, fontSize: '14px', color: '#fff', whiteSpace: 'nowrap' }}>Home</Link>
        {['Tours', 'Hotels', 'Guides', 'Hidden Gems', 'Blog'].map((l) => (
          <Link 
            key={l} 
            to={`/${l.toLowerCase().replace(' ', '-')}`} 
            style={{ 
              fontWeight: 600, 
              fontSize: '14px', 
              color: 'var(--text-gray)', 
              transition: '0.3s',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'var(--text-gray)'}
          >
            {l}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Show when="signed-in">
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserDropdown(!userDropdown)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '6px 14px 6px 6px',
                borderRadius: 40,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer', transition: '0.3s'
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden' }}>
                <img src={user?.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{user?.firstName}</span>
              <ChevronDown size={14} color="var(--text-gray)" />
            </button>

            <AnimatePresence>
              {userDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    position: 'absolute', top: '120%', right: 0,
                    width: 220, background: '#111',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 16, padding: 8, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                  }}
                >
                  <Link to="/profile" onClick={() => setUserDropdown(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, color: 'var(--text-gray)', fontSize: 13, fontWeight: 600 }}>
                    <User size={16} /> My Profile
                  </Link>
                  {isVendor && (
                    <Link to="/business" onClick={() => setUserDropdown(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, color: 'var(--text-gray)', fontSize: 13, fontWeight: 600 }}>
                      <LayoutDashboard size={16} /> Vendor Hub
                    </Link>
                  )}
                  <div style={{ height: 1, background: 'rgba(255, 255, 255, 0.05)', margin: '4px 0' }} />
                  <button onClick={() => signOut()} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, color: '#FF453A', fontSize: 13, fontWeight: 700, background: 'transparent' }}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Show>

        <Show when="signed-out">
          <div className="desktop-only" style={{ gap: 12 }}>
            <SignInButton mode="modal"><button className="btn-outline" style={{ padding: '10px 24px', fontSize: 14 }}>Log in</button></SignInButton>
            <SignUpButton mode="modal"><button className="btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}>Get Started</button></SignUpButton>
          </div>
        </Show>

        <button className="mobile-only" onClick={() => setMobileMenu(!mobileMenu)} style={{ display: 'none', background: 'transparent', color: '#fff' }}>
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
}
