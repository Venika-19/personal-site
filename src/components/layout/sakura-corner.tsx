"use client";

import { useCallback, useState } from "react";

interface FallingPetal {
  id: number; x: number; y: number;
  drift: string; spin: string;
  duration: string; delay: string; scale: number;
}

let nextId = 0;

// 6-petal blossom
function Blossom({ x, y, s = 1, op = 0.55, rot = 0 }: {
  x: number; y: number; s?: number; op?: number; rot?: number;
}) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={op}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx={0} cy={-7} rx={3.4} ry={6.0}
          fill="#f2a8bc" transform={`rotate(${a})`} opacity="0.88" />
      ))}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a}>
          <line
            x1="0" y1="0"
            x2={+(Math.sin(a * Math.PI / 180) * 5).toFixed(2)}
            y2={-(Math.cos(a * Math.PI / 180) * 5).toFixed(2)}
            stroke="#e8a0b0" strokeWidth="0.5" opacity="0.55"
          />
          <circle
            cx={+(Math.sin(a * Math.PI / 180) * 5.6).toFixed(2)}
            cy={-(Math.cos(a * Math.PI / 180) * 5.6).toFixed(2)}
            r="0.85" fill="#7a6248" opacity="0.72"
          />
        </g>
      ))}
      <circle cx="0" cy="0" r="2" fill="#fbd8e4" opacity="0.90" />
    </g>
  );
}

// Cluster shapes: each entry is [dx, dy, scale_ratio, rotation]
const CLUSTER_TIGHT = [
  [0, 0, 1.0, 0], [8, -7, 0.86, 18], [-9, -5, 0.88, -22],
  [11, 5, 0.78, 38], [-6, 9, 0.82, -30],
];
const CLUSTER_SPREAD = [
  [0, 0, 0.94, 0], [18, -12, 0.72, 25], [-16, -10, 0.76, -20],
  [20, 8, 0.68, 45], [-10, 16, 0.74, -40], [12, -20, 0.66, 60],
];
const CLUSTER_LOOSE = [
  [0, 0, 0.88, 0], [14, -10, 0.74, 30], [-12, -8, 0.76, -25],
];
const CLUSTER_SINGLE = [
  [0, 0, 0.80, 0], [7, -5, 0.68, 20],
];

// Left tree nodes — dense crown, tapering down
const NODES_LEFT: { cx: number; cy: number; s: number; op: number; cluster: number[][] }[] = [
  // Crown — tight clusters
  { cx: 200, cy: 22,  s: 1.05, op: 0.58, cluster: CLUSTER_TIGHT },
  { cx: 248, cy: 10,  s: 0.92, op: 0.52, cluster: CLUSTER_TIGHT },
  { cx: 162, cy: 16,  s: 0.96, op: 0.54, cluster: CLUSTER_TIGHT },
  { cx: 272, cy: 38,  s: 0.84, op: 0.46, cluster: CLUSTER_LOOSE },
  { cx: 224, cy: 52,  s: 0.90, op: 0.50, cluster: CLUSTER_TIGHT },
  { cx: 132, cy: 44,  s: 0.86, op: 0.48, cluster: CLUSTER_LOOSE },
  // Upper mid — spread
  { cx: 184, cy: 74,  s: 0.88, op: 0.50, cluster: CLUSTER_SPREAD },
  { cx: 256, cy: 76,  s: 0.80, op: 0.44, cluster: CLUSTER_LOOSE },
  { cx: 104, cy: 72,  s: 0.82, op: 0.46, cluster: CLUSTER_SPREAD },
  { cx: 154, cy: 94,  s: 0.86, op: 0.48, cluster: CLUSTER_TIGHT },
  { cx: 72,  cy: 98,  s: 0.80, op: 0.44, cluster: CLUSTER_LOOSE },
  { cx: 218, cy: 100, s: 0.78, op: 0.42, cluster: CLUSTER_LOOSE },
  // Mid — sparse spread
  { cx: 126, cy: 124, s: 0.82, op: 0.46, cluster: CLUSTER_SPREAD },
  { cx: 182, cy: 132, s: 0.76, op: 0.40, cluster: CLUSTER_LOOSE },
  { cx: 48,  cy: 140, s: 0.78, op: 0.42, cluster: CLUSTER_SPREAD },
  { cx: 96,  cy: 158, s: 0.80, op: 0.44, cluster: CLUSTER_LOOSE },
  { cx: 152, cy: 166, s: 0.72, op: 0.38, cluster: CLUSTER_SINGLE },
  { cx: 24,  cy: 178, s: 0.70, op: 0.38, cluster: CLUSTER_LOOSE },
  { cx: 68,  cy: 204, s: 0.76, op: 0.40, cluster: CLUSTER_SINGLE },
  { cx: 124, cy: 212, s: 0.70, op: 0.36, cluster: CLUSTER_SINGLE },
  // Lower — single blossoms
  { cx: 36,  cy: 272, s: 0.74, op: 0.40, cluster: CLUSTER_SINGLE },
  { cx: 88,  cy: 288, s: 0.70, op: 0.36, cluster: CLUSTER_SINGLE },
  { cx: 18,  cy: 324, s: 0.68, op: 0.36, cluster: CLUSTER_SINGLE },
  { cx: 72,  cy: 346, s: 0.70, op: 0.38, cluster: CLUSTER_SINGLE },
];

// Right tree nodes — fewer at crown, heavier in mid, different twig directions
const NODES_RIGHT: { cx: number; cy: number; s: number; op: number; cluster: number[][] }[] = [
  // Crown — sparser, looser
  { cx: 210, cy: 18,  s: 0.96, op: 0.54, cluster: CLUSTER_LOOSE },
  { cx: 255, cy: 8,   s: 0.88, op: 0.50, cluster: CLUSTER_TIGHT },
  { cx: 170, cy: 26,  s: 0.90, op: 0.52, cluster: CLUSTER_LOOSE },
  { cx: 278, cy: 48,  s: 0.80, op: 0.44, cluster: CLUSTER_SINGLE },
  { cx: 138, cy: 40,  s: 0.84, op: 0.48, cluster: CLUSTER_SPREAD },
  // Upper mid — heavier clustering here
  { cx: 230, cy: 62,  s: 0.92, op: 0.52, cluster: CLUSTER_TIGHT },
  { cx: 188, cy: 68,  s: 0.94, op: 0.54, cluster: CLUSTER_TIGHT },
  { cx: 110, cy: 80,  s: 0.86, op: 0.48, cluster: CLUSTER_TIGHT },
  { cx: 262, cy: 84,  s: 0.78, op: 0.42, cluster: CLUSTER_SPREAD },
  { cx: 158, cy: 100, s: 0.88, op: 0.50, cluster: CLUSTER_SPREAD },
  { cx: 78,  cy: 106, s: 0.82, op: 0.46, cluster: CLUSTER_TIGHT },
  { cx: 222, cy: 118, s: 0.80, op: 0.44, cluster: CLUSTER_SPREAD },
  // Mid — mixed
  { cx: 130, cy: 138, s: 0.78, op: 0.42, cluster: CLUSTER_TIGHT },
  { cx: 56,  cy: 152, s: 0.80, op: 0.44, cluster: CLUSTER_SPREAD },
  { cx: 186, cy: 148, s: 0.72, op: 0.38, cluster: CLUSTER_LOOSE },
  { cx: 100, cy: 172, s: 0.76, op: 0.40, cluster: CLUSTER_SPREAD },
  { cx: 30,  cy: 190, s: 0.70, op: 0.38, cluster: CLUSTER_LOOSE },
  { cx: 156, cy: 188, s: 0.70, op: 0.36, cluster: CLUSTER_SINGLE },
  { cx: 74,  cy: 220, s: 0.72, op: 0.38, cluster: CLUSTER_SPREAD },
  { cx: 128, cy: 234, s: 0.68, op: 0.34, cluster: CLUSTER_SINGLE },
  // Lower
  { cx: 42,  cy: 285, s: 0.72, op: 0.40, cluster: CLUSTER_LOOSE },
  { cx: 100, cy: 300, s: 0.68, op: 0.36, cluster: CLUSTER_SINGLE },
  { cx: 22,  cy: 340, s: 0.66, op: 0.36, cluster: CLUSTER_SINGLE },
  { cx: 78,  cy: 360, s: 0.70, op: 0.38, cluster: CLUSTER_SINGLE },
];

function TrunkLeft() {
  const d = "M0 560 C14 500, 26 435, 40 365 C52 298, 64 228, 78 162 C88 112, 100 68, 110 28";
  return (
    <g>
      <path d={d} stroke="#7a5c3a" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.28" filter="url(#bark)" />
      <path d={d} stroke="#7a5c3a" strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.38" filter="url(#bark)" />
      <path d={d} stroke="#6a4e2e" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.48" filter="url(#bark)" />
    </g>
  );
}

function TrunkRight() {
  // Different curve — more upright at base, leaning out more at top
  const d = "M0 560 C8 492, 18 422, 32 352 C46 282, 60 210, 76 148 C90 98, 108 56, 122 18";
  return (
    <g>
      <path d={d} stroke="#7a5c3a" strokeWidth="8.5" strokeLinecap="round" fill="none" opacity="0.28" filter="url(#bark)" />
      <path d={d} stroke="#7a5c3a" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.38" filter="url(#bark)" />
      <path d={d} stroke="#6a4e2e" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.48" filter="url(#bark)" />
    </g>
  );
}

function BoughsLeft() {
  const boughs: [string, number, number, number, number][] = [
    ["M55 328 C88 285, 132 238, 178 190 C212 152, 250 112, 270 76", 7, 4, 1.8, 0.46],
    ["M65 275 C100 248, 146 218, 186 186 C220 158, 252 130, 270 102", 6, 3.5, 1.5, 0.42],
    ["M80 215 C64 182, 44 150, 22 120 C8 100, -4 78, -10 54", 5.5, 3.2, 1.4, 0.40],
    ["M95 158 C98 122, 102 84, 108 44", 4.5, 2.8, 1.2, 0.36],
  ];
  return (
    <g>
      {boughs.map(([p, w0, w1, w2, op], i) => (
        <g key={i}>
          <path d={p} stroke="#7a5c3a" strokeWidth={w0} strokeLinecap="round" fill="none" opacity={op * 0.55} filter="url(#bark)" />
          <path d={p} stroke="#7a5c3a" strokeWidth={w1} strokeLinecap="round" fill="none" opacity={op * 0.75} filter="url(#bark)" />
          <path d={p} stroke="#6a4e2e" strokeWidth={w2} strokeLinecap="round" fill="none" opacity={op} filter="url(#bark)" />
        </g>
      ))}
    </g>
  );
}

function BoughsRight() {
  // Different spread — more vertical boughs, one sweeping low
  const boughs: [string, number, number, number, number][] = [
    ["M48 338 C72 295, 108 252, 148 208 C182 170, 224 130, 258 88", 7, 4, 1.8, 0.46],
    ["M60 268 C78 228, 96 184, 112 144 C124 112, 136 78, 144 44", 6, 3.5, 1.5, 0.42],
    ["M72 210 C52 176, 32 142, 14 108 C2 84, -6 62, -14 38", 5.5, 3.2, 1.4, 0.40],
    ["M88 168 C112 148, 142 124, 168 98 C188 78, 208 56, 220 32", 5, 3, 1.3, 0.38],
  ];
  return (
    <g>
      {boughs.map(([p, w0, w1, w2, op], i) => (
        <g key={i}>
          <path d={p} stroke="#7a5c3a" strokeWidth={w0} strokeLinecap="round" fill="none" opacity={op * 0.55} filter="url(#bark)" />
          <path d={p} stroke="#7a5c3a" strokeWidth={w1} strokeLinecap="round" fill="none" opacity={op * 0.75} filter="url(#bark)" />
          <path d={p} stroke="#6a4e2e" strokeWidth={w2} strokeLinecap="round" fill="none" opacity={op} filter="url(#bark)" />
        </g>
      ))}
    </g>
  );
}

function TwigsLeft() {
  const twigs: [string, number, number][] = [
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
  ];
  return (
    <g>
      {twigs.map(([p, w, op], i) => (
        <g key={i}>
          <path d={p} stroke="#7a5c3a" strokeWidth={w * 1.8} strokeLinecap="round" fill="none" opacity={op * 0.45} filter="url(#bark)" />
          <path d={p} stroke="#6a4e2e" strokeWidth={w} strokeLinecap="round" fill="none" opacity={op} filter="url(#bark)" />
        </g>
      ))}
    </g>
  );
}

function TwigsRight() {
  // Twigs angled more vertically and a couple going outward
  const twigs: [string, number, number][] = [
    ["M110 248 C124 216, 140 186, 152 158", 2.8, 0.32],
    ["M136 196 C148 166, 160 138, 170 110", 2.4, 0.30],
    ["M100 162 C80 138, 58 116, 40 94", 2.2, 0.30],
    ["M86 128 C64 106, 44 86, 26 66", 2.0, 0.28],
    ["M100 96 C116 74, 134 56, 148 36", 2.0, 0.28],
    ["M118 68 C100 52, 80 36, 64 20", 1.8, 0.26],
    ["M44 376 C70 358, 100 340, 132 322", 2.8, 0.34],
    ["M30 420 C14 400, -2 380, -10 358", 2.2, 0.28],
    ["M38 454 C60 436, 84 420, 110 406", 2.2, 0.28],
    ["M52 484 C32 466, 12 448, -4 428", 1.8, 0.24],
    // Extra outward twig unique to right side
    ["M168 92 C192 78, 218 62, 240 46", 1.6, 0.24],
  ];
  return (
    <g>
      {twigs.map(([p, w, op], i) => (
        <g key={i}>
          <path d={p} stroke="#7a5c3a" strokeWidth={w * 1.8} strokeLinecap="round" fill="none" opacity={op * 0.45} filter="url(#bark)" />
          <path d={p} stroke="#6a4e2e" strokeWidth={w} strokeLinecap="round" fill="none" opacity={op} filter="url(#bark)" />
        </g>
      ))}
    </g>
  );
}

function SakuraSvg({
  side,
  onHit,
}: {
  side: "left" | "right";
  onHit: (e: React.MouseEvent, cx: number, cy: number) => void;
}) {
  const nodes = side === "left" ? NODES_LEFT : NODES_RIGHT;
  const filterId = side === "left" ? "bark-l" : "bark-r";

  return (
    <svg viewBox="-25 0 305 900" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full" style={{ overflow: "visible" }}>
      <defs>
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="2" seed={side === "left" ? 8 : 14} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {side === "left" ? <TrunkLeft /> : <TrunkRight />}
      {side === "left" ? <BoughsLeft /> : <BoughsRight />}
      {side === "left" ? <TwigsLeft /> : <TwigsRight />}

      {nodes.map(({ cx, cy, s, op, cluster }, ni) => (
        <g key={ni}>
          {cluster.map(([dx, dy, sr, rot], bi) => (
            <Blossom key={bi} x={cx + (dx as number)} y={cy + (dy as number)}
              s={s * (sr as number)} op={op * (0.85 + bi * 0.04)} rot={rot as number} />
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
        <SakuraSvg side="left" onHit={onHit} />
      </div>
      <div className="sakura-corner sakura-corner-right" aria-hidden>
        <SakuraSvg side="right" onHit={onHit} />
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
          <ellipse cx="0" cy="-5" rx="3.2" ry="5.2" fill="#f2a8bc" opacity="0.85" />
          <circle cx="0" cy="0" r="1.5" fill="#fbd8e4" opacity="0.70" />
        </svg>
      ))}
    </>
  );
}
