import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const TIERS = [
  { name:"Bronze", icon:"ðŸ¥‰", min:0, max:999, color:"#CD7F32", bg:"#FEF3C7", perks:["5% discount on bookings","Early access to deals"] },
  { name:"Silver", icon:"ðŸ¥ˆ", min:1000, max:4999, color:"#9CA3AF", bg:"#F3F4F6", perks:["10% discount on bookings","Free activity upgrade","Priority support"] },
  { name:"Gold", icon:"ðŸ¥‡", min:5000, max:null, color:"#F7C948", bg:"#FFFBEB", perks:["15% discount on bookings","Free room upgrade","Dedicated concierge","Birthday bonus 500pts"] },
];

const HISTORY = [
  { id:1, action:"Booking â€“ Bali Tour", points:+450, date:"Apr 10, 2026", type:"earn" },
  { id:2, action:"Referral Bonus â€“ James T.", points:+200, date:"Mar 28, 2026", type:"earn" },
  { id:3, action:"Redeemed â€“ 10% discount", points:-300, date:"Mar 15, 2026", type:"redeem" },
  { id:4, action:"Booking â€“ Santorini Hotel", points:+650, date:"Feb 20, 2026", type:"earn" },
  { id:5, action:"Birthday Bonus", points:+100, date:"Jan 15, 2026", type:"earn" },
];

const currentPoints = 1100;
const currentTier = TIERS[1];

export default function LoyaltyPage() {
  const progressToNext = ((currentPoints - currentTier.min) / (4999 - currentTier.min)) * 100;

  return (
    <div style={{ fontFamily:"'Poppins',sans-serif", background:"#FFFDF8", minHeight:"100vh" }}>
      <Navbar />
      <div style={{ paddingTop:64, maxWidth:900, margin:"0 auto", padding:"80px 24px 60px" }}>
        <div style={{ background:"linear-gradient(135deg,#0A2E1E,#0E7C5B,#1FBF85)", borderRadius:24, padding:"40px 40px", marginBottom:36, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(247,201,72,0.15)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ color:"rgba(255,255,255,0.7)", fontSize:13 }}>Your Loyalty Status</p>
              <h1 style={{ color:"#fff", fontSize:32, fontWeight:800, marginTop:4 }}>
                {currentTier.icon} {currentTier.name} Member
              </h1>
              <p style={{ color:"#F7C948", fontSize:28, fontWeight:800, marginTop:8 }}>
                {currentPoints.toLocaleString()} <span style={{ fontSize:14, fontWeight:400, color:"rgba(255,255,255,0.6)" }}>points</span>
              </p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:12 }}>Next tier: Gold</p>
              <p style={{ color:"#F7C948", fontWeight:700, fontSize:14 }}>{(5000-currentPoints).toLocaleString()} pts away</p>
            </div>
          </div>
          <div style={{ marginTop:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"rgba(255,255,255,0.6)", marginBottom:6 }}>
              <span>Silver (1,000 pts)</span><span>Gold (5,000 pts)</span>
            </div>
            <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:20, height:8 }}>
              <div style={{ width:`${progressToNext}%`, height:"100%", background:"#F7C948", borderRadius:20, transition:"width 1s" }} />
            </div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:36 }}>
          {TIERS.map(tier => (
            <div key={tier.name} style={{ background:"#fff", borderRadius:16, padding:24, boxShadow:"0 4px 20px rgba(0,0,0,0.07)", border: tier.name===currentTier.name ? `2px solid ${tier.color}`:"2px solid transparent" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>{tier.icon}</div>
              <h3 style={{ fontSize:17, fontWeight:700, color:tier.color, marginBottom:4 }}>{tier.name}</h3>
              <p style={{ fontSize:12, color:"#6B7280", marginBottom:12 }}>{tier.min.toLocaleString()} {tier.max ? `â€“ ${tier.max.toLocaleString()}`:"+"}  pts</p>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {tier.perks.map(p => <div key={p} style={{ fontSize:12, color:"#374151", display:"flex", gap:6 }}><span style={{ color:"#0E7C5B", fontWeight:700 }}>âœ“</span>{p}</div>)}
              </div>
              {tier.name===currentTier.name && <div style={{ marginTop:12, background:tier.bg, borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, color:tier.color, display:"inline-block" }}>Current Tier</div>}
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
          <div style={{ background:"#fff", borderRadius:16, padding:24, boxShadow:"0 4px 20px rgba(0,0,0,0.07)" }}>
            <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Points History</h3>
            {HISTORY.map(h => (
              <div key={h.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #F9FAFB" }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:500, color:"#0A2E1E" }}>{h.action}</p>
                  <p style={{ fontSize:11, color:"#9CA3AF" }}>{h.date}</p>
                </div>
                <span style={{ fontSize:14, fontWeight:700, color: h.type==="earn" ? "#0E7C5B":"#E24B4A" }}>{h.type==="earn" ? "+":""}{h.points}</span>
              </div>
            ))}
          </div>
          <div style={{ background:"#fff", borderRadius:16, padding:24, boxShadow:"0 4px 20px rgba(0,0,0,0.07)" }}>
            <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Redeem Points</h3>
            {[["10% off next booking","300 pts"],["Free activity upgrade","500 pts"],["Room upgrade","750 pts"],["Free night stay","1500 pts"]].map(([reward, cost]) => (
              <div key={reward} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid #F9FAFB" }}>
                <div><p style={{ fontSize:13, fontWeight:500 }}>{reward}</p><p style={{ fontSize:11, color:"#F7C948", fontWeight:700 }}>ðŸŒŸ {cost}</p></div>
                <button style={{ padding:"6px 14px", borderRadius:8, background: currentPoints >= parseInt(cost) ? "#0E7C5B":"#E5E7EB", color: currentPoints >= parseInt(cost) ? "#fff":"#9CA3AF", border:"none", fontSize:12, fontWeight:600, cursor: currentPoints >= parseInt(cost) ? "pointer":"default" }}>
                  Redeem
                </button>
              </div>
            ))}
            <div style={{ marginTop:20, background:"#F0FFF4", borderRadius:12, padding:16 }}>
              <p style={{ fontSize:13, fontWeight:700, color:"#0A2E1E", marginBottom:4 }}>ðŸŽ Refer a Friend</p>
              <p style={{ fontSize:12, color:"#6B7280", marginBottom:12 }}>Earn 200 points for every friend who books!</p>
              <div style={{ display:"flex", gap:8 }}>
                <input readOnly value="NEXIOtour.com/ref/USR123" style={{ flex:1, padding:"8px 12px", border:"2px solid #E5E7EB", borderRadius:8, fontSize:12, fontFamily:"inherit" }} />
                <button style={{ padding:"8px 14px", background:"#0E7C5B", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" }}>Copy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
