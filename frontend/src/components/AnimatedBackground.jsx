// AnimatedBackground — full-screen animated gradient made of drifting
// radial blobs using the Canvas API. Runs behind all content.
import React, { useEffect, useRef } from "react";
import "../index.css";
export default function AnimatedBackground({ blobCount = 8 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const blobsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const NAVY = "#0A0F1F";
    const COLORS = ["#1E90FF", "#00E5FF", "#6C63FF", "#3DDC97"]; // blue, cyan, purple, teal

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Initialize large, slow-moving color blobs
    function initBlobs() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const count = Math.max(5, Math.min(blobCount, 14));
      blobsRef.current = Array.from({ length: count }).map((_, i) => {
        // Larger radii ~400–800px while respecting smaller screens
        const desired = 400 + Math.random() * 400; // 400–800
        const maxAllowed = Math.min(Math.min(w, h) * 0.8, 900);
        const baseR = Math.min(desired, Math.max(260, maxAllowed));
        // Very slow/subtle motion
        const speed = 0.03 + Math.random() * 0.08;
        const angle = Math.random() * Math.PI * 2;
        const amp = 40 + Math.random() * 80;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: baseR,
          color: COLORS[i % COLORS.length],
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          t: Math.random() * 1000, // phase for subtle pulsation
          amp,
        };
      });
    }

    // Paint base background gradient (dark navy)
    function fillBase() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, NAVY);
      g.addColorStop(1, "#0b1b3a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    // Draw a single radial-gradient blob with soft edges
    function drawBlob(b) {
      // gentle pulse
      b.t += 0.005;
      const scale = 0.92 + Math.sin(b.t) * 0.06;
      const rad = b.r * scale;
      const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, rad);
      const rgba = (hex, a) => {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!m) return `rgba(255,255,255,${a})`;
        const r = parseInt(m[1], 16);
        const g = parseInt(m[2], 16);
        const bl = parseInt(m[3], 16);
        return `rgba(${r},${g},${bl},${a})`;
      };
      // Dimmer glow: reduce alpha; strong center but less bright
      grd.addColorStop(0, rgba(b.color, 0.38));
      grd.addColorStop(0.45, rgba(b.color, 0.12));
      grd.addColorStop(1, rgba(b.color, 0));
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(b.x, b.y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // Animation frame: move + draw blobs with light additive blending
    function step() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      fillBase();
      ctx.globalCompositeOperation = "lighter";
      for (const b of blobsRef.current) {
        b.x += b.vx;
        b.y += b.vy;
        // soft sinusoidal drift
        b.x += Math.sin(b.t) * 0.15;
        b.y += Math.cos(b.t * 0.8) * 0.15;
        // bounce
        const margin = 100;
        if (b.x < margin || b.x > w - margin) b.vx *= -1;
        if (b.y < margin || b.y > h - margin) b.vy *= -1;
        drawBlob(b);
      }
      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(step);
    }

    function onResize() {
      resize();
      initBlobs();
    }

    resize();
    initBlobs();
    rafRef.current = requestAnimationFrame(step);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [blobCount]);

  return <canvas ref={canvasRef} className="animated-bg-canvas" />;
}
