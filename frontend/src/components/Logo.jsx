// Logo — renders the actual PNG logo with fixed height and auto width
import React from "react";
import logoSrc from "../assets/logo.png"; // Ensure the image exists at src/assets/logo.png

export default function Logo({ height = 40, alt = "AI-Powered Article Analyzer Logo", className = "" }) {
  // Fixed height, auto width preserves the aspect ratio
  const style = { height: `${height}px`, width: "auto", display: "block" };
  return <img src={logoSrc} alt={alt} style={style} className={className} />;
}
