import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-dark)', color: 'var(--text-gray)', padding: '100px 48px 60px', borderTop: '1px solid var(--glass-border)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 64, marginBottom: 80 }}>
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ 
              width: 28, height: 28, 
              background: 'var(--accent-blue)', 
              borderRadius: 6, display: 'flex', 
              alignItems: 'center', justifyContent: 'center'
            }}>
              <Globe size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-white)', letterSpacing: '-0.04em' }}>
              NexioTour
            </span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, maxWidth: 320, fontWeight: 500 }}>
            Curating the world's most exclusive travel experiences with NexioTour.
          </p>
        </div>
        
        {[
          { title: 'Collections', links: [{l:'Tours', p:'/tours'}, {l:'Hotels', p:'/hotels'}, {l:'Guides', p:'/guides'}] },
          { title: 'Philosophy', links: [{l:'About Us', p:'/about'}, {l:'The Blog', p:'/blog'}, {l:'Partners', p:'/partners'}] },
          { title: 'Support', links: [{l:'Help Center', p:'/help'}, {l:'Privacy', p:'/privacy'}, {l:'Terms', p:'/terms'}] },
        ].map(({ title, links }) => (
          <div key={title}>
            <h4 style={{ color: 'var(--text-white)', fontWeight: 700, marginBottom: 24, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h4>
            <ul style={{ listStyle: 'none' }}>
              {links.map((item) => (
                <li key={item.l} style={{ marginBottom: 12 }}>
                  <Link to={item.p} style={{ fontSize: 14, color: 'var(--text-gray)', fontWeight: 500, transition: 'color 0.3s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-gray)'}
                  >{item.l}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="container" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 40, opacity: 0.5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 500 }}>
            © 2026 NexioTour Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 12, fontWeight: 500 }}>
            <span>Twitter</span>
            <span>Instagram</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
