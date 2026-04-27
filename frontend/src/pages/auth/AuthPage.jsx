import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'traveler',  label: 'ðŸ§³ Traveler',         desc: 'Browse & book trips' },
  { value: 'business',  label: 'ðŸ¢ Business Owner',   desc: 'List your services' },
  { value: 'provider',  label: 'ðŸŽ¯ Service Provider',  desc: 'Manage tours & activities' },
];

export default function AuthPage({ mode = 'login' }) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', fullName: '', role: 'traveler' });
  const [loading, setLoading] = useState(false);
  const isLogin = mode === 'login';

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(form.email, form.password);
        if (error) throw error;
        toast.success('Welcome back!');
        navigate('/');
      } else {
        const { error } = await signUp(form.email, form.password, form.role, form.fullName);
        if (error) throw error;
        toast.success('Account created! Please check your email.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) toast.error(error.message);
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#0A2E1E,#0E7C5B 60%,#1FBF85)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'#fff', borderRadius:24, padding:'44px 40px', width:'100%', maxWidth:480, boxShadow:'0 24px 60px rgba(0,0,0,0.2)' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, marginBottom:28, justifyContent:'center' }}>
          <span style={{ fontSize:28 }}>ðŸŒ</span>
          <span style={{ fontWeight:800, fontSize:22, color:'#0E7C5B' }}>NEXIOtour</span>
        </Link>

        <h2 style={{ fontSize:26, fontWeight:800, color:'#0D1B2A', textAlign:'center', marginBottom:6 }}>
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>
        <p style={{ color:'#9CA3AF', textAlign:'center', fontSize:14, marginBottom:28 }}>
          {isLogin ? 'Sign in to continue your journey' : 'Join 50,000+ travelers worldwide'}
        </p>

        <button onClick={handleGoogle} style={{ width:'100%', padding:'12px', border:'1.5px solid #E5E7EB', borderRadius:12, background:'#fff', fontSize:14, fontWeight:600, color:'#4A4A6A', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:20 }}>
          <span>ðŸ”µ</span> Continue with Google
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ flex:1, height:1, background:'#E5E7EB' }} />
          <span style={{ color:'#9CA3AF', fontSize:12 }}>or</span>
          <div style={{ flex:1, height:1, background:'#E5E7EB' }} />
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="John Doe" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" value={form.password} onChange={e => set('password', e.target.value)} required />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                {ROLES.map(r => (
                  <div key={r.value} onClick={() => set('role', r.value)} style={{
                    border:`2px solid ${form.role === r.value ? '#0E7C5B' : '#E5E7EB'}`,
                    borderRadius:12, padding:'10px 8px', textAlign:'center', cursor:'pointer',
                    background: form.role === r.value ? '#F0FDF4' : '#fff',
                    transition:'all 0.2s',
                  }}>
                    <div style={{ fontSize:18, marginBottom:4 }}>{r.label.split(' ')[0]}</div>
                    <div style={{ fontSize:11, fontWeight:600, color: form.role === r.value ? '#0E7C5B' : '#4A4A6A' }}>{r.label.split(' ').slice(1).join(' ')}</div>
                    <div style={{ fontSize:10, color:'#9CA3AF', marginTop:2 }}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLogin && (
            <div style={{ textAlign:'right', marginBottom:16 }}>
              <Link to="/forgot-password" style={{ color:'#0E7C5B', fontSize:13, fontWeight:500 }}>Forgot password?</Link>
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width:'100%', padding:'13px', borderRadius:12,
            background:'linear-gradient(135deg,#0E7C5B,#1FBF85)',
            border:'none', color:'#fff', fontWeight:700, fontSize:15,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            boxShadow:'0 4px 14px rgba(14,124,91,0.3)',
          }}>
            {loading ? '...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'#9CA3AF' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link to={isLogin ? '/register' : '/login'} style={{ color:'#0E7C5B', fontWeight:600 }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  );
}
