"use client";

import { useCallback, useState } from "react";

interface FallingPetal {
  id: number; x: number; y: number;
  drift: string; spin: string;
  duration: string; delay: string; scale: number;
}

let nextId = 0;

// 5-petal blossom
function Blossom({ x, y, s = 1, op = 0.55, rot = 0 }: {
  x: number; y: number; s?: number; op?: number; rot?: number;
}) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={op}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={0} cy={-7} rx={3.8} ry={6.2}
          fill="#f2a8bc" transform={`rotate(${a})`} opacity="0.88" />
      ))}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a}>
          <line
            x1="0" y1="0"
            x2={+(Math.sin(a * Math.PI / 180) * 5).toFixed(2)}
            y2={-(Math.cos(a * Math.PI / 180) * 5).toFixed(2)}
            stroke="#e8a0b0" strokeWidth="0.5" opacity="0.60"
          />
          <circle
            cx={+(Math.sin(a * Math.PI / 180) * 5.5).toFixed(2)}
            cy={-(Math.cos(a * Math.PI / 180) * 5.5).toFixed(2)}
            r="0.9" fill="#7a6248" opacity="0.75"
          />
        </g>
      ))}
      <circle cx="0" cy="0" r="2" fill="#fbd8e4" opacity="0.90" />
    </g>
  );
}

const NODES: { cx: number; cy: number; s: number; op: number }[] = [
  // Crown
  { cx: 195, cy: 28,  s: 1.05, op: 0.58 },
  { cx: 242, cy: 15,  s: 0.90, op: 0.52 },
  { cx: 158, cy: 20,  s: 0.95, op: 0.54 },
  { cx: 268, cy: 44,  s: 0.82, op: 0.46 },
  { cx: 218, cy: 58,  s: 0.88, op: 0.50 },
  { cx: 130, cy: 50,  s: 0.85, op: 0.48 },
  { cx: 178, cy: 78,  s: 0.92, op: 0.52 },
  { cx: 252, cy: 82,  s: 0.80, op: 0.44 },
  { cx: 100, cy: 78,  s: 0.82, op: 0.46 },
  { cx: 150, cy: 98,  s: 0.88, op: 0.50 },
  { cx: 215, cy: 105, s: 0.78, op: 0.42 },
  { cx: 70,  cy: 102, s: 0.80, op: 0.44 },
  { cx: 122, cy: 128, s: 0.85, op: 0.48 },
  { cx: 178, cy: 136, s: 0.76, op: 0.40 },
  // Mid
  { cx: 44,  cy: 145, s: 0.78, op: 0.42 },
  { cx: 94,  cy: 162, s: 0.82, op: 0.44 },
  { cx: 148, cy: 170, s: 0.74, op: 0.38 },
  { cx: 22,  cy: 182, s: 0.72, op: 0.38 },
  { cx: 65,  cy: 208, s: 0.78, op: 0.40 },
  { cx: 120, cy: 216, s: 0.70, op: 0.36 },
  // Lower
  { cx: 34,  cy: 278, s: 0.75, op: 0.40 },
  { cx: 85,  cy: 292, s: 0.70, op: 0.36 },
  { cx: 132, cy: 305, s: 0.68, op: 0.34 },
  { cx: 16,  cy: 328, s: 0.68, op: 0.36 },
  { cx: 70,  cy: 352, s: 0.72, op: 0.38 },
];

// Each node gets a small deterministic cluster of blossoms around it
const OFFSETS = [
  [0, 0, 1.0, 0], [12, -9, 0.82, 22], [-11, -7, 0.85, -18],
  [15, 7, 0.76, 40], [-8, 13, 0.80, -32], [9, -16, 0.72, 55],
];

function SakuraSvg({ onHit }: { onHit: (e: React.MouseEvent, cx: number, cy: number) => void }) {
  return (
    <svg viewBox="-25 0 305 900" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full" style={{ overflow: "visible" }}>

      <defs>
        {/* Makes stroke edges slightly softer / organic */}
        <filter id="taper" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="2" seed="8" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* ── TRUNK — thick at base, tapers up ── */}
      {/* Drawn as 3 overlapping strokes of decreasing width = tapered look */}
      <path d="M0 560 C14 500, 26 435, 40 365 C52 298, 64 228, 78 162 C88 112, 100 68, 110 28"
        stroke="#7a5c3a" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.28" filter="url(#taper)" />
      <path d="M0 560 C14 500, 26 435, 40 365 C52 298, 64 228, 78 162 C88 112, 100 68, 110 28"
        stroke="#7a5c3a" strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.38" filter="url(#taper)" />
      <path d="M0 560 C14 500, 26 435, 40 365 C52 298, 64 228, 78 162 C88 112, 100 68, 110 28"
        stroke="#6a4e2e" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.48" filter="url(#taper)" />

      {/* ── BOUGHS — same layered taper technique ── */}
      {[
        // [path, baseW, midW, topW, opacity]
        ["M55 328 C88 285, 132 238, 178 190 C212 152, 250 112, 270 76", 7, 4, 1.8, 0.46],
        ["M65 275 C100 248, 146 218, 186 186 C220 158, 252 130, 270 102", 6, 3.5, 1.5, 0.42],
        ["M80 215 C64 182, 44 150, 22 120 C8 100, -4 78, -10 54", 5.5, 3.2, 1.4, 0.40],
        ["M95 158 C98 122, 102 84, 108 44", 4.5, 2.8, 1.2, 0.36],
      ].map(([p, w0, w1, w2, op], i) => (
        <g key={i}>
          <path d={p as string} stroke="#7a5c3a" strokeWidth={w0 as number} strokeLinecap="round" fill="none" opacity={(op as number) * 0.55} filter="url(#taper)" />
          <path d={p as string} stroke="#7a5c3a" strokeWidth={w1 as number} strokeLinecap="round" fill="none" opacity={(op as number) * 0.75} filter="url(#taper)" />
          <path d={p as string} stroke="#6a4e2e" strokeWidth={w2 as number} strokeLinecap="round" fill="none" opacity={op as number} filter="url(#taper)" />
        </g>
      ))}

      {/* ── TWIGS — single tapered stroke, thin ── */}
      {[
        ["M120 252 C140 222, 158 194, 170 164", 2.8, 0.32],
        ["M142 202 C160 178, 178 155, 195 130", 2.4, 0.30],
        ["M108 170 C88 150, 66 130, 48 110", 2.2, 0.30],
        ["M92 134 C72 114, 50 94, 32 74", 2.0, 0.28],
        ["M105 104 C120 82, 138 64, 152 44", 2.0, 0.28],
        ["M112 76 C95 60, 76 44, 60 28", 1.8, 0.26],
        ["M40 382 C66 360, 96 342, 126 324", 2.8, 0.34],
        ["M28 425 C10 405, -6 385, -12 362", 2.2, 0.28],
        ["M35 458 C57 440, 80 424, 106 410", 2.2, 0.28],
        ["M48 488 C28 470, 10 452, -5 432", 1.8, 0.24],
      ].map(([p, w, op], i) => (
        <g key={i}>
          <path d={p as string} stroke="#7a5c3a" strokeWidth={(w as number) * 1.8} strokeLinecap="round" fill="none" opacity={(op as number) * 0.45} filter="url(#taper)" />
          <path d={p as string} stroke="#6a4e2e" strokeWidth={w as number} strokeLinecap="round" fill="none" opacity={op as number} filter="url(#taper)" />
        </g>
      ))}

      {/* ── BLOSSOMS ── */}
      {NODES.map(({ cx, cy, s, op }, ni) => (
        <g key={ni}>
          {OFFSETS.map(([dx, dy, sr, rot], bi) => (
            <Blossom key={bi} x={cx + dx} y={cy + dy}
              s={s * (sr as number)} op={op * (0.85 + bi * 0.05)} rot={rot as number} />
          ))}
          <circle cx={cx} cy={cy} r={32} fill="transparent"
            className="sakura-hit" onClick={(e) => onHit(e, cx, cy)} />
        </g>
      ))}
    </svg>
  );
}

export function SakuraCorner() {
  const [petals, setPetals] = useState<FallingPetal[]>([]);

  const onHit = useCallback((e: React.MouseEvent, svgX: number, svgY: number) => {
    const svg = (e.target as Element).closest("svg") as SVGSVGElement | null;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const pageX = rect.left + ((svgX + 25) / 305) * rect.width;
    const pageY = rect.top  + (svgY / 900) * rect.height;

    const count = 4 + Math.floor(Math.random() * 4);
    const newPetals: FallingPetal[] = Array.from({ length: count }, (_, i) => ({
      id: nextId++,
      x: pageX + (Math.random() - 0.5) * 20,
      y: pageY + (Math.random() - 0.5) * 10,
      drift: `${(Math.random() - 0.5) * 85}px`,
      spin: `${(Math.random() > 0.5 ? 1 : -1) * (140 + Math.random() * 260)}deg`,
      duration: `${2.2 + Math.random() * 1.4}s`,
      delay: `${i * 0.07 + Math.random() * 0.18}s`,
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
        <svg key={p.id} width="20" height="20" viewBox="-10 -10 20 20"
          style={{
            position: "fixed",
            left: p.x, top: p.y,
            pointerEvents: "none",
            zIndex: 9999,
            ["--petal-drift" as string]: p.drift,
            ["--petal-spin" as string]: p.spin,
            animation: `petal-fall ${p.duration} ${p.delay} ease-in forwards`,
            transformOrigin: "center",
            scale: String(p.scale),
          }}
        >
          <ellipse cx="0" cy="-5" rx="3.5" ry="5.5" fill="#f2a8bc" opacity="0.85" />
          <circle cx="0" cy="0" r="1.5" fill="#fbd8e4" opacity="0.70" />
        </svg>
      ))}
    </>
  );
}
