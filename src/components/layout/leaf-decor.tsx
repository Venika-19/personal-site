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

// One proper cherry blossom petal — notched tip, slightly heart-like but botanical
function Petal({ rotation, style }: { rotation: number; style?: React.CSSProperties }) {
  return (
    <path
      d="M0,-9 C3,-9 7,-6 7,-2 C7,2 4,5 0,6 C-4,5 -7,2 -7,-2 C-7,-6 -3,-9 0,-9 Z"
      fill="var(--color-accent-pink)"
      transform={`rotate(${rotation})`}
      style={style}
    />
  );
}

// Full 5-petal blossom with stamens
function Blossom({
  x, y, scale = 1, opacity = 0.5,
  onClick,
}: {
  x: number; y: number; scale?: number; opacity?: number;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <g
      transform={`translate(${x},${y}) scale(${scale})`}
      opacity={opacity}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      <Petal rotation={0} />
      <Petal rotation={72} />
      <Petal rotation={144} />
      <Petal rotation={216} />
      <Petal rotation={288} />
      {/* Stamens */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1="0" y1="0"
          x2={Math.sin((a * Math.PI) / 180) * 5}
          y2={-Math.cos((a * Math.PI) / 180) * 5}
          stroke="var(--color-accent-pink)"
          strokeWidth="0.5"
          opacity="0.8"
        />
      ))}
      {/* Stamen tips */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <circle
          key={a}
          cx={Math.sin((a * Math.PI) / 180) * 5.5}
          cy={-Math.cos((a * Math.PI) / 180) * 5.5}
          r="0.7"
          fill="var(--color-accent-olive)"
          opacity="0.9"
        />
      ))}
      {/* Centre */}
      <circle cx="0" cy="0" r="2" fill="var(--color-accent-pink)" opacity="0.7" />
    </g>
  );
}

function CherryBranchSvg({ onBlossomClick }: { onBlossomClick: (e: React.MouseEvent, x: number, y: number) => void }) {
  return (
    <svg
      viewBox="0 0 160 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      {/* Main branch */}
      <path
        d="M80 0 C72 120, 55 200, 65 310 C75 420, 45 500, 60 640 C70 730, 55 800, 50 900"
        stroke="var(--color-accent-olive)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* Sub-branches */}
      <path d="M71 180 C50 165, 25 150, 10 135" stroke="var(--color-accent-olive)" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M68 240 C88 220, 110 210, 128 195" stroke="var(--color-accent-olive)" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M58 420 C38 405, 18 395, 2 380" stroke="var(--color-accent-olive)" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
      <path d="M62 490 C82 472, 105 460, 122 448" stroke="var(--color-accent-olive)" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
      <path d="M56 660 C36 645, 16 635, 0 622" stroke="var(--color-accent-olive)" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />

      {/* Blossoms at branch tips — clickable */}
      <Blossom x={10}  y={135} scale={1.1} opacity={0.52} onClick={(e) => onBlossomClick(e, 10, 135)} />
      <Blossom x={22}  y={150} scale={0.8} opacity={0.38} onClick={(e) => onBlossomClick(e, 22, 150)} />
      <Blossom x={128} y={195} scale={1.0} opacity={0.46} onClick={(e) => onBlossomClick(e, 128, 195)} />
      <Blossom x={110} y={205} scale={0.7} opacity={0.32} onClick={(e) => onBlossomClick(e, 110, 205)} />
      <Blossom x={65}  y={310} scale={0.75} opacity={0.30} onClick={(e) => onBlossomClick(e, 65, 310)} />
      <Blossom x={2}   y={380} scale={1.05} opacity={0.44} onClick={(e) => onBlossomClick(e, 2, 380)} />
      <Blossom x={14}  y={393} scale={0.7} opacity={0.28} onClick={(e) => onBlossomClick(e, 14, 393)} />
      <Blossom x={122} y={448} scale={1.0} opacity={0.40} onClick={(e) => onBlossomClick(e, 122, 448)} />
      <Blossom x={105} y={460} scale={0.65} opacity={0.26} onClick={(e) => onBlossomClick(e, 105, 460)} />
      <Blossom x={0}   y={622} scale={0.9} opacity={0.32} onClick={(e) => onBlossomClick(e, 0, 622)} />

      {/* Lone floating petals (decorative, not clickable) */}
      <path d="M0,-5 C2,-5 4,-3 4,-1 C4,1 2,3 0,3.5 C-2,3 -4,1 -4,-1 C-4,-3 -2,-5 0,-5 Z"
        fill="var(--color-accent-pink)" opacity="0.18" transform="translate(35,560) rotate(-30)" />
      <path d="M0,-4 C1.6,-4 3.2,-2.4 3.2,-0.8 C3.2,0.8 1.6,2.4 0,2.8 C-1.6,2.4 -3.2,0.8 -3.2,-0.8 C-3.2,-2.4 -1.6,-4 0,-4 Z"
        fill="var(--color-accent-pink)" opacity="0.14" transform="translate(90,590) rotate(20)" />
      <path d="M0,-4.5 C1.8,-4.5 3.6,-2.7 3.6,-0.9 C3.6,0.9 1.8,2.7 0,3.2 C-1.8,2.7 -3.6,0.9 -3.6,-0.9 C-3.6,-2.7 -1.8,-4.5 0,-4.5 Z"
        fill="var(--color-accent-pink)" opacity="0.14" transform="translate(15,700) rotate(-15)" />
    </svg>
  );
}

let nextId = 0;

export function LeafDecor() {
  const [petals, setPetals] = useState<FallingPetal[]>([]);

  const spawnPetals = useCallback((e: React.MouseEvent, svgX: number, svgY: number) => {
    e.stopPropagation();
    const rect = (e.currentTarget as SVGGElement).closest("svg")!.getBoundingClientRect();
    // Convert SVG coords to page coords
    const scaleY = rect.height / 900;
    const scaleX = rect.width / 160;
    const pageX = rect.left + svgX * scaleX;
    const pageY = rect.top + svgY * scaleY;

    const count = 5 + Math.floor(Math.random() * 4);
    const newPetals: FallingPetal[] = Array.from({ length: count }, () => ({
      id: nextId++,
      x: pageX + (Math.random() - 0.5) * 20,
      y: pageY,
      drift: `${(Math.random() - 0.5) * 120}px`,
      spin: `${(Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360)}deg`,
      duration: `${1.8 + Math.random() * 1.4}s`,
      delay: `${Math.random() * 0.4}s`,
      scale: 0.5 + Math.random() * 0.6,
    }));

    setPetals((prev) => [...prev, ...newPetals]);
    newPetals.forEach((p) => {
      setTimeout(() => {
        setPetals((prev) => prev.filter((x) => x.id !== p.id));
      }, (parseFloat(p.duration) + parseFloat(p.delay) + 0.1) * 1000);
    });
  }, []);

  return (
    <>
      {/* Branch decorations */}
      <div className="leaf-decor leaf-decor-left" aria-hidden>
        <CherryBranchSvg onBlossomClick={spawnPetals} />
      </div>
      <div className="leaf-decor leaf-decor-right" aria-hidden>
        <div className="h-full w-full" style={{ transform: "scaleX(-1)" }}>
          <CherryBranchSvg onBlossomClick={spawnPetals} />
        </div>
      </div>

      {/* Falling petals portal — rendered in document flow, positioned fixed */}
      {petals.map((p) => (
        <svg
          key={p.id}
          width="20"
          height="20"
          viewBox="-10 -10 20 20"
          style={{
            position: "fixed",
            left: p.x,
            top: p.y,
            pointerEvents: "none",
            zIndex: 9999,
            ["--petal-drift" as string]: p.drift,
            ["--petal-spin" as string]: p.spin,
            animation: `petal-fall ${p.duration} ${p.delay} ease-in forwards`,
            transform: `scale(${p.scale})`,
          }}
        >
          <path
            d="M0,-8 C2.5,-8 6,-5.5 6,-2 C6,1.5 3.5,4.5 0,5.5 C-3.5,4.5 -6,1.5 -6,-2 C-6,-5.5 -2.5,-8 0,-8 Z"
            fill="var(--color-accent-pink)"
            opacity="0.85"
          />
          <circle cx="0" cy="0" r="1.5" fill="var(--color-accent-pink)" opacity="0.6" />
        </svg>
      ))}
    </>
  );
}
