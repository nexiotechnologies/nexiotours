import React from "react";
export default function StarRating({ rating, size = 16 }) {
  return (
    <span style={{ fontSize: size, color: "#F7C948" }}>
      {[1,2,3,4,5].map(i => <span key={i}>{i <= Math.round(rating) ? "★" : "☆"}</span>)}
    </span>
  );
}
