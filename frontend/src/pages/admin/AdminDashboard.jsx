import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';

const bookingData = [
  { month:'Jan', bookings:42, revenue:37800 },
  { month:'Feb', bookings:58, revenue:52200 },
  { month:'Mar', bookings:73, revenue:65700 },
  { month:'Apr', bookings:61, revenue:54900 },
  { month:'May', bookings:89, revenue:80100 },
  { month:'Jun', bookings:112, revenue:100800 },
];

const RECENT_BOOKINGS = [
  { id:'#BK001', user:'Sarah M.', destination:'Bali, Indonesia', date:'Mar 15', amount:'₹1,798', status:'confirmed' },
  { id:'#BK002', user:'James K.', destination:'Swiss Alps',      date:'Mar 14', amount:'₹3,198', status:'pending' },
  { id:'#BK003', user:'Priya R.', destination:'Kyoto, Japan',    date:'Mar 13', amount:'₹2,198', status:'confirmed' },
  { id:'#BK004', user:'Tom W.',   destination:'Maldives',        date:'Mar 12', amount:'₹4,398', status:'cancelled' },
];

const STATUS_COLORS = { confirmed:'#D1FAE5', pending:'#FFF3CD', cancelled:'#FFE4E4' };
const STATUS_TEXT   = { confirmed:'#065F46', pending:'#B45309', cancelled:'#991B1B' };

const NAV_ITEMS = [
  { icon:'ðŸ“Š', label:'Overview',    key:'overview' },
  { icon:'ðŸ—ºï¸', label:'Destinations', key:'destinations' },
  { icon:'ðŸ“…', label:'Bookings',    key:'bookings' },
  { icon:'ðŸ‘¥', label:'Users',       key:'users' },
  { icon:'âœï¸', label:'Blog',        key:'blog' },
  { icon:'ðŸŽ', label:'Loyalty',     key:'loyalty' },
  { icon:'âš™ï¸', label:'Settings',   key:'settings' },
];

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [activeNav, setActiveNav] = useState('overview');

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#F8FAF9', fontFamily:"'Poppins',sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width:220, background:'#0A2E1E', display:'flex', flexDirection:'column', position:'fixed', top:0, bottom:0, left:0, overflowY:'auto' }}>
        <div style={{ padding:'24px 20px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>ðŸŒ</span>
            <span style={{ fontWeight:800, fontSize:16, color:'#fff' }}>NEXIOtour</span>
          </div>
          <span style={{ background:'rgba(247,201,72,0.2)', color:'#F7C948', borderRadius:10, padding:'2px 8px', fontSize:10, fontWeight:600, marginTop:6, display:'inline-block' }}>Admin Panel</span>
        </div>
        <nav style={{ flex:1, padding:'16px 0' }}>
          {NAV_ITEMS.map(({ icon, label, key }) => (
            <button key={key} onClick={() => setActiveNav(key)} style={{
              width:'100%', display:'flex', alignItems:'center', gap:10,
              padding:'11px 20px', border:'none', background: activeNav===key ? 'rgba(14,124,91,0.3)' : 'transparent',
              color: activeNav===key ? '#1FBF85' : 'rgba(255,255,255,0.6)',
              fontSize:13, fontWeight: activeNav===key ? 600 : 400, cursor:'pointer',
              borderLeft: activeNav===key ? '3px solid #1FBF85' : '3px solid transparent',
              textAlign:'left', transition:'all 0.2s',
            }}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:4 }}>Signed in as</div>
          <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:10 }}>{user?.email || 'admin@NEXIOtour.com'}</div>
          <button onClick={signOut} style={{ fontSize:12, color:'rgba(255,255,255,0.5)', background:'none', border:'none', cursor:'pointer', padding:0 }}>Sign Out</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft:220, flex:1, padding:'32px 40px' }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#0D1B2A', marginBottom:4 }}>
            {NAV_ITEMS.find(n=>n.key===activeNav)?.icon} {NAV_ITEMS.find(n=>n.key===activeNav)?.label}
          </h1>
          <p style={{ color:'#9CA3AF', fontSize:13 }}>Welcome back! Here's what's happening today.</p>
        </div>

        {activeNav === 'overview' && (
          <>
            {/* KPI cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:32 }}>
              {[
                { label:'Total Bookings', value:'1,284', change:'+12%', icon:'📅', color:'#0E7C5B' },
                { label:'Revenue',        value:'₹94,200', change:'+18%', icon:'💰', color:'#7F77DD' },
                { label:'Active Users',   value:'3,847', change:'+7%', icon:'👥', color:'#378ADD' },
                { label:'Destinations',   value:'128', change:'+3', icon:'🗺️', color:'#EF9F27' },
              ].map(({ label, value, change, icon, color }) => (
                <div key={label} style={{ background:'#fff', borderRadius:16, padding:22, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <div style={{ fontSize:12, color:'#9CA3AF', marginBottom:6 }}>{label}</div>
                      <div style={{ fontSize:26, fontWeight:800, color:'#0D1B2A' }}>{value}</div>
                    </div>
                    <div style={{ width:42, height:42, borderRadius:12, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{icon}</div>
                  </div>
                  <div style={{ marginTop:10, fontSize:12, color:'#0E7C5B', fontWeight:600 }}>{change} this month</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:32 }}>
              <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize:15, fontWeight:700, marginBottom:20, color:'#0D1B2A' }}>Monthly Bookings</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={bookingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize:12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:12 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#0E7C5B" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize:15, fontWeight:700, marginBottom:20, color:'#0D1B2A' }}>Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={bookingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize:12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:12 }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
                    <Line type="monotone" dataKey="revenue" stroke="#7F77DD" strokeWidth={2.5} dot={{ fill:'#7F77DD', r:4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent bookings table */}
            <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                <h3 style={{ fontSize:15, fontWeight:700, color:'#0D1B2A' }}>Recent Bookings</h3>
                <button onClick={()=>setActiveNav('bookings')} style={{ fontSize:13, color:'#0E7C5B', fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>View All â†’</button>
              </div>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['ID','User','Destination','Date','Amount','Status'].map(h => (
                      <th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize:11, fontWeight:600, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:0.8, borderBottom:'1px solid #F3F4F6' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_BOOKINGS.map(b => (
                    <tr key={b.id}>
                      <td style={{ padding:'12px', fontSize:13, fontWeight:600, color:'#0E7C5B' }}>{b.id}</td>
                      <td style={{ padding:'12px', fontSize:13 }}>{b.user}</td>
                      <td style={{ padding:'12px', fontSize:13, color:'#4A4A6A' }}>{b.destination}</td>
                      <td style={{ padding:'12px', fontSize:13, color:'#9CA3AF' }}>{b.date}</td>
                      <td style={{ padding:'12px', fontSize:13, fontWeight:700 }}>{b.amount}</td>
                      <td style={{ padding:'12px' }}>
                        <span style={{ background:STATUS_COLORS[b.status], color:STATUS_TEXT[b.status], borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:600, textTransform:'capitalize' }}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeNav !== 'overview' && (
          <div style={{ background:'#fff', borderRadius:16, padding:48, textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>{NAV_ITEMS.find(n=>n.key===activeNav)?.icon}</div>
            <h2 style={{ fontSize:22, fontWeight:700, color:'#0D1B2A', marginBottom:8 }}>{NAV_ITEMS.find(n=>n.key===activeNav)?.label} Module</h2>
            <p style={{ color:'#9CA3AF', fontSize:14 }}>This section is ready to be connected to the Django REST API.</p>
          </div>
        )}
      </main>
    </div>
  );
}
