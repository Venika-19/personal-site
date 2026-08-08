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

const PETAL = "M0,-9 C2,-9 5.5,-6 5.5,-2.5 C5.5,1 3,4.5 0,5.5 C-3,4.5 -5.5,1 -5.5,-2.5 C-5.5,-6 -2,-9 0,-9 Z";

function Blossom({ x, y, r = 1, opacity = 0.55, rotate = 0 }: {
  x: number; y: number; r?: number; opacity?: number; rotate?: number;
}) {
  return (
    <g transform={`translate(${x},${y}) scale(${r}) rotate(${rotate})`} opacity={opacity}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d={PETAL} fill="var(--color-accent-pink)" transform={`rotate(${a})`} opacity="0.9" />
      ))}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <line x1="0" y1="0" x2="0" y2="-6" stroke="var(--color-accent-pink)" strokeWidth="0.5" opacity="0.7" />
          <circle cx="0" cy="-6.5" r="0.8" fill="var(--color-accent-olive)" />
        </g>
      ))}
      <circle cx="0" cy="0" r="2.2" fill="var(--color-accent-pink)" opacity="0.8" />
    </g>
  );
}

// Cluster with an invisible hit circle — clicking anywhere within `hitRadius` triggers petals
function BlossomCluster({ cx, cy, count = 6, spread = 14, baseScale = 1, baseOpacity = 0.52, hitRadius = 28, onHit }: {
  cx: number; cy: number; count?: number; spread?: number;
  baseScale?: number; baseOpacity?: number; hitRadius?: number;
  onHit: (svgX: number, svgY: number) => void;
}) {
  const positions = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const d = i === 0 ? 0 : spread * (0.5 + ((i * 7) % 10) / 20);
    return {
      x: cx + Math.cos(angle) * d,
      y: cy + Math.sin(angle) * d,
      r: baseScale * (0.7 + (i % 3) * 0.15),
      opacity: baseOpacity * (0.75 + (i % 4) * 0.08),
      rotate: (i * 13) % 36,
    };
  });

  return (
    <g>
      {positions.map((p, i) => (
        <Blossom key={i} x={p.x} y={p.y} r={p.r} opacity={p.opacity} rotate={p.rotate} />
      ))}
      {/* Invisible hit area */}
      <circle
        cx={cx} cy={cy} r={hitRadius}
        fill="transparent"
        className="blossom-hit"
        onClick={() => onHit(cx, cy)}
      />
    </g>
  );
}

function CherryBranchSvg({ onHit }: { onHit: (svgX: number, svgY: number, rect: DOMRect) => void }) {
  return (
    <svg
      viewBox="0 0 200 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      {/* ── Branches ── */}
      <path d="M110 1000 C105 880, 95 800, 100 700 C105 600, 90 520, 95 400 C100 300, 80 220, 70 120 C60 60, 50 30, 45 0"
        stroke="var(--color-accent-olive)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />

      {/* Top boughs */}
      <path d="M68 100 C50 80, 20 55, 5 30"   stroke="var(--color-accent-olive)" strokeWidth="1.8" strokeLinecap="round" opacity="0.38" />
      <path d="M65 130 C85 105, 115 85, 140 65" stroke="var(--color-accent-olive)" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
      <path d="M5 30 C-5 15, -8 5, -5 0"        stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
      <path d="M22 48 C12 32, 8 20, 12 8"       stroke="var(--color-accent-olive)" strokeWidth="1.0" strokeLinecap="round" opacity="0.25" />
      <path d="M140 65 C155 48, 165 35, 168 18"  stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
      <path d="M130 75 C148 60, 160 52, 175 42"  stroke="var(--color-accent-olive)" strokeWidth="1.0" strokeLinecap="round" opacity="0.22" />
      {/* Extra top twigs */}
      <path d="M55 60 C45 40, 38 22, 42 5"      stroke="var(--color-accent-olive)" strokeWidth="1.0" strokeLinecap="round" opacity="0.22" />
      <path d="M75 90 C90 68, 105 50, 108 28"    stroke="var(--color-accent-olive)" strokeWidth="0.9" strokeLinecap="round" opacity="0.20" />

      {/* Mid branches */}
      <path d="M80 220 C55 205, 25 195, 5 180"   stroke="var(--color-accent-olive)" strokeWidth="1.4" strokeLinecap="round" opacity="0.30" />
      <path d="M88 260 C110 240, 135 228, 155 215" stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
      <path d="M5 180 C-5 165, -8 155, -5 145"   stroke="var(--color-accent-olive)" strokeWidth="0.9" strokeLinecap="round" opacity="0.22" />

      {/* Lower branches */}
      <path d="M93 400 C68 385, 40 375, 18 362"  stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.26" />
      <path d="M97 440 C118 422, 142 410, 160 398" stroke="var(--color-accent-olive)" strokeWidth="1.0" strokeLinecap="round" opacity="0.24" />

      {/* ── Flower clusters ── */}
      {/* Very top — the crown, packed tight */}
      <BlossomCluster cx={-5}  cy={0}   count={9} spread={16} baseScale={1.15} baseOpacity={0.60} hitRadius={30} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />
      <BlossomCluster cx={12}  cy={8}   count={7} spread={14} baseScale={1.05} baseOpacity={0.55} hitRadius={28} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />
      <BlossomCluster cx={42}  cy={5}   count={7} spread={13} baseScale={1.0}  baseOpacity={0.52} hitRadius={26} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />
      <BlossomCluster cx={108} cy={26}  count={7} spread={14} baseScale={1.0}  baseOpacity={0.52} hitRadius={26} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />
      <BlossomCluster cx={168} cy={16}  count={8} spread={16} baseScale={1.1}  baseOpacity={0.58} hitRadius={30} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />
      <BlossomCluster cx={155} cy={38}  count={6} spread={13} baseScale={0.95} baseOpacity={0.50} hitRadius={26} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />
      <BlossomCluster cx={175} cy={42}  count={5} spread={11} baseScale={0.85} baseOpacity={0.44} hitRadius={24} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />
      <BlossomCluster cx={5}   cy={28}  count={7} spread={15} baseScale={1.0}  baseOpacity={0.54} hitRadius={28} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />
      <BlossomCluster cx={22}  cy={45}  count={6} spread={13} baseScale={0.92} baseOpacity={0.48} hitRadius={26} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />
      <BlossomCluster cx={140} cy={62}  count={6} spread={13} baseScale={0.95} baseOpacity={0.50} hitRadius={26} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />

      {/* Mid-upper */}
      <BlossomCluster cx={5}   cy={145} count={6} spread={14} baseScale={0.9}  baseOpacity={0.44} hitRadius={26} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />
      <BlossomCluster cx={155} cy={212} count={5} spread={13} baseScale={0.85} baseOpacity={0.40} hitRadius={24} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />
      <BlossomCluster cx={85}  cy={220} count={4} spread={10} baseScale={0.75} baseOpacity={0.36} hitRadius={22} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />

      {/* Mid */}
      <BlossomCluster cx={18}  cy={360} count={5} spread={13} baseScale={0.85} baseOpacity={0.38} hitRadius={24} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />
      <BlossomCluster cx={160} cy={396} count={5} spread={12} baseScale={0.80} baseOpacity={0.36} hitRadius={24} onHit={(x,y) => onHit(x, y, (document.querySelector(".leaf-decor-left svg") as SVGSVGElement)?.getBoundingClientRect()!)} />
    </svg>
  );
}

export function LeafDecor() {
  const [petals, setPetals] = useState<FallingPetal[]>([]);

  // svgX/svgY are in SVG viewBox coords; rect is the SVG's bounding box in page space
  const spawnAtSvgCoords = useCallback((svgX: number, svgY: number, rect: DOMRect) => {
    const scaleX = rect.width / 200;
    const scaleY = rect.height / 1000;
    const pageX = rect.left + svgX * scaleX;
    const pageY = rect.top + svgY * scaleY;

    const count = 3 + Math.floor(Math.random() * 4); // reduced volume
    const newPetals: FallingPetal[] = Array.from({ length: count }, () => ({
      id: nextId++,
      x: pageX + (Math.random() - 0.5) * 18,
      y: pageY,
      drift: `${(Math.random() - 0.5) * 100}px`,
      spin: `${(Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 300)}deg`,
      duration: `${2 + Math.random() * 1.5}s`,
      delay: `${Math.random() * 0.3}s`,
      scale: 0.5 + Math.random() * 0.6,
    }));

    setPetals((prev) => [...prev, ...newPetals]);
    newPetals.forEach((p) => {
      const ms = (parseFloat(p.duration) + parseFloat(p.delay) + 0.1) * 1000;
      setTimeout(() => setPetals((prev) => prev.filter((x) => x.id !== p.id)), ms);
    });
  }, []);

  // Each branch needs to resolve the correct SVG element's rect at click time
  const makeHitHandler = useCallback((selector: string) => {
    return (svgX: number, svgY: number, _rect: DOMRect) => {
      const el = document.querySelector(selector) as SVGSVGElement | null;
      if (!el) return;
      spawnAtSvgCoords(svgX, svgY, el.getBoundingClientRect());
    };
  }, [spawnAtSvgCoords]);

  return (
    <>
      <div className="leaf-decor leaf-decor-left" aria-hidden>
        <BranchWithHandlers side="left" spawnAtSvgCoords={spawnAtSvgCoords} />
      </div>
      <div className="leaf-decor leaf-decor-right" aria-hidden>
        <div className="h-full w-full" style={{ transform: "scaleX(-1)" }}>
          <BranchWithHandlers side="right" spawnAtSvgCoords={spawnAtSvgCoords} />
        </div>
      </div>

      {petals.map((p) => (
        <svg
          key={p.id}
          width="20" height="20"
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

// Separate component so we can ref the SVG element directly
function BranchWithHandlers({ side, spawnAtSvgCoords }: {
  side: "left" | "right";
  spawnAtSvgCoords: (x: number, y: number, rect: DOMRect) => void;
}) {
  const handleHit = useCallback((svgX: number, svgY: number, e: React.MouseEvent) => {
    const svg = (e.target as Element).closest("svg") as SVGSVGElement | null;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    // For mirrored right side, flip X back
    const actualX = side === "right" ? 200 - svgX : svgX;
    spawnAtSvgCoords(actualX, svgY, rect);
  }, [side, spawnAtSvgCoords]);

  return (
    <svg
      viewBox="0 0 200 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      {/* ── Branches ── */}
      <path d="M110 1000 C105 880, 95 800, 100 700 C105 600, 90 520, 95 400 C100 300, 80 220, 70 120 C60 60, 50 30, 45 0"
        stroke="var(--color-accent-olive)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
      <path d="M68 100 C50 80, 20 55, 5 30"    stroke="var(--color-accent-olive)" strokeWidth="1.8" strokeLinecap="round" opacity="0.38" />
      <path d="M65 130 C85 105, 115 85, 140 65" stroke="var(--color-accent-olive)" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
      <path d="M5 30 C-5 15, -8 5, -5 0"        stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
      <path d="M22 48 C12 32, 8 20, 12 8"       stroke="var(--color-accent-olive)" strokeWidth="1.0" strokeLinecap="round" opacity="0.25" />
      <path d="M140 65 C155 48, 165 35, 168 18"  stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
      <path d="M130 75 C148 60, 160 52, 175 42"  stroke="var(--color-accent-olive)" strokeWidth="1.0" strokeLinecap="round" opacity="0.22" />
      <path d="M55 60 C45 40, 38 22, 42 5"       stroke="var(--color-accent-olive)" strokeWidth="1.0" strokeLinecap="round" opacity="0.22" />
      <path d="M75 90 C90 68, 105 50, 108 28"    stroke="var(--color-accent-olive)" strokeWidth="0.9" strokeLinecap="round" opacity="0.20" />
      <path d="M80 220 C55 205, 25 195, 5 180"   stroke="var(--color-accent-olive)" strokeWidth="1.4" strokeLinecap="round" opacity="0.30" />
      <path d="M88 260 C110 240, 135 228, 155 215" stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" />
      <path d="M5 180 C-5 165, -8 155, -5 145"   stroke="var(--color-accent-olive)" strokeWidth="0.9" strokeLinecap="round" opacity="0.22" />
      <path d="M93 400 C68 385, 40 375, 18 362"  stroke="var(--color-accent-olive)" strokeWidth="1.2" strokeLinecap="round" opacity="0.26" />
      <path d="M97 440 C118 422, 142 410, 160 398" stroke="var(--color-accent-olive)" strokeWidth="1.0" strokeLinecap="round" opacity="0.24" />

      {/* ── Flower clusters with hit areas ── */}
      {/* Crown — packed top */}
      <ClusterWithHit cx={-5}  cy={0}   count={9} spread={16} baseScale={1.15} baseOpacity={0.60} hitRadius={30} onHit={(x,y,e) => handleHit(x,y,e)} />
      <ClusterWithHit cx={12}  cy={8}   count={7} spread={14} baseScale={1.05} baseOpacity={0.55} hitRadius={28} onHit={(x,y,e) => handleHit(x,y,e)} />
      <ClusterWithHit cx={42}  cy={5}   count={7} spread={13} baseScale={1.0}  baseOpacity={0.52} hitRadius={26} onHit={(x,y,e) => handleHit(x,y,e)} />
      <ClusterWithHit cx={108} cy={26}  count={7} spread={14} baseScale={1.0}  baseOpacity={0.52} hitRadius={26} onHit={(x,y,e) => handleHit(x,y,e)} />
      <ClusterWithHit cx={168} cy={16}  count={8} spread={16} baseScale={1.1}  baseOpacity={0.58} hitRadius={30} onHit={(x,y,e) => handleHit(x,y,e)} />
      <ClusterWithHit cx={155} cy={38}  count={6} spread={13} baseScale={0.95} baseOpacity={0.50} hitRadius={26} onHit={(x,y,e) => handleHit(x,y,e)} />
      <ClusterWithHit cx={175} cy={42}  count={5} spread={11} baseScale={0.85} baseOpacity={0.44} hitRadius={24} onHit={(x,y,e) => handleHit(x,y,e)} />
      <ClusterWithHit cx={5}   cy={28}  count={7} spread={15} baseScale={1.0}  baseOpacity={0.54} hitRadius={28} onHit={(x,y,e) => handleHit(x,y,e)} />
      <ClusterWithHit cx={22}  cy={45}  count={6} spread={13} baseScale={0.92} baseOpacity={0.48} hitRadius={26} onHit={(x,y,e) => handleHit(x,y,e)} />
      <ClusterWithHit cx={140} cy={62}  count={6} spread={13} baseScale={0.95} baseOpacity={0.50} hitRadius={26} onHit={(x,y,e) => handleHit(x,y,e)} />
      {/* Mid-upper */}
      <ClusterWithHit cx={5}   cy={145} count={6} spread={14} baseScale={0.9}  baseOpacity={0.44} hitRadius={26} onHit={(x,y,e) => handleHit(x,y,e)} />
      <ClusterWithHit cx={155} cy={212} count={5} spread={13} baseScale={0.85} baseOpacity={0.40} hitRadius={24} onHit={(x,y,e) => handleHit(x,y,e)} />
      <ClusterWithHit cx={85}  cy={220} count={4} spread={10} baseScale={0.75} baseOpacity={0.36} hitRadius={22} onHit={(x,y,e) => handleHit(x,y,e)} />
      {/* Mid */}
      <ClusterWithHit cx={18}  cy={360} count={5} spread={13} baseScale={0.85} baseOpacity={0.38} hitRadius={24} onHit={(x,y,e) => handleHit(x,y,e)} />
      <ClusterWithHit cx={160} cy={396} count={5} spread={12} baseScale={0.80} baseOpacity={0.36} hitRadius={24} onHit={(x,y,e) => handleHit(x,y,e)} />
    </svg>
  );
}

function ClusterWithHit({ cx, cy, count, spread, baseScale, baseOpacity, hitRadius, onHit }: {
  cx: number; cy: number; count: number; spread: number;
  baseScale: number; baseOpacity: number; hitRadius: number;
  onHit: (svgX: number, svgY: number, e: React.MouseEvent) => void;
}) {
  const positions = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const d = i === 0 ? 0 : spread * (0.5 + ((i * 7) % 10) / 20);
    return {
      x: cx + Math.cos(angle) * d,
      y: cy + Math.sin(angle) * d,
      r: baseScale * (0.7 + (i % 3) * 0.15),
      opacity: baseOpacity * (0.75 + (i % 4) * 0.08),
      rotate: (i * 13) % 36,
    };
  });

  return (
    <g>
      {positions.map((p, i) => (
        <Blossom key={i} x={p.x} y={p.y} r={p.r} opacity={p.opacity} rotate={p.rotate} />
      ))}
      <circle
        cx={cx} cy={cy} r={hitRadius}
        fill="transparent"
        className="blossom-hit"
        onClick={(e) => onHit(cx, cy, e)}
      />
    </g>
  );
}
