import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const POSTS = [
  { id:1, title:'10 Hidden Gems in Southeast Asia You Must Visit', category:'Travel Guide', author:'Admin', date:'Mar 10, 2026', image:'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80', excerpt:'Discover breathtaking places off the beaten path in Southeast Asia, from secluded beaches to ancient temples.', readTime:'5 min' },
  { id:2, title:'How to Travel Sustainably Without Sacrificing Comfort', category:'Tips',         author:'Sarah M.', date:'Mar 5, 2026',  image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', excerpt:'Eco-friendly travel tips that help you reduce your carbon footprint while enjoying an amazing vacation.', readTime:'4 min' },
  { id:3, title:'The Ultimate Bali Travel Guide for 2026',            category:'Destination',    author:'Admin', date:'Feb 28, 2026', image:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', excerpt:'Everything you need to know about Bali: best time to visit, must-see spots, and insider tips.', readTime:'8 min' },
  { id:4, title:'Solo Travel Safety Tips Every Adventurer Should Know', category:'Tips',          author:'James K.', date:'Feb 20, 2026', image:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80', excerpt:'Stay safe and confident on your solo adventures with these essential tips from experienced travelers.', readTime:'6 min' },
];

const CATS = ['All', 'Travel Guide', 'Tips', 'Destination', 'Stories'];
const CAT_COLORS = { 'Travel Guide':'#D1FAE5/#065F46', 'Tips':'#DBEAFE/#1E3A8A', 'Destination':'#FFF3CD/#B45309', 'Stories':'#EDE9FE/#5B21B6' };

export default function BlogPage() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? POSTS : POSTS.filter(p => p.category === active);

  return (
    <div style={{ minHeight:'100vh', background:'#FFFDF8' }}>
      <Navbar />
      <div style={{ paddingTop:80 }}>
        <div style={{ background:'linear-gradient(135deg,#0A2E1E,#0E7C5B)', padding:'60px 60px 50px', textAlign:'center', color:'#fff' }}>
          <span style={{ background:'rgba(247,201,72,0.2)', color:'#F7C948', borderRadius:20, padding:'5px 16px', fontSize:12, fontWeight:600, letterSpacing:1 }}>OUR BLOG</span>
          <h1 style={{ fontSize:42, fontWeight:800, letterSpacing:-1, marginTop:12, marginBottom:10 }}>Travel Stories & Guides</h1>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:16, maxWidth:500, margin:'0 auto' }}>Inspiration, tips, and stories from around the world</p>
        </div>

        <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 40px' }}>
          {/* Category filters */}
          <div style={{ display:'flex', gap:10, marginBottom:36, flexWrap:'wrap' }}>
            {CATS.map(cat => (
              <button key={cat} onClick={() => setActive(cat)} style={{
                padding:'8px 20px', borderRadius:24, border:'2px solid', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.2s',
                borderColor: active===cat ? '#0E7C5B' : '#E5E7EB',
                background: active===cat ? '#0E7C5B' : '#fff',
                color: active===cat ? '#fff' : '#4A4A6A',
              }}>{cat}</button>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:28 }}>
            {filtered.map(post => {
              const [bg, tc] = (CAT_COLORS[post.category] || '#E5E7EB/#4A4A6A').split('/');
              return (
                <Link key={post.id} to={`/blog/${post.id}`} style={{ textDecoration:'none' }}>
                  <div className="card">
                    <div style={{ position:'relative', height:200, overflow:'hidden' }}>
                      <img src={post.image} alt={post.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s' }}
                        onMouseEnter={e=>e.target.style.transform='scale(1.05)'} onMouseLeave={e=>e.target.style.transform='scale(1)'} />
                    </div>
                    <div style={{ padding:'18px 20px 22px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                        <span style={{ background:bg, color:tc, borderRadius:12, padding:'2px 10px', fontSize:11, fontWeight:600 }}>{post.category}</span>
                        <span style={{ color:'#9CA3AF', fontSize:11 }}>{post.readTime} read</span>
                      </div>
                      <h3 style={{ fontSize:16, fontWeight:700, color:'#0D1B2A', lineHeight:1.4, marginBottom:10 }}>{post.title}</h3>
                      <p style={{ color:'#9CA3AF', fontSize:13, lineHeight:1.6, marginBottom:14 }}>{post.excerpt}</p>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span style={{ fontSize:12, color:'#9CA3AF' }}>{post.author} · {post.date}</span>
                        <span style={{ color:'#0E7C5B', fontWeight:600, fontSize:13 }}>Read →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
