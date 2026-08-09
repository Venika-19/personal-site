"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Flower positions in the SVG viewBox (600×400).
// These are the ONLY valid emission origins for falling particles.
const FLOWERS: { x: number; y: number; r: number; rot: number }[] = [
  { x: 312, y: 148, r: 1.0,  rot: 12  },
  { x: 348, y: 118, r: 0.85, rot: -8  },
  { x: 274, y: 132, r: 0.90, rot: 25  },
  { x: 388, y: 96,  r: 0.78, rot: 40  },
  { x: 240, y: 108, r: 0.82, rot: -18 },
  { x: 418, y: 134, r: 0.72, rot: 55  },
  { x: 352, y: 168, r: 0.76, rot: -35 },
  { x: 210, y: 148, r: 0.68, rot: 10  },
  { x: 455, y: 112, r: 0.65, rot: -22 },
  { x: 290, y: 172, r: 0.70, rot: 48  },
];

// A single 5-petal sakura flower SVG group (centered at 0,0)
function FlowerShape({ scale = 1, color = "#f0b8c8" }: { scale?: number; color?: string }) {
  return (
    <g transform={`scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx={0} cy={-8}
          rx={3.2} ry={5.8}
          fill={color}
          transform={`rotate(${a})`}
          opacity={0.92}
        />
      ))}
      <circle cx={0} cy={0} r={2.2} fill="#fce8f0" opacity={0.95} />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={+(Math.sin((a * Math.PI) / 180) * 4.5).toFixed(2)}
          cy={-(Math.cos((a * Math.PI) / 180) * 4.5).toFixed(2)}
          r={0.7}
          fill="#c47a90"
          opacity={0.6}
        />
      ))}
    </g>
  );
}

// Single petal shape
function PetalShape({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <ellipse cx={0} cy={-5} rx={3.0} ry={5.2} fill="#f0b8c8" opacity={0.88} />
    </g>
  );
}

interface Particle {
  id: number;
  x: number;       // page coords
  y: number;
  type: "petal" | "flower";
  // animation params
  delay: number;
  duration: number;
  driftAmp: number;    // horizontal swing amplitude px
  driftFreq: number;   // how many oscillations
  driftPhase: number;  // starting phase
  totalDrop: number;   // how far it falls px
  rotStart: number;
  rotEnd: number;
  scale: number;
  born: number;        // timestamp
}

let uid = 0;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return reduced;
}

const MAX_PARTICLES = 40;

export function SakuraCorner() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();

  const handleClick = useCallback(() => {
    if (reducedMotion) return;
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const vbW = 600, vbH = 400;
    const scaleX = rect.width / vbW;
    const scaleY = rect.height / vbH;

    // Pick 2–4 flowers to emit from
    const shuffled = [...FLOWERS].sort(() => 0.5 - Math.random());
    const emitters = shuffled.slice(0, 2 + Math.floor(Math.random() * 3));

    const now = performance.now();
    const newParticles: Particle[] = [];

    emitters.forEach((flower) => {
      const px = rect.left + flower.x * scaleX;
      const py = rect.top  + flower.y * scaleY;
      // 3–5 particles per emitter
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const isPetal = Math.random() < 0.8;
        newParticles.push({
          id: uid++,
          x: px + (Math.random() - 0.5) * 12,
          y: py + (Math.random() - 0.5) * 8,
          type: isPetal ? "petal" : "flower",
          delay: i * 60 + Math.random() * 120,
          duration: isPetal
            ? 1500 + Math.random() * 800
            : 1800 + Math.random() * 600,
          driftAmp: 18 + Math.random() * 28,
          driftFreq: 1.2 + Math.random() * 1.4,
          driftPhase: Math.random() * Math.PI * 2,
          totalDrop: 120 + Math.random() * 100,
          rotStart: Math.random() * 360,
          rotEnd: (Math.random() > 0.5 ? 1 : -1) * (80 + Math.random() * 200),
          scale: isPetal
            ? 0.55 + Math.random() * 0.4
            : 0.5 + Math.random() * 0.35,
          born: now,
        });
      }
    });

    setParticles((prev) => {
      const combined = [...prev, ...newParticles];
      return combined.slice(-MAX_PARTICLES);
    });
  }, [reducedMotion]);

  // RAF loop for particle animation
  useEffect(() => {
    if (particles.length === 0) return;
    let raf: number;

    const loop = () => {
      const now = performance.now();
      setParticles((prev) => prev.filter((p) => {
        const elapsed = now - p.born - p.delay;
        return elapsed < p.duration + 100;
      }));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [particles.length]);

  return (
    <>
      {/* Branch SVG — fixed to right side, entering from middle-right */}
      <div
        className="sakura-branch-wrap"
        aria-label="Decorative cherry blossom branch"
        aria-hidden="true"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 600 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="sakura-branch-svg"
          onClick={handleClick}
          style={{ cursor: "pointer", overflow: "visible" }}
        >
          {/* ── PRIMARY BRANCH ── enters from right ~middle, curves left+up */}
          {/* Drawn as layered strokes for tapered organic look */}
          {[
            ["M600 218 C558 210, 510 196, 468 178 C432 162, 400 148, 372 138 C348 130, 326 126, 306 122 C284 118, 262 118, 242 120", 9,   "#5a3e28", 0.70],
            ["M600 218 C558 210, 510 196, 468 178 C432 162, 400 148, 372 138 C348 130, 326 126, 306 122 C284 118, 262 118, 242 120", 5.5, "#5a3e28", 0.82],
            ["M600 218 C558 210, 510 196, 468 178 C432 162, 400 148, 372 138 C348 130, 326 126, 306 122 C284 118, 262 118, 242 120", 2.2, "#3d2818", 0.90],
          ].map(([d, w, color, op], i) => (
            <path key={i} d={d as string} stroke={color as string} strokeWidth={w as number}
              strokeLinecap="round" fill="none" opacity={op as number} />
          ))}

          {/* ── SECONDARY BRANCH — forks upward from ~x=420 */}
          {[
            ["M420 164 C408 148, 394 130, 378 112 C366 98, 352 86, 340 76", 5.5, "#5a3e28", 0.68],
            ["M420 164 C408 148, 394 130, 378 112 C366 98, 352 86, 340 76", 3.2, "#5a3e28", 0.78],
            ["M420 164 C408 148, 394 130, 378 112 C366 98, 352 86, 340 76", 1.4, "#3d2818", 0.88],
          ].map(([d, w, color, op], i) => (
            <path key={i} d={d as string} stroke={color as string} strokeWidth={w as number}
              strokeLinecap="round" fill="none" opacity={op as number} />
          ))}

          {/* ── SECONDARY BRANCH — continues left, drops slightly */}
          {[
            ["M306 122 C288 124, 268 130, 248 140 C232 148, 218 158, 206 168", 4.2, "#5a3e28", 0.64],
            ["M306 122 C288 124, 268 130, 248 140 C232 148, 218 158, 206 168", 2.4, "#5a3e28", 0.75],
            ["M306 122 C288 124, 268 130, 248 140 C232 148, 218 158, 206 168", 1.1, "#3d2818", 0.86],
          ].map(([d, w, color, op], i) => (
            <path key={i} d={d as string} stroke={color as string} strokeWidth={w as number}
              strokeLinecap="round" fill="none" opacity={op as number} />
          ))}

          {/* ── TWIGS — thin, attached near flowers ── */}
          {/* twig near flower 0: (312,148) */}
          <path d="M340 134 C330 140, 320 144, 312 148" stroke="#4a3020" strokeWidth="1.0" strokeLinecap="round" fill="none" opacity="0.80" />
          {/* twig near flower 1: (348,118) */}
          <path d="M360 106 C356 110, 352 114, 348 118" stroke="#4a3020" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.78" />
          {/* twig near flower 2: (274,132) */}
          <path d="M282 120 C279 125, 277 129, 274 132" stroke="#4a3020" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.76" />
          {/* twig near flower 3: (388,96) */}
          <path d="M378 92 C382 93, 386 94, 388 96" stroke="#4a3020" strokeWidth="0.85" strokeLinecap="round" fill="none" opacity="0.74" />
          {/* twig near flower 4: (240,108) from secondary */}
          <path d="M248 118 C245 114, 242 111, 240 108" stroke="#4a3020" strokeWidth="0.85" strokeLinecap="round" fill="none" opacity="0.74" />
          {/* twig near flower 5: (418,134) */}
          <path d="M426 126 C424 129, 421 132, 418 134" stroke="#4a3020" strokeWidth="0.80" strokeLinecap="round" fill="none" opacity="0.72" />
          {/* twig near flower 6: (352,168) */}
          <path d="M360 158 C357 162, 354 165, 352 168" stroke="#4a3020" strokeWidth="0.80" strokeLinecap="round" fill="none" opacity="0.70" />
          {/* twig near flower 7: (210,148) from secondary end */}
          <path d="M214 158 C212 154, 211 151, 210 148" stroke="#4a3020" strokeWidth="0.75" strokeLinecap="round" fill="none" opacity="0.68" />
          {/* twig near flower 8: (455,112) */}
          <path d="M462 118 C459 115, 457 113, 455 112" stroke="#4a3020" strokeWidth="0.75" strokeLinecap="round" fill="none" opacity="0.68" />
          {/* twig near flower 9: (290,172) */}
          <path d="M298 162 C295 166, 292 169, 290 172" stroke="#4a3020" strokeWidth="0.75" strokeLinecap="round" fill="none" opacity="0.68" />

          {/* ── FLOWERS ── */}
          {FLOWERS.map((f, i) => (
            <g key={i} transform={`translate(${f.x},${f.y}) rotate(${f.rot})`}>
              <FlowerShape scale={f.r * 1.1} color="#f0b8c8" />
            </g>
          ))}
        </svg>
      </div>

      {/* ── FALLING PARTICLES ── rendered as fixed-positioned elements */}
      {particles.map((p) => (
        <FallingParticle key={p.id} p={p} />
      ))}
    </>
  );
}

function FallingParticle({ p }: { p: Particle }) {
  const ref = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now() + p.delay;
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";

    const tick = (now: number) => {
      if (now < start) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min((now - start) / p.duration, 1);

      // Sinusoidal horizontal drift
      const dx = p.driftAmp * Math.sin(p.driftFreq * t * Math.PI * 2 + p.driftPhase);
      // Accelerating drop (ease-in feel)
      const dy = p.totalDrop * (t * t * 0.6 + t * 0.4);
      // Rotation
      const rot = p.rotStart + p.rotEnd * t;
      // Fade: full opacity until 65%, then fade out
      const opacity = t < 0.65 ? 0.85 : 0.85 * (1 - (t - 0.65) / 0.35);

      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      el.style.opacity = String(opacity);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        el.style.opacity = "0";
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [p]);

  const size = p.type === "flower" ? 22 : 16;

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`-${size / 2} -${size / 2} ${size} ${size}`}
      style={{
        position: "fixed",
        left: p.x,
        top: p.y,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0,
        willChange: "transform, opacity",
      }}
    >
      {p.type === "petal" ? (
        <PetalShape scale={p.scale} />
      ) : (
        <FlowerShape scale={p.scale * 0.7} color="#f2bfce" />
      )}
    </svg>
  );
}
