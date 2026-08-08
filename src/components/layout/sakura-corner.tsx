"use client";

import { useCallback, useState } from "react";

interface FallingPetal {
  id: number;
  x: number;
  y: number;
  drift: string;
  spin: string;
  duration: string;
  delay: string;
  scale: number;
}

let nextId = 0;

// Soft rounded petal — like a teardrop
const PETAL_D = "M0,-7 C2.5,-7 5,-4.5 5,-1.5 C5,2 3,5 0,6 C-3,5 -5,2 -5,-1.5 C-5,-4.5 -2.5,-7 0,-7 Z";

function Blossom({ x, y, s = 1, op = 0.5, rot = 0 }: { x: number; y: number; s?: number; op?: number; rot?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`} opacity={op}>
      {[0,72,144,216,288].map(a => (
        <path key={a} d={PETAL_D} fill="#e8a0b0" transform={`rotate(${a})`} />
      ))}
      {[0,60,120,180,240,300].map(a => (
        <g key={a} transform={`rotate(${a})`}>
          <line x1="0" y1="0" x2="0" y2="-4.5" stroke="#e8a0b0" strokeWidth="0.4" opacity="0.7" />
          <circle cx="0" cy="-5" r="0.65" fill="#8b7355" opacity="0.8" />
        </g>
      ))}
      <circle cx="0" cy="0" r="1.8" fill="#f0b8c4" opacity="0.8" />
    </g>
  );
}

// A loose watercolour-style cluster
const CLUSTERS: { cx: number; cy: number; blossoms: [number, number, number, number, number][] }[] = [
  // Branch tip 1 — top right of canvas
  { cx: 270, cy: 30, blossoms: [
    [0,0,1.1,0.55,0],[14,-12,0.95,0.48,25],[-10,-8,0.88,0.44,50],
    [22,6,0.80,0.40,72],[-4,15,0.85,0.42,18],[18,-20,0.75,0.36,90],
    [-16,5,0.90,0.46,36],[8,20,0.72,0.34,110],[26,-8,0.82,0.40,60],
    [-20,-14,0.78,0.38,135],[12,28,0.68,0.32,80],
  ]},
  // Mid branch cascade
  { cx: 210, cy: 90, blossoms: [
    [0,0,1.0,0.50,0],[12,-10,0.88,0.44,30],[-8,12,0.82,0.40,55],
    [20,4,0.76,0.36,75],[-14,-6,0.85,0.42,20],[6,18,0.78,0.38,95],
    [22,-14,0.72,0.34,115],[-18,8,0.80,0.40,45],
  ]},
  // Lower droop
  { cx: 150, cy: 160, blossoms: [
    [0,0,0.95,0.46,0],[10,-8,0.82,0.40,40],[-10,10,0.78,0.36,65],
    [18,2,0.72,0.34,80],[-6,16,0.80,0.38,25],[14,-16,0.68,0.32,100],
  ]},
  // Far left droop
  { cx: 80, cy: 200, blossoms: [
    [0,0,0.88,0.42,0],[8,-10,0.76,0.36,45],[-8,8,0.72,0.34,70],
    [14,4,0.68,0.30,88],[-4,14,0.74,0.35,20],
  ]},
  // Extra fill near top
  { cx: 300, cy: 70, blossoms: [
    [0,0,0.85,0.40,0],[10,-8,0.75,0.36,30],[-8,10,0.70,0.32,60],
    [16,2,0.65,0.30,85],[-6,14,0.72,0.34,15],
  ]},
];

// Single loose petals scattered between clusters
const SINGLES: [number,number,number,number,number][] = [
  [240,55,0.7,0.28,20],[180,120,0.65,0.25,55],[130,175,0.6,0.22,35],
  [260,110,0.6,0.24,70],[300,40,0.68,0.26,10],[195,150,0.62,0.23,80],
  [100,225,0.58,0.20,45],[310,90,0.55,0.18,25],
];

function SakuraSvg({ onHit }: { onHit: (e: React.MouseEvent, cx: number, cy: number) => void }) {
  return (
    <svg viewBox="0 0 340 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">

      {/* ── Branches from top-right corner drooping down-left ── */}
      {/* Main branch */}
      <path d="M340 0 C310 20, 270 35, 230 65 C195 90, 160 130, 120 175 C95 205, 65 230, 40 265"
        stroke="#9a8060" strokeWidth="2.8" strokeLinecap="round" opacity="0.38" />
      {/* Branch 2 — shorter fork */}
      <path d="M320 0 C295 15, 260 28, 230 50 C205 68, 185 90, 165 120"
        stroke="#9a8060" strokeWidth="2.0" strokeLinecap="round" opacity="0.32" />
      {/* Branch 3 — upper fork right */}
      <path d="M340 10 C325 25, 305 45, 290 68 C275 88, 265 105, 255 130"
        stroke="#9a8060" strokeWidth="1.6" strokeLinecap="round" opacity="0.28" />
      {/* Thin twig off main */}
      <path d="M270 55 C255 42, 238 30, 222 18"
        stroke="#9a8060" strokeWidth="1.1" strokeLinecap="round" opacity="0.25" />
      <path d="M200 105 C185 88, 175 70, 168 50"
        stroke="#9a8060" strokeWidth="0.9" strokeLinecap="round" opacity="0.22" />
      <path d="M150 150 C132 138, 118 122, 108 102"
        stroke="#9a8060" strokeWidth="0.8" strokeLinecap="round" opacity="0.20" />
      <path d="M100 190 C82 178, 68 162, 58 142"
        stroke="#9a8060" strokeWidth="0.7" strokeLinecap="round" opacity="0.18" />

      {/* ── Blossom clusters ── */}
      {CLUSTERS.map((cl, ci) => (
        <g key={ci}>
          {cl.blossoms.map(([dx, dy, s, op, rot], i) => (
            <Blossom key={i} x={cl.cx+dx} y={cl.cy+dy} s={s} op={op} rot={rot} />
          ))}
          {/* Hit area */}
          <circle cx={cl.cx} cy={cl.cy} r={36} fill="transparent"
            className="sakura-hit" onClick={(e) => onHit(e, cl.cx, cl.cy)} />
        </g>
      ))}

      {/* Scattered singles */}
      {SINGLES.map(([x, y, s, op, rot], i) => (
        <Blossom key={i} x={x} y={y} s={s} op={op} rot={rot} />
      ))}

      {/* A few drifting lone petals (non-interactive) */}
      <path d={PETAL_D} fill="#e8a0b0" opacity="0.22" transform="translate(170,200) rotate(35) scale(0.7)" />
      <path d={PETAL_D} fill="#e8a0b0" opacity="0.18" transform="translate(240,155) rotate(-20) scale(0.6)" />
      <path d={PETAL_D} fill="#e8a0b0" opacity="0.20" transform="translate(115,250) rotate(55) scale(0.65)" />
      <path d={PETAL_D} fill="#e8a0b0" opacity="0.16" transform="translate(290,135) rotate(-40) scale(0.55)" />
    </svg>
  );
}

export function SakuraCorner() {
  const [petals, setPetals] = useState<FallingPetal[]>([]);

  const onHit = useCallback((e: React.MouseEvent, svgX: number, svgY: number) => {
    const svg = (e.target as Element).closest("svg") as SVGSVGElement | null;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const pageX = rect.left + (svgX / 340) * rect.width;
    const pageY = rect.top  + (svgY / 420) * rect.height;

    const count = 3 + Math.floor(Math.random() * 4);
    const newPetals: FallingPetal[] = Array.from({ length: count }, (_, i) => ({
      id: nextId++,
      x: pageX + (Math.random() - 0.5) * 22,
      y: pageY + (Math.random() - 0.5) * 12,
      drift: `${(Math.random() - 0.5) * 80}px`,
      spin: `${(Math.random() > 0.5 ? 1 : -1) * (160 + Math.random() * 260)}deg`,
      duration: `${2.2 + Math.random() * 1.4}s`,
      delay: `${i * 0.08 + Math.random() * 0.2}s`,
      scale: 0.45 + Math.random() * 0.5,
    }));

    setPetals(prev => [...prev, ...newPetals]);
    newPetals.forEach(p => {
      const ms = (parseFloat(p.duration) + parseFloat(p.delay) + 0.1) * 1000;
      setTimeout(() => setPetals(prev => prev.filter(x => x.id !== p.id)), ms);
    });
  }, []);

  return (
    <>
      <div className="sakura-corner sakura-corner-left" aria-hidden>
        <SakuraSvg onHit={onHit} />
      </div>
      <div className="sakura-corner sakura-corner-right" aria-hidden>
        <SakuraSvg onHit={onHit} />
      </div>

      {petals.map(p => (
        <svg key={p.id} width="20" height="20" viewBox="-11 -11 22 22"
          style={{
            position: "fixed",
            left: p.x,
            top: p.y,
            pointerEvents: "none",
            zIndex: 9999,
            ["--petal-drift" as string]: p.drift,
            ["--petal-spin" as string]: p.spin,
            animation: `petal-fall ${p.duration} ${p.delay} ease-in forwards`,
            transformOrigin: "center",
            scale: String(p.scale),
          }}
        >
          <path d={PETAL_D} fill="#e8a0b0" opacity="0.82" />
          <circle cx="0" cy="0" r="1.3" fill="#f0b8c4" opacity="0.6" />
        </svg>
      ))}
    </>
  );
}
