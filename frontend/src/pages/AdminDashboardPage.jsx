import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const bookingData = [
  { month:"Jan", bookings:120, revenue:87000 },
  { month:"Feb", bookings:145, revenue:105000 },
  { month:"Mar", bookings:162, revenue:118000 },
  { month:"Apr", bookings:198, revenue:143000 },
  { month:"May", bookings:234, revenue:170000 },
  { month:"Jun", bookings:278, revenue:201000 },
];

const topDests = [
  { name:"Bali", value:32 },
  { name:"Santorini", value:22 },
  { name:"Kyoto", value:18 },
  { name:"Maldives", value:16 },
  { name:"Others", value:12 },
];

const COLORS = ["#0E7C5B","#1FBF85","#F7C948","#378ADD","#D85A30"];

const USERS = [
  { id:1, name:"Sarah Mitchell", email:"sarah@example.com", role:"traveler", status:"Active", joined:"Jan 2026", bookings:5 },
  { id:2, name:"James Torres", email:"james@example.com", role:"business", status:"Active", joined:"Feb 2026", bookings:0 },
  { id:3, name:"Aisha Khan", email:"aisha@example.com", role:"traveler", status:"Suspended", joined:"Mar 2026", bookings:2 },
  { id:4, name:"Luca Bianchi", email:"luca@example.com", role:"provider", status:"Active", joined:"Mar 2026", bookings:0 },
];

const RECENT_BOOKINGS = [
  { id:"BK001", user:"Sarah M.", destination:"Bali", type:"Tour", amount:1798, status:"Confirmed", date:"Apr 10" },
  { id:"BK002", user:"James T.", destination:"Santorini", type:"Hotel", amount:2598, status:"Pending", date:"Jun 1" },
  { id:"BK003", user:"Aisha K.", destination:"Kyoto", type:"Tour", amount:1099, status:"Completed", date:"Sep 15" },
  { id:"BK004", user:"Luca B.", destination:"Maldives", type:"Luxury", amount:4398, status:"Confirmed", date:"Jul 20" },
];

const statusColors = {
  Confirmed: { bg:"#D1FAE5", color:"#065F46" },
  Pending: { bg:"#FEF3C7", color:"#92400E" },
  Completed: { bg:"#DBEAFE", color:"#1E3A8A" },
  Cancelled: { bg:"#FEE2E2", color:"#991B1B" },
  Active: { bg:"#D1FAE5", color:"#065F46" },
  Suspended: { bg:"#FEE2E2", color:"#991B1B" },
};

const NAV_ITEMS = [
  { id:"overview", icon:"ðŸ“Š", label:"Overview" },
  { id:"bookings", icon:"ðŸ“‹", label:"Bookings" },
  { id:"users", icon:"ðŸ‘¥", label:"Users" },
  { id:"content", icon:"âœï¸", label:"Content" },
  { id:"analytics", icon:"ðŸ“ˆ", label:"Analytics" },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");

  const sidebarStyle = { width:220, background:"#0A2E1E", minHeight:"100vh", padding:"24px 0", position:"fixed", top:0, left:0, zIndex:50 };
  const contentStyle = { marginLeft:220, padding:"32px 40px", minHeight:"100vh", background:"#F9FAFB" };
  const statCard = (icon, label, value, sub, color) => (
    <div style={{ background:"#fff", borderRadius:16, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <p style={{ fontSize:12, color:"#6B7280", fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>{label}</p>
          <p style={{ fontSize:28, fontWeight:800, color:"#0A2E1E", marginTop:4 }}>{value}</p>
          <p style={{ fontSize:12, color: color || "#0E7C5B", marginTop:4 }}>{sub}</p>
        </div>
        <span style={{ fontSize:28 }}>{icon}</span>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Poppins',sans-serif", display:"flex" }}>
      <div style={sidebarStyle}>
        <div style={{ padding:"0 20px 24px", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:22 }}>ðŸŒ</span>
            <span style={{ fontWeight:800, color:"#fff", fontSize:16 }}>NEXIOtour</span>
          </div>
          <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)", letterSpacing:1 }}>ADMIN PANEL</span>
        </div>
        <nav style={{ padding:"16px 12px" }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:"none", background: activeTab===item.id ? "rgba(255,255,255,0.1)":"transparent", color: activeTab===item.id ? "#fff":"rgba(255,255,255,0.6)", fontSize:13, fontWeight: activeTab===item.id ? 600:400, cursor:"pointer", marginBottom:4, textAlign:"left" }}>
              <span style={{ fontSize:16 }}>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.1)", position:"absolute", bottom:0, width:"100%" }}>
          <Link to="/" style={{ color:"rgba(255,255,255,0.5)", fontSize:12 }}>â† Back to Site</Link>
        </div>
      </div>

      <div style={contentStyle}>
        {activeTab === "overview" && (
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, marginBottom:6 }}>Dashboard Overview</h1>
            <p style={{ color:"#6B7280", fontSize:13, marginBottom:28 }}>Welcome back, Admin</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20, marginBottom:32 }}>
              {statCard("📋","Total Bookings","1,247","+18% this month")}
              {statCard("💰","Revenue","₹890,400","+22% this month")}
              {statCard("👥","Total Users","3,891","+134 this week")}
              {statCard("⭐","Avg Rating","4.87","Based on 2,340 reviews")}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:24, marginBottom:28 }}>
              <div style={{ background:"#fff", borderRadius:16, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontSize:15, fontWeight:700, marginBottom:20 }}>Booking Trends</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={bookingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize:12 }} />
                    <YAxis tick={{ fontSize:12 }} />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#0E7C5B" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background:"#fff", borderRadius:16, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
                <h3 style={{ fontSize:15, fontWeight:700, marginBottom:20 }}>Top Destinations</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={topDests} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name,value})=>`${name} ${value}%`} labelLine={false}>
                      {topDests.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ background:"#fff", borderRadius:16, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Recent Bookings</h3>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead><tr style={{ borderBottom:"2px solid #F3F4F6" }}>{["Booking ID","User","Destination","Type","Amount","Status","Date"].map(h => <th key={h} style={{ textAlign:"left", padding:"8px 12px", color:"#6B7280", fontWeight:600, fontSize:11, textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
                <tbody>{RECENT_BOOKINGS.map(b => {
                  const sc = statusColors[b.status];
                  return <tr key={b.id} style={{ borderBottom:"1px solid #F9FAFB" }}>
                    {[b.id, b.user, b.destination, b.type, `₹${b.amount}`, null, b.date].map((val, i) => (
                      <td key={i} style={{ padding:"12px 12px", color: i===4 ? "#0E7C5B":i===4?"#0E7C5B":"#374151", fontWeight: i===4 ? 700:400 }}>
                        {i===5 ? <span style={{ background:sc.bg, color:sc.color, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{b.status}</span> : val}
                      </td>
                    ))}
                  </tr>;
                })}</tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <h1 style={{ fontSize:24, fontWeight:800 }}>User Management</h1>
              <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding:"9px 16px", border:"2px solid #E5E7EB", borderRadius:10, fontSize:13, width:240, fontFamily:"inherit" }} />
            </div>
            <div style={{ background:"#fff", borderRadius:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead><tr style={{ background:"#F9FAFB", borderBottom:"2px solid #F3F4F6" }}>{["Name","Email","Role","Status","Joined","Bookings","Actions"].map(h => <th key={h} style={{ textAlign:"left", padding:"12px 16px", color:"#6B7280", fontWeight:600, fontSize:11, textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
                <tbody>{USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(u => {
                  const sc = statusColors[u.status];
                  return <tr key={u.id} style={{ borderBottom:"1px solid #F9FAFB" }}>
                    <td style={{ padding:"14px 16px", fontWeight:600 }}>{u.name}</td>
                    <td style={{ padding:"14px 16px", color:"#6B7280" }}>{u.email}</td>
                    <td style={{ padding:"14px 16px" }}><span style={{ background:"#E1F5EE", color:"#0E7C5B", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600, textTransform:"capitalize" }}>{u.role}</span></td>
                    <td style={{ padding:"14px 16px" }}><span style={{ background:sc.bg, color:sc.color, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{u.status}</span></td>
                    <td style={{ padding:"14px 16px", color:"#6B7280" }}>{u.joined}</td>
                    <td style={{ padding:"14px 16px" }}>{u.bookings}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <button style={{ padding:"5px 12px", borderRadius:6, background:"#F3F4F6", border:"none", fontSize:11, fontWeight:600, cursor:"pointer", marginRight:6 }}>Edit</button>
                      <button style={{ padding:"5px 12px", borderRadius:6, background:"#FEE2E2", color:"#991B1B", border:"none", fontSize:11, fontWeight:600, cursor:"pointer" }}>{u.status==="Active"?"Suspend":"Unsuspend"}</button>
                    </td>
                  </tr>;
                })}</tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, marginBottom:24 }}>Booking Management</h1>
            <div style={{ background:"#fff", borderRadius:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", overflow:"hidden" }}>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid #F3F4F6", display:"flex", gap:10 }}>
                {["All","Confirmed","Pending","Completed","Cancelled"].map(s => (
                  <button key={s} style={{ padding:"6px 14px", borderRadius:20, border:"2px solid #E5E7EB", background:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>{s}</button>
                ))}
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead><tr style={{ background:"#F9FAFB", borderBottom:"2px solid #F3F4F6" }}>{["ID","User","Destination","Type","Amount","Status","Date","Actions"].map(h => <th key={h} style={{ textAlign:"left", padding:"12px 16px", color:"#6B7280", fontWeight:600, fontSize:11, textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
                <tbody>{RECENT_BOOKINGS.map(b => {
                  const sc = statusColors[b.status];
                  return <tr key={b.id} style={{ borderBottom:"1px solid #F9FAFB" }}>
                    <td style={{ padding:"14px 16px", fontWeight:700, color:"#0E7C5B" }}>{b.id}</td>
                    <td style={{ padding:"14px 16px" }}>{b.user}</td>
                    <td style={{ padding:"14px 16px" }}>{b.destination}</td>
                    <td style={{ padding:"14px 16px", color:"#6B7280" }}>{b.type}</td>
                    <td style={{ padding:"14px 16px", fontWeight:700, color:"#0E7C5B" }}>₹{b.amount}</td>
                    <td style={{ padding:"14px 16px" }}><span style={{ background:sc.bg, color:sc.color, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{b.status}</span></td>
                    <td style={{ padding:"14px 16px", color:"#6B7280" }}>{b.date}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <button style={{ padding:"5px 12px", borderRadius:6, background:"#F3F4F6", border:"none", fontSize:11, fontWeight:600, cursor:"pointer", marginRight:6 }}>View</button>
                      <button style={{ padding:"5px 12px", borderRadius:6, background:"#FEE2E2", color:"#991B1B", border:"none", fontSize:11, fontWeight:600, cursor:"pointer" }}>Refund</button>
                    </td>
                  </tr>;
                })}</tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, marginBottom:24 }}>Analytics</h1>
            <div style={{ background:"#fff", borderRadius:16, padding:28, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginBottom:24 }}>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:20 }}>Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontSize:12 }} />
                  <YAxis tick={{ fontSize:12 }} />
                  <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                  <Line type="monotone" dataKey="revenue" stroke="#0E7C5B" strokeWidth={3} dot={{ fill:"#0E7C5B", r:5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, marginBottom:24 }}>Content Management</h1>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              {[["ðŸ—ºï¸","Destinations","Manage all listed destinations","Manage"],["ðŸ“¦","Tour Packages","Create and edit tour packages","Manage"],["ðŸ“","Blog Posts","Write and publish travel articles","Write"],["ðŸŽŸï¸","Promo Codes","Create discount and promo codes","Create"]].map(([icon,title,desc,action]) => (
                <div key={title} style={{ background:"#fff", borderRadius:16, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
                  <span style={{ fontSize:32, marginBottom:12, display:"block" }}>{icon}</span>
                  <h3 style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>{title}</h3>
                  <p style={{ fontSize:13, color:"#6B7280", marginBottom:16 }}>{desc}</p>
                  <button className="btn-primary" style={{ padding:"8px 20px", fontSize:13 }}>{action}</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
