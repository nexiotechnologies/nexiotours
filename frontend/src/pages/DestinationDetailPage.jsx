import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MOCK = {
  1: {
    id:1, name:"Bali, Indonesia", category:"Beach", rating:4.9, price:"₹899",
    tag:"Trending", location:"Southeast Asia",
    image:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
    images:[
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
    ],
    description:"Bali is a living postcard, an Indonesian paradise that feels like a fantasy. Perched in the center of the Indonesian archipelago, Bali is a destination that entices travelers with its gorgeous sunsets, world-class surf, verdant rice paddies, enchanting temples, and vibrant culture.",
    highlights:["World-class surfing beaches","Ancient Hindu temples","Spectacular rice terraces","Vibrant arts & culinary scene","Luxury spa retreats"],
    weather:"Tropical, warm year-round (26-30°C)",
    bestTime:"April – October (dry season)",
    reviews:[
      { id:1, user:"Sarah M.", rating:5, comment:"Absolutely breathtaking! The temples were magical.", date:"Feb 2026" },
      { id:2, user:"James T.", rating:5, comment:"Best trip of my life. Can't wait to go back!", date:"Jan 2026" },
    ],
    tours:[
      { id:1, type:"Tour", name:"Bali Cultural Tour", duration:"3 days", price:"₹299" },
      { id:2, type:"Hotel", name:"The Layar Seminyak", duration:"per night", price:"₹180" },
      { id:3, type:"Activity", name:"Surf Lessons", duration:"half day", price:"₹65" },
    ]
  }
};

export default function DestinationDetailPage() {
  const { id } = useParams();
  const dest = MOCK[id] || MOCK[1];
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{ fontFamily:"'Poppins',sans-serif", background:"#FFFDF8", minHeight:"100vh" }}>
      <Navbar />
      <div style={{ paddingTop:64 }}>
        <div style={{ position:"relative", height:480, overflow:"hidden" }}>
          <img src={dest.images[activeImg]} alt={dest.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.6))" }} />
          <div style={{ position:"absolute", bottom:40, left:60 }}>
            <div style={{ background:"#F7C948", color:"#0A2E1E", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700, display:"inline-block", marginBottom:12 }}>{dest.tag}</div>
            <h1 style={{ color:"#fff", fontSize:42, fontWeight:800, letterSpacing:-1 }}>{dest.name}</h1>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:16 }}>📍 {dest.location} &nbsp;|&nbsp; ★ {dest.rating} &nbsp;|&nbsp; {dest.category}</p>
          </div>
          <div style={{ position:"absolute", bottom:40, right:60, display:"flex", gap:8 }}>
            {dest.images.map((img, i) => (
              <img key={i} src={img} alt="" onClick={() => setActiveImg(i)} style={{ width:80, height:56, objectFit:"cover", borderRadius:8, cursor:"pointer", border: activeImg===i ? "3px solid #F7C948":"3px solid transparent", opacity: activeImg===i ? 1:0.6 }} />
            ))}
          </div>
        </div>

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 60px", display:"grid", gridTemplateColumns:"1fr 340px", gap:40 }}>
          <div>
            <div style={{ display:"flex", gap:0, marginBottom:32, borderBottom:"2px solid #E5E7EB" }}>
              {["overview","tours","reviews"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding:"10px 24px", border:"none", background:"none", fontWeight:600, fontSize:14, textTransform:"capitalize", cursor:"pointer", color: activeTab===tab ? "#0E7C5B":"#6B7280", borderBottom: activeTab===tab ? "2px solid #0E7C5B":"2px solid transparent", marginBottom:-2 }}>{tab}</button>
              ))}
            </div>
            {activeTab === "overview" && (
              <div>
                <p style={{ fontSize:15, lineHeight:1.8, color:"#374151", marginBottom:28 }}>{dest.description}</p>
                <h3 style={{ fontSize:18, fontWeight:700, marginBottom:16 }}>Highlights</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {dest.highlights.map(h => (
                    <div key={h} style={{ display:"flex", alignItems:"center", gap:10, fontSize:14, color:"#374151" }}>
                      <span style={{ width:20, height:20, background:"#E1F5EE", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#0E7C5B", fontWeight:700 }}>✓</span>
                      {h}
                    </div>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:28 }}>
                  <div style={{ background:"#F0FFF4", borderRadius:12, padding:16 }}><div style={{ fontSize:12, color:"#6B7280" }}>Best Time to Visit</div><div style={{ fontWeight:600, color:"#0A2E1E", marginTop:4 }}>{dest.bestTime}</div></div>
                  <div style={{ background:"#FFF7E6", borderRadius:12, padding:16 }}><div style={{ fontSize:12, color:"#6B7280" }}>Weather</div><div style={{ fontWeight:600, color:"#0A2E1E", marginTop:4 }}>{dest.weather}</div></div>
                </div>
              </div>
            )}
            {activeTab === "tours" && (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {dest.tours.map(t => (
                  <div key={t.id} style={{ background:"#fff", borderRadius:12, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <span style={{ background:"#E1F5EE", color:"#0E7C5B", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{t.type}</span>
                      <h4 style={{ fontSize:15, fontWeight:700, margin:"8px 0 4px" }}>{t.name}</h4>
                      <p style={{ fontSize:13, color:"#6B7280" }}>Duration: {t.duration}</p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:22, fontWeight:800, color:"#0E7C5B" }}>{t.price}</div>
                      <Link to={`/booking/${dest.id}?tour=${t.id}`} className="btn-primary" style={{ fontSize:13, padding:"8px 18px", marginTop:8, display:"inline-block" }}>Book</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:28, background:"#F9FAFB", borderRadius:16, padding:24 }}>
                  <div style={{ textAlign:"center" }}><div style={{ fontSize:52, fontWeight:800, color:"#0E7C5B" }}>{dest.rating}</div><div style={{ color:"#F7C948", fontSize:20 }}>★★★★★</div><div style={{ color:"#6B7280", fontSize:12 }}>Overall</div></div>
                  <div style={{ flex:1 }}>{[5,4,3,2,1].map(s => <div key={s} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}><span style={{ width:12, fontSize:12 }}>{s}</span><div style={{ flex:1, height:6, background:"#E5E7EB", borderRadius:3 }}><div style={{ width: s===5?"80%":s===4?"15%":"5%", height:"100%", background:"#F7C948", borderRadius:3 }} /></div></div>)}</div>
                </div>
                {dest.reviews.map(r => (
                  <div key={r.id} style={{ marginBottom:20, paddingBottom:20, borderBottom:"1px solid #F3F4F6" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <div style={{ fontWeight:600, fontSize:14 }}>{r.user}</div>
                      <span style={{ color:"#9CA3AF", fontSize:12 }}>{r.date}</span>
                    </div>
                    <div style={{ color:"#F7C948", fontSize:14, marginBottom:6 }}>{"★".repeat(r.rating)}</div>
                    <p style={{ fontSize:14, color:"#374151" }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ background:"#fff", borderRadius:16, padding:28, boxShadow:"0 4px 20px rgba(0,0,0,0.07)", position:"sticky", top:84 }}>
              <div style={{ marginBottom:20 }}>
                <span style={{ fontSize:28, fontWeight:800, color:"#0E7C5B" }}>{dest.price}</span>
                <span style={{ color:"#9CA3AF", fontSize:13 }}>/person</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
                <div><label style={{ fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, display:"block" }}>Check In</label><input type="date" style={{ width:"100%", padding:"10px 14px", border:"2px solid #E5E7EB", borderRadius:8, fontSize:13, fontFamily:"inherit" }} /></div>
                <div><label style={{ fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, display:"block" }}>Check Out</label><input type="date" style={{ width:"100%", padding:"10px 14px", border:"2px solid #E5E7EB", borderRadius:8, fontSize:13, fontFamily:"inherit" }} /></div>
                <div><label style={{ fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, display:"block" }}>Guests</label><select style={{ width:"100%", padding:"10px 14px", border:"2px solid #E5E7EB", borderRadius:8, fontSize:13, fontFamily:"inherit" }}>{[1,2,3,4,5,6].map(n => <option key={n}>{n} {n===1?"Guest":"Guests"}</option>)}</select></div>
              </div>
              <Link to={`/booking/${dest.id}`} className="btn-primary" style={{ display:"block", width:"100%", textAlign:"center", padding:"14px", fontSize:15 }}>Book Now</Link>
              <p style={{ textAlign:"center", fontSize:12, color:"#9CA3AF", marginTop:12 }}>No payment charged yet</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
