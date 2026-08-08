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

// One petal path centred at origin — softly rounded, slightly notched at tip
const PETAL = "M0,-9 C2,-9 5.5,-6 5.5,-2.5 C5.5,1 3,4.5 0,5.5 C-3,4.5 -5.5,1 -5.5,-2.5 C-5.5,-6 -2,-9 0,-9 Z";

function Blossom({
  x, y, r = 1, opacity = 0.55, rotate = 0,
}: {
  x: number; y: number; r?: number; opacity?: number; rotate?: number;
}) {
  const angles = [0, 72, 144, 216, 288];
  const stamenAngles = [0, 40, 80, 120, 160, 200, 240, 280, 320];

  return (
    <g transform={`translate(${x},${y}) scale(${r}) rotate(${rotate})`} opacity={opacity}>
      {angles.map((a) => (
        <path key={a} d={PETAL} fill="var(--color-accent-pink)" transform={`rotate(${a})`} opacity="0.9" />
      ))}
      {stamenAngles.map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <line x1="0" y1="0" x2="0" y2="-6" stroke="var(--color-accent-pink)" strokeWidth="0.5" opacity="0.7" />
          <circle cx="0" cy="-6.5" r="0.8" fill="var(--color-accent-olive)" />
        </g>
      ))}
      <circle cx="0" cy="0" r="2.2" fill="var(--color-accent-pink)" opacity="0.8" />
    </g>
  );
}

// A tight cluster of blossoms at a given centre
function BlossomCluster({
  cx, cy, count = 6, spread = 14, baseScale = 1, baseOpacity = 0.52,
}: {
  cx: number; cy: number; count?: number; spread?: number;
  baseScale?: number; baseOpacity?: number;
}) {
  const positions = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const d = i === 0 ? 0 : spread * (0.5 + Math.random() * 0.5);
    return {
      x: cx + Math.cos(angle) * d,
      y: cy + Math.sin(angle) * d,
      r: baseScale * (0.7 + (i % 3) * 0.15),
      opacity: baseOpacity * (0.7 + Math.random() * 0.4),
      rotate: Math.floor(Math.random() * 36),
    };
  });

  return (
    <>
      {positions.map((p, i) => (
        <Blossom key={i} x={p.x} y={p.y} r={p.r} opacity={p.opacity} rotate={p.rotate} />
      ))}
    </>
  );
}

function CherryBranchSvg({ onClickCoords }: { onClickCoords: (px: number, py: number) => void }) {
  return (
    <svg
      viewBox="0 0 200 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      onClick={(e) => onClickCoords(e.clientX, e.clientY)}
    >
      {/* ── Branches ── */}
      {/* Main trunk rising from bottom */}
      <path d="M110 1000 C105 880, 95 800, 100 700 C105 600, 90 520, 95 400 C100 300, 80 220, 70 120 C60 60, 50 30, 45 0"
        stroke="var(--color-accent-olive)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />

      {/* Upper boughs — dense at top */}
      <path d="M68 100 C50 80, 20 55, 5 30"
        stroke="var(--color-accent-olive)" strokeWidth="1.8" strokeLinecap="round" opacity="0.38" />
      <path d="M65 130 C85 105, 115 85, 140 65"
        stroke="var(--color-accent-olive)" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
      <path d="M5 30 C-5 15, -8 5, -5 0"
        stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
      <path d="M22 48 C12 32, 8 20, 12 8"
        stroke="var(--color-accent-olive)" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
      <path d="M140 65 C155 48, 165 35, 168 18"
        stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
      <path d="M130 75 C148 60, 160 52, 175 42"
        stroke="var(--color-accent-olive)" strokeWidth="1" strokeLinecap="round" opacity="0.22" />

      {/* Mid branches */}
      <path d="M80 220 C55 205, 25 195, 5 180"
        stroke="var(--color-accent-olive)" strokeWidth="1.4" strokeLinecap="round" opacity="0.3" />
      <path d="M88 260 C110 240, 135 228, 155 215"
        stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
      <path d="M5 180 C-5 165, -8 155, -5 145"
        stroke="var(--color-accent-olive)" strokeWidth="0.9" strokeLinecap="round" opacity="0.22" />

      {/* Lower branches */}
      <path d="M93 400 C68 385, 40 375, 18 362"
        stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.26" />
      <path d="M97 440 C118 422, 142 410, 160 398"
        stroke="var(--color-accent-olive)" strokeWidth="1" strokeLinecap="round" opacity="0.24" />

      {/* ── Dense flower clusters at tips ── */}

      {/* Top crown — very dense */}
      <BlossomCluster cx={5}   cy={28}  count={8} spread={18} baseScale={1.1} baseOpacity={0.58} />
      <BlossomCluster cx={22}  cy={45}  count={6} spread={14} baseScale={0.95} baseOpacity={0.50} />
      <BlossomCluster cx={12}  cy={8}   count={5} spread={12} baseScale={0.85} baseOpacity={0.45} />
      <BlossomCluster cx={168} cy={16}  count={7} spread={16} baseScale={1.0}  baseOpacity={0.55} />
      <BlossomCluster cx={155} cy={38}  count={6} spread={14} baseScale={0.9}  baseOpacity={0.48} />
      <BlossomCluster cx={178} cy={42}  count={5} spread={12} baseScale={0.8}  baseOpacity={0.42} />
      <BlossomCluster cx={140} cy={62}  count={6} spread={13} baseScale={0.95} baseOpacity={0.50} />

      {/* Mid-upper */}
      <BlossomCluster cx={5}   cy={145} count={6} spread={15} baseScale={0.9}  baseOpacity={0.46} />
      <BlossomCluster cx={155} cy={212} count={5} spread={13} baseScale={0.85} baseOpacity={0.42} />
      <BlossomCluster cx={85}  cy={220} count={4} spread={10} baseScale={0.75} baseOpacity={0.38} />

      {/* Mid */}
      <BlossomCluster cx={18}  cy={360} count={5} spread={13} baseScale={0.85} baseOpacity={0.40} />
      <BlossomCluster cx={160} cy={396} count={5} spread={12} baseScale={0.80} baseOpacity={0.38} />

      {/* Scattered singles along main trunk */}
      <Blossom x={95}  y={400} r={0.7} opacity={0.28} rotate={15} />
      <Blossom x={98}  y={520} r={0.65} opacity={0.24} rotate={30} />
      <Blossom x={102} y={620} r={0.6}  opacity={0.20} rotate={5}  />
    </svg>
  );
}

export function LeafDecor() {
  const [petals, setPetals] = useState<FallingPetal[]>([]);

  const spawnPetals = useCallback((pageX: number, pageY: number) => {
    const count = 7 + Math.floor(Math.random() * 6);
    const newPetals: FallingPetal[] = Array.from({ length: count }, () => ({
      id: nextId++,
      x: pageX + (Math.random() - 0.5) * 24,
      y: pageY,
      drift: `${(Math.random() - 0.5) * 140}px`,
      spin: `${(Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 400)}deg`,
      duration: `${2 + Math.random() * 1.5}s`,
      delay: `${Math.random() * 0.5}s`,
      scale: 0.6 + Math.random() * 0.7,
    }));

    setPetals((prev) => [...prev, ...newPetals]);
    newPetals.forEach((p) => {
      const ms = (parseFloat(p.duration) + parseFloat(p.delay) + 0.15) * 1000;
      setTimeout(() => setPetals((prev) => prev.filter((x) => x.id !== p.id)), ms);
    });
  }, []);

  return (
    <>
      <div className="leaf-decor leaf-decor-left" aria-hidden>
        <CherryBranchSvg onClickCoords={spawnPetals} />
      </div>
      <div className="leaf-decor leaf-decor-right" aria-hidden>
        <div className="h-full w-full" style={{ transform: "scaleX(-1)" }}>
          <CherryBranchSvg onClickCoords={spawnPetals} />
        </div>
      </div>

      {petals.map((p) => (
        <svg
          key={p.id}
          width="22" height="22"
          viewBox="-11 -11 22 22"
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
          <path d={PETAL} fill="var(--color-accent-pink)" opacity="0.85" />
          <circle cx="0" cy="0" r="1.5" fill="var(--color-accent-pink)" opacity="0.6" />
        </svg>
      ))}
    </>
  );
}
