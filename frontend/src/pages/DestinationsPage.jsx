import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import DestinationCard from "../components/destinations/DestinationCard";

const ALL_DESTINATIONS = [
  { id:1, name:"Bali, Indonesia", category:"Beach", rating:4.9, price:"₹899", tag:"Trending", location:"Southeast Asia", image:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80" },
  { id:2, name:"Santorini, Greece", category:"Island", rating:4.8, price:"₹1,299", tag:"Popular", location:"Europe", image:"https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80" },
  { id:3, name:"Kyoto, Japan", category:"Cultural", rating:4.9, price:"₹1,099", tag:"New", location:"East Asia", image:"https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80" },
  { id:4, name:"Maldives", category:"Luxury", rating:5.0, price:"₹2,199", tag:"Luxury", location:"Indian Ocean", image:"https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80" },
  { id:5, name:"Machu Picchu, Peru", category:"Cultural", rating:4.8, price:"₹950", tag:"Popular", location:"South America", image:"https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80" },
  { id:6, name:"Safari, Kenya", category:"Wildlife", rating:4.9, price:"₹1,800", tag:"Trending", location:"Africa", image:"https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80" },
  { id:7, name:"Amalfi Coast, Italy", category:"Beach", rating:4.7, price:"₹1,150", tag:"Popular", location:"Europe", image:"https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600&q=80" },
  { id:8, name:"New York, USA", category:"City Tours", rating:4.7, price:"₹799", tag:"Popular", location:"North America", image:"https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80" },
];

const CATS = ["All","Beach","Island","Cultural","Luxury","Wildlife","City Tours","Mountains","Tropical"];

export default function DestinationsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(3000);

  const filtered = ALL_DESTINATIONS.filter(d => {
    const matchCat = activeCategory === "All" || d.category === activeCategory;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
    const matchPrice = parseInt(d.price.replace(/[^0-9]/g,"")) <= priceRange;
    return matchCat && matchSearch && matchPrice;
  });

  return (
    <div style={{ fontFamily:"'Poppins',sans-serif", background:"#FFFDF8", minHeight:"100vh" }}>
      <Navbar />
      <div style={{ paddingTop:64 }}>
        <div style={{ background:"linear-gradient(135deg,#0A2E1E,#0E7C5B)", padding:"60px 60px 40px", textAlign:"center" }}>
          <h1 style={{ color:"#fff", fontSize:42, fontWeight:800, letterSpacing:-1, marginBottom:12 }}>Explore Destinations</h1>
          <p style={{ color:"rgba(255,255,255,0.75)", fontSize:16, marginBottom:32 }}>Discover over 120 incredible destinations worldwide</p>
          <div style={{ background:"rgba(255,255,255,0.97)", borderRadius:60, padding:"8px 8px 8px 24px", display:"flex", alignItems:"center", gap:12, width:"100%", maxWidth:560, margin:"0 auto" }}>
            <span>🔍</span>
            <input type="text" placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex:1, border:"none", outline:"none", fontSize:14, background:"transparent", fontFamily:"inherit" }} />
          </div>
        </div>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 60px" }}>
          <div style={{ display:"flex", gap:24, alignItems:"flex-start" }}>
            <div style={{ width:240, flexShrink:0, background:"#fff", borderRadius:16, padding:24, boxShadow:"0 4px 20px rgba(0,0,0,0.07)", position:"sticky", top:84 }}>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Filters</h3>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#6B7280", textTransform:"uppercase", letterSpacing:1 }}>Category</label>
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:8 }}>
                  {CATS.map(c => (
                    <button key={c} onClick={() => setActiveCategory(c)} style={{ textAlign:"left", padding:"7px 12px", borderRadius:8, border:"none", background: activeCategory===c ? "#E1F5EE":"transparent", color: activeCategory===c ? "#0E7C5B":"#374151", fontWeight: activeCategory===c ? 600:400, fontSize:13, cursor:"pointer" }}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#6B7280", textTransform:"uppercase", letterSpacing:1 }}>Max Price: ₹{priceRange}</label>
                <input type="range" min={200} max={3000} step={100} value={priceRange} onChange={e => setPriceRange(+e.target.value)} style={{ width:"100%", marginTop:8, accentColor:"#0E7C5B" }} />
              </div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <span style={{ fontSize:14, color:"#6B7280" }}>{filtered.length} destinations found</span>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding:"8px 14px", borderRadius:8, border:"2px solid #E5E7EB", fontSize:13, background:"#fff", fontFamily:"inherit", cursor:"pointer" }}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:24 }}>
                {filtered.map(d => <DestinationCard key={d.id} destination={d} />)}
              </div>
              {filtered.length === 0 && (
                <div style={{ textAlign:"center", padding:"60px 0", color:"#9CA3AF" }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
                  <p style={{ fontSize:16 }}>No destinations match your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
