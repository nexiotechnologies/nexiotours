import React from "react";
import { Link } from "react-router-dom";
import { CloudinaryImage } from "../common/CloudinaryMedia";
const tagColors = {
  Trending: { bg: "#FFF3CD", color: "#B45309" },
  Popular: { bg: "#D1FAE5", color: "#065F46" },
  New: { bg: "#DBEAFE", color: "#1E3A8A" },
  Luxury: { bg: "#F3E8FF", color: "#6B21A8" },
};
export default function DestinationCard({ destination }) {
  const { id, name, category, rating, price, image, tag, location } = destination;
  const tc = tagColors[tag] || { bg: "#F3F4F6", color: "#374151" };
  return (
    <Link to={`/destinations/${id}`} className="card" style={{ display: "block", transition: "transform 0.25s" }}>
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <CloudinaryImage 
          publicId={image} 
          alt={name} 
          className="card-image"
          width={600} 
          height={400}
        />
        <span style={{ position: "absolute", top: 14, left: 14, background: tc.bg, color: tc.color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{tag}</span>
        <span style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.45)", color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 12 }}>★ {rating}</span>
      </div>
      <div style={{ padding: "18px 20px" }}>
        <div style={{ color: "#0E7C5B", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{category}</div>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{name}</h3>
        <p style={{ color: "#6B7280", fontSize: 12, marginBottom: 12 }}>📍 {location}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><span style={{ fontSize: 20, fontWeight: 800, color: "#0E7C5B" }}>{price}</span><span style={{ color: "#9CA3AF", fontSize: 12 }}>/person</span></div>
          <span style={{ background: "linear-gradient(135deg,#0E7C5B,#1FBF85)", color: "#fff", padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Book Now</span>
        </div>
      </div>
    </Link>
  );
}
