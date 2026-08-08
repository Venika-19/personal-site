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

function BlossomCloud({ cx, cy, r = 28, op = 0.52 }: { cx: number; cy: number; r?: number; op?: number }) {
  const spots: [number, number, number][] = [
    [0, 0, 1.0], [-r*0.4, -r*0.3, 0.78], [r*0.4, -r*0.25, 0.82],
    [-r*0.2, r*0.38, 0.72], [r*0.35, r*0.30, 0.74], [-r*0.5, r*0.08, 0.68],
    [r*0.12, -r*0.48, 0.70], [r*0.52, r*0.12, 0.62], [-r*0.08, -r*0.52, 0.64],
    [r*0.25, -r*0.42, 0.60], [-r*0.38, r*0.35, 0.66],
  ];
  return (
    <g opacity={op} filter="url(#wc)">
      {spots.map(([dx, dy, sr], i) => (
        <circle key={i} cx={cx+dx} cy={cy+dy} r={r * sr * 0.58} fill="#f0a0b8" opacity={0.52 + (i%3)*0.1} />
      ))}
      <circle cx={cx} cy={cy} r={r*0.22} fill="#d4708a" opacity={0.18} />
    </g>
  );
}

function SakuraSvg({ onHit }: { onHit: (e: React.MouseEvent, cx: number, cy: number) => void }) {
  // viewBox: 280 wide × 900 tall. Trunk enters from left edge around y=500,
  // grows upward and branches spread inward (rightward) and upward.
  const clouds: [number, number, number, number][] = [
    // Upper canopy — branches spread right and up from ~y=280 upward
    [180, 80,  30, 0.50], [220, 55,  26, 0.46], [145, 60,  28, 0.48],
    [255, 90,  24, 0.42], [275, 55,  22, 0.40], [105, 95,  26, 0.46],
    [200, 120, 25, 0.44], [160, 130, 27, 0.46], [240, 130, 22, 0.40],
    [270, 110, 20, 0.38], [80,  130, 24, 0.42], [125, 155, 25, 0.44],
    [185, 168, 23, 0.40], [225, 165, 21, 0.38], [55,  165, 22, 0.40],
    // Mid section along trunk
    [100, 220, 24, 0.42], [145, 230, 22, 0.38], [55,  245, 20, 0.36],
    [175, 255, 20, 0.36], [30,  285, 18, 0.32],
    // Lower branch
    [80,  340, 22, 0.38], [120, 355, 20, 0.34], [40,  365, 18, 0.32],
    [155, 370, 18, 0.30],
  ];

  return (
    <svg viewBox="0 0 280 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <filter id="wc" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="4" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" result="warped" />
          <feGaussianBlur in="warped" stdDeviation="2.2" />
        </filter>
        <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* ── Trunk: enters from left edge ~y=520, grows upward curving right ── */}
      <path d="M0 520 C18 480, 30 420, 45 350 C58 285, 68 220, 82 155 C92 105, 105 65, 118 30"
        stroke="#7a6248" strokeWidth="3.2" strokeLinecap="round" opacity="0.48" />

      {/* Main upward bough — sweeps right */}
      <path d="M60 310 C95 270, 140 220, 185 170 C220 130, 255 95, 275 60"
        stroke="#7a6248" strokeWidth="2.2" strokeLinecap="round" opacity="0.40" />
      {/* Second bough — also right but lower angle */}
      <path d="M72 260 C108 230, 152 200, 192 168 C225 142, 255 118, 272 92"
        stroke="#7a6248" strokeWidth="1.8" strokeLinecap="round" opacity="0.36" />
      {/* Left bough — goes up-left, shorter */}
      <path d="M88 200 C72 168, 52 138, 28 108 C14 88, 2 68, -5 48"
        stroke="#7a6248" strokeWidth="1.6" strokeLinecap="round" opacity="0.34" />
      {/* Upper twig off main trunk */}
      <path d="M100 140 C125 108, 155 80, 175 52"
        stroke="#7a6248" strokeWidth="1.2" strokeLinecap="round" opacity="0.30" />
      <path d="M110 105 C88 85, 65 65, 45 40"
        stroke="#7a6248" strokeWidth="1.0" strokeLinecap="round" opacity="0.28" />
      {/* Thin twigs */}
      <path d="M145 192 C162 170, 178 148, 190 122"
        stroke="#7a6248" strokeWidth="0.9" strokeLinecap="round" opacity="0.26" />
      <path d="M115 225 C100 205, 82 185, 62 165"
        stroke="#7a6248" strokeWidth="0.8" strokeLinecap="round" opacity="0.24" />
      {/* Lower branch off trunk */}
      <path d="M38 380 C65 358, 98 340, 130 320"
        stroke="#7a6248" strokeWidth="1.4" strokeLinecap="round" opacity="0.32" />
      <path d="M28 420 C8 400, -8 380, -12 358"
        stroke="#7a6248" strokeWidth="1.0" strokeLinecap="round" opacity="0.26" />

      {/* ── Ambient glow beneath clusters ── */}
      {clouds.map(([cx, cy, r, op], i) => (
        <circle key={`g${i}`} cx={cx} cy={cy} r={r*1.6} fill="#f8c0d0" opacity={op*0.15} filter="url(#glow)" />
      ))}

      {/* ── Watercolor blossom clouds ── */}
      {clouds.map(([cx, cy, r, op], i) => (
        <BlossomCloud key={i} cx={cx} cy={cy} r={r} op={op} />
      ))}

      {/* ── Hit areas ── */}
      {clouds.map(([cx, cy], i) => (
        <circle key={`h${i}`} cx={cx} cy={cy} r={40} fill="transparent"
          className="sakura-hit" onClick={(e) => onHit(e, cx, cy)} />
      ))}

      {/* Drifting loose petals */}
      {([
        [155,145,11,0.22],[70,175,10,0.20],[210,195,9,0.18],
        [45,310,10,0.20],[130,290,9,0.18],[168,320,8,0.16],
      ] as [number,number,number,number][]).map(([x,y,r,op],i) => (
        <circle key={`lp${i}`} cx={x} cy={y} r={r} fill="#f0a0b8" opacity={op} filter="url(#wc)" />
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
    const pageX = rect.left + (svgX / 280) * rect.width;
    const pageY = rect.top  + (svgY / 900) * rect.height;

    const count = 4 + Math.floor(Math.random() * 4);
    const newPetals: FallingPetal[] = Array.from({ length: count }, (_, i) => ({
      id: nextId++,
      x: pageX + (Math.random() - 0.5) * 22,
      y: pageY + (Math.random() - 0.5) * 12,
      drift: `${(Math.random() - 0.5) * 85}px`,
      spin: `${(Math.random() > 0.5 ? 1 : -1) * (140 + Math.random() * 260)}deg`,
      duration: `${2.2 + Math.random() * 1.6}s`,
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
        <svg key={p.id} width="18" height="18" viewBox="-9 -9 18 18"
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
          <ellipse cx="0" cy="0" rx="5" ry="7" fill="#f0a0b8" opacity="0.80" />
          <ellipse cx="0" cy="0" rx="2" ry="3" fill="#f8c8d8" opacity="0.55" />
        </svg>
      ))}
    </>
  );
}
