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

const PETAL = "M0,-8 C2,-8 5,-5.5 5,-2 C5,1.5 3,4 0,5 C-3,4 -5,1.5 -5,-2 C-5,-5.5 -2,-8 0,-8 Z";

function Blossom({ x, y, r = 1, opacity = 0.45, rotate = 0 }: {
  x: number; y: number; r?: number; opacity?: number; rotate?: number;
}) {
  return (
    <g transform={`translate(${x},${y}) scale(${r}) rotate(${rotate})`} opacity={opacity}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d={PETAL} fill="var(--color-accent-pink)" transform={`rotate(${a})`} opacity="0.88" />
      ))}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <line x1="0" y1="0" x2="0" y2="-5" stroke="var(--color-accent-pink)" strokeWidth="0.4" opacity="0.6" />
          <circle cx="0" cy="-5.5" r="0.7" fill="var(--color-accent-olive)" opacity="0.9" />
        </g>
      ))}
      <circle cx="0" cy="0" r="1.8" fill="var(--color-accent-pink)" opacity="0.7" />
    </g>
  );
}

// Converts SVG viewBox coords → screen page coords
function svgCoordsToScreen(svgX: number, svgY: number, svgEl: SVGSVGElement): { x: number; y: number } {
  const rect = svgEl.getBoundingClientRect();
  return {
    x: rect.left + (svgX / 200) * rect.width,
    y: rect.top  + (svgY / 1000) * rect.height,
  };
}

function BlossomCloud({ cx, cy, onHit }: {
  cx: number; cy: number;
  onHit: (e: React.MouseEvent, svgX: number, svgY: number) => void;
}) {
  // Deterministic spread so it renders the same on server + client
  const offsets = [
    [0,0,1.0,0.48,0], [-12,-8,0.85,0.40,18], [10,-12,0.90,0.42,36],
    [18,5,0.78,0.36,54], [-8,14,0.82,0.38,72], [6,-20,0.72,0.32,90],
    [-18,4,0.88,0.44,108], [14,-6,0.80,0.38,126], [-4,18,0.76,0.34,144],
    [20,-14,0.84,0.42,162], [-14,10,0.70,0.30,180], [8,22,0.78,0.36,198],
  ];
  return (
    <g>
      {offsets.map(([dx, dy, r, op, rot], i) => (
        <Blossom key={i} x={cx+dx} y={cy+dy} r={r} opacity={op} rotate={rot} />
      ))}
      {/* Large invisible hit circle */}
      <circle cx={cx} cy={cy} r={32} fill="transparent" className="blossom-hit"
        onClick={(e) => onHit(e, cx, cy)} />
    </g>
  );
}

function CherryTree({ onHit }: {
  onHit: (e: React.MouseEvent, svgX: number, svgY: number) => void;
}) {
  return (
    <svg viewBox="0 0 200 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">

      {/* ── Trunk: grows from bottom-left, leans inward (right) toward content ── */}
      <path d="M30 1000 C33 850, 36 720, 40 580 C44 440, 48 320, 52 200 C55 130, 58 70, 60 0"
        stroke="var(--color-accent-olive)" strokeWidth="3" strokeLinecap="round" opacity="0.45" />

      {/* ── Major boughs fanning up and inward (rightward) ── */}
      {/* Bough 1: sweeps far right toward content area — the main canopy arm */}
      <path d="M52 200 C80 170, 120 130, 170 80 C200 55, 230 30, 250 10"
        stroke="var(--color-accent-olive)" strokeWidth="2" strokeLinecap="round" opacity="0.38" />
      {/* Bough 2: mid-right */}
      <path d="M55 160 C85 130, 130 100, 185 60 C210 42, 235 25, 255 8"
        stroke="var(--color-accent-olive)" strokeWidth="1.6" strokeLinecap="round" opacity="0.34" />
      {/* Bough 3: upper left — goes up and slightly left */}
      <path d="M57 130 C45 95, 30 60, 15 20 C8 5, 2 -5, -5 -10"
        stroke="var(--color-accent-olive)" strokeWidth="1.4" strokeLinecap="round" opacity="0.32" />
      {/* Bough 4: straight up top */}
      <path d="M58 100 C60 70, 62 40, 62 0"
        stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.30" />

      {/* Sub-boughs off bough 1 */}
      <path d="M100 145 C115 115, 130 90, 150 65"
        stroke="var(--color-accent-olive)" strokeWidth="1.0" strokeLinecap="round" opacity="0.26" />
      <path d="M140 110 C158 85, 175 65, 195 48"
        stroke="var(--color-accent-olive)" strokeWidth="0.9" strokeLinecap="round" opacity="0.24" />
      <path d="M80 160 C95 130, 100 100, 105 75"
        stroke="var(--color-accent-olive)" strokeWidth="0.9" strokeLinecap="round" opacity="0.22" />

      {/* Mid trunk branches */}
      <path d="M46 300 C28 275, 10 255, -5 235"
        stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
      <path d="M48 340 C70 315, 95 300, 120 285"
        stroke="var(--color-accent-olive)" strokeWidth="1.1" strokeLinecap="round" opacity="0.26" />
      <path d="M44 420 C22 400, 5 385, -10 370"
        stroke="var(--color-accent-olive)" strokeWidth="1.0" strokeLinecap="round" opacity="0.24" />
      <path d="M46 460 C68 440, 92 428, 115 415"
        stroke="var(--color-accent-olive)" strokeWidth="0.9" strokeLinecap="round" opacity="0.22" />

      {/* ── Dense blossom canopy — fills upper half completely ── */}

      {/* Very top / trunk tip — tall column of blossoms */}
      <BlossomCloud cx={60}  cy={-20} onHit={onHit} />
      <BlossomCloud cx={62}  cy={20}  onHit={onHit} />
      <BlossomCloud cx={58}  cy={60}  onHit={onHit} />

      {/* Left bough cloud */}
      <BlossomCloud cx={15}  cy={18}  onHit={onHit} />
      <BlossomCloud cx={30}  cy={45}  onHit={onHit} />
      <BlossomCloud cx={8}   cy={55}  onHit={onHit} />

      {/* Right canopy — spreading wide over the content area */}
      <BlossomCloud cx={110} cy={20}  onHit={onHit} />
      <BlossomCloud cx={155} cy={15}  onHit={onHit} />
      <BlossomCloud cx={195} cy={12}  onHit={onHit} />
      <BlossomCloud cx={175} cy={45}  onHit={onHit} />
      <BlossomCloud cx={140} cy={55}  onHit={onHit} />
      <BlossomCloud cx={195} cy={55}  onHit={onHit} />
      <BlossomCloud cx={85}  cy={35}  onHit={onHit} />
      <BlossomCloud cx={120} cy={70}  onHit={onHit} />
      <BlossomCloud cx={165} cy={80}  onHit={onHit} />
      <BlossomCloud cx={100} cy={100} onHit={onHit} />
      <BlossomCloud cx={155} cy={105} onHit={onHit} />
      <BlossomCloud cx={78}  cy={120} onHit={onHit} />
      <BlossomCloud cx={135} cy={130} onHit={onHit} />
      <BlossomCloud cx={185} cy={120} onHit={onHit} />

      {/* Fill in gaps across the full canopy width */}
      <BlossomCloud cx={55}  cy={90}  onHit={onHit} />
      <BlossomCloud cx={40}  cy={110} onHit={onHit} />
      <BlossomCloud cx={20}  cy={90}  onHit={onHit} />
      <BlossomCloud cx={10}  cy={125} onHit={onHit} />

      {/* Mid branches */}
      <BlossomCloud cx={-5}  cy={235} onHit={onHit} />
      <BlossomCloud cx={120} cy={285} onHit={onHit} />
      <BlossomCloud cx={-10} cy={370} onHit={onHit} />
      <BlossomCloud cx={115} cy={415} onHit={onHit} />
    </svg>
  );
}

export function LeafDecor() {
  const [petals, setPetals] = useState<FallingPetal[]>([]);

  const spawnFromSvgPos = useCallback((e: React.MouseEvent, svgX: number, svgY: number) => {
    const svg = (e.target as Element).closest("svg") as SVGSVGElement | null;
    if (!svg) return;
    const { x: pageX, y: pageY } = svgCoordsToScreen(svgX, svgY, svg);

    const count = 3 + Math.floor(Math.random() * 4);
    const newPetals: FallingPetal[] = Array.from({ length: count }, () => ({
      id: nextId++,
      x: pageX + (Math.random() - 0.5) * 20,
      y: pageY + (Math.random() - 0.5) * 10,
      drift: `${(Math.random() - 0.5) * 90}px`,
      spin: `${(Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 280)}deg`,
      duration: `${2 + Math.random() * 1.5}s`,
      delay: `${Math.random() * 0.3}s`,
      scale: 0.5 + Math.random() * 0.55,
    }));

    setPetals((prev) => [...prev, ...newPetals]);
    newPetals.forEach((p) => {
      const ms = (parseFloat(p.duration) + parseFloat(p.delay) + 0.1) * 1000;
      setTimeout(() => setPetals((prev) => prev.filter((x) => x.id !== p.id)), ms);
    });
  }, []);

  return (
    <>
      <div className="leaf-decor leaf-decor-left" aria-hidden>
        <CherryTree onHit={spawnFromSvgPos} />
      </div>
      <div className="leaf-decor leaf-decor-right" aria-hidden>
        <div className="h-full w-full" style={{ transform: "scaleX(-1)" }}>
          <CherryTree onHit={spawnFromSvgPos} />
        </div>
      </div>

      {petals.map((p) => (
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
          <path d={PETAL} fill="var(--color-accent-pink)" opacity="0.80" />
          <circle cx="0" cy="0" r="1.4" fill="var(--color-accent-pink)" opacity="0.55" />
        </svg>
      ))}
    </>
  );
}
