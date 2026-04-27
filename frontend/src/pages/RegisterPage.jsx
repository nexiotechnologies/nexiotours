import { SignUp } from "@clerk/react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";

export default function RegisterPage() {
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg-dark)", display:"flex", alignItems:"center", justifyContent:"center", padding:24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />
      
      <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent-blue)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 22, color: 'var(--text-white)', letterSpacing: '-0.04em' }}>
            NexioTour
          </span>
        </Link>
        <SignUp appearance={{
          elements: {
            card: { background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' },
            headerTitle: { color: '#fff' },
            headerSubtitle: { color: 'var(--text-gray)' },
            socialButtonsBlockButton: { background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' },
            dividerLine: { background: 'var(--glass-border)' },
            dividerText: { color: 'var(--text-gray)' },
            formFieldLabel: { color: 'var(--text-gray)' },
            formFieldInput: { background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', color: '#fff' },
            footerActionText: { color: 'var(--text-gray)' },
            footerActionLink: { color: 'var(--accent-blue)' }
          }
        }} />
      </div>
    </div>
  );
}
