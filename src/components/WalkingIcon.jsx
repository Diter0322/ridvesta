import React from "react";
import "./WalkingIcon.css";

export default function WalkingIcon({ size = 20, color = "#fff" }) {
  return (
    <svg
      className="walking-icon"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
    >
      {/* Head */}
      <circle cx="50" cy="20" r="8" fill={color} />

      {/* Body */}
      <rect x="45" y="28" width="10" height="22" rx="5" fill={color} />

      {/* Arms */}
      <rect
        className="arm left-arm"
        x="30"
        y="30"
        width="8"
        height="22"
        rx="4"
        fill={color}
      />
      <rect
        className="arm right-arm"
        x="62"
        y="30"
        width="8"
        height="22"
        rx="4"
        fill={color}
      />

      {/* Legs */}
      <rect
        className="leg left-leg"
        x="42"
        y="50"
        width="8"
        height="28"
        rx="4"
        fill={color}
      />
      <rect
        className="leg right-leg"
        x="50"
        y="50"
        width="8"
        height="28"
        rx="4"
        fill={color}
      />
    </svg>
  );
}
