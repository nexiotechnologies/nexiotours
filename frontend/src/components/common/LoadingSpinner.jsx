import React from "react";
export default function LoadingSpinner({ size = 40 }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{ width: size, height: size, border: "3px solid #E5E7EB", borderTopColor: "#0E7C5B", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
