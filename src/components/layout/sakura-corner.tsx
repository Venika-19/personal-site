"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type FlowerDef = { x: number; y: number; r: number; rot: number };

// viewBox 0 0 600 400 for both sides
const FLOWERS_RIGHT: FlowerDef[] = [
  { x: 312, y: 148, r: 0.90, rot:  12 },
  { x: 348, y: 118, r: 0.80, rot:  -8 },
  { x: 274, y: 132, r: 0.84, rot:  25 },
  { x: 388, y:  96, r: 0.74, rot:  40 },
  { x: 240, y: 108, r: 0.78, rot: -18 },
  { x: 418, y: 134, r: 0.70, rot:  55 },
  { x: 352, y: 168, r: 0.72, rot: -35 },
  { x: 210, y: 148, r: 0.65, rot:  10 },
  { x: 455, y: 112, r: 0.68, rot: -22 },
  { x: 290, y: 172, r: 0.66, rot:  48 },
  { x: 462, y: 160, r: 0.70, rot:  15 },
  { x: 480, y: 190, r: 0.63, rot: -30 },
  { x: 364, y:  80, r: 0.72, rot:  62 },
  { x: 330, y: 106, r: 0.68, rot: -42 },
  { x: 186, y: 156, r: 0.62, rot:  20 },
  { x: 226, y: 128, r: 0.64, rot: -15 },
  // extra cluster on main arm
  { x: 500, y: 174, r: 0.66, rot:  28 },
  { x: 524, y: 196, r: 0.61, rot: -44 },
  { x: 446, y: 152, r: 0.64, rot:  18 },
  { x: 258, y: 158, r: 0.63, rot: -38 },
  // extra on upper fork
  { x: 356, y:  62, r: 0.68, rot:  48 },
  { x: 376, y:  46, r: 0.62, rot: -25 },
  { x: 342, y:  88, r: 0.66, rot:  70 },
  // scatter on left arm
  { x: 196, y: 170, r: 0.60, rot:  32 },
  { x: 172, y: 178, r: 0.58, rot: -52 },
  { x: 218, y: 164, r: 0.62, rot:   8 },
];

// Left branch is a horizontal mirror of right: x → 600 - x, rot → -rot
const FLOWERS_LEFT: FlowerDef[] = FLOWERS_RIGHT.map(f => ({
  x: 600 - f.x,
  y: f.y,
  r: f.r,
  rot: -f.rot,
}));

// 5-petal flower using CSS variable for color — visible in both light and dark
function FlowerShape({
  scale = 1,
  petalOp = 0.72,
  forParticle = false,
}: {
  scale?: number;
  petalOp?: number;
  forParticle?: boolean;
}) {
  // For particles we inline the color; for static branch we use the CSS var
  const fill   = forParticle ? "#e8809a" : "var(--sakura-petal)";
  const center = forParticle ? "#fce0e8" : "var(--sakura-center)";
  const stamen = forParticle ? "#a04060" : "var(--sakura-stamen)";

  return (
    <g transform={`scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx={0} cy={-8}
          rx={3.2} ry={5.8}
          fill={fill}
          transform={`rotate(${a})`}
          opacity={petalOp}
        />
      ))}
      <circle cx={0} cy={0} r={2.1} fill={center} opacity={Math.min(1, petalOp * 1.2)} />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={+(Math.sin((a * Math.PI) / 180) * 4.4).toFixed(2)}
          cy={-(Math.cos((a * Math.PI) / 180) * 4.4).toFixed(2)}
          r={0.7}
          fill={stamen}
          opacity={petalOp * 0.75}
        />
      ))}
    </g>
  );
}

function PetalShape({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <ellipse cx={0} cy={-5} rx={2.8} ry={5.0} fill="#e8809a" opacity={0.88} />
    </g>
  );
}

interface Particle {
  id: number;
  x: number; y: number;
  type: "petal" | "flower";
  delay: number;
  duration: number;
  driftAmp: number;
  driftFreq: number;
  driftPhase: number;
  totalDrop: number;
  rotStart: number;
  rotEnd: number;
  scale: number;
  born: number;
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

const MAX_PARTICLES = 48;
const VBW = 600, VBH = 400;

function spawnFromBranch(rect: DOMRect, flowers: FlowerDef[]): Particle[] {
  const sx = rect.width / VBW;
  const sy = rect.height / VBH;
  const shuffled = [...flowers].sort(() => 0.5 - Math.random());
  const emitters = shuffled.slice(0, 2 + Math.floor(Math.random() * 3));
  const now = performance.now();
  const out: Particle[] = [];

  emitters.forEach((f) => {
    const px = rect.left + f.x * sx;
    const py = rect.top  + f.y * sy;
    const count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const isPetal = Math.random() < 0.8;
      out.push({
        id: uid++,
        x: px + (Math.random() - 0.5) * 10,
        y: py + (Math.random() - 0.5) * 7,
        type: isPetal ? "petal" : "flower",
        delay: i * 55 + Math.random() * 100,
        duration: isPetal ? 4200 + Math.random() * 1200 : 5000 + Math.random() * 1000,
        driftAmp:   4 + Math.random() * 7,
        driftFreq:  0.3 + Math.random() * 0.4,
        driftPhase: Math.random() * Math.PI * 2,
        totalDrop: 480 + Math.random() * 200,
        rotStart: Math.random() * 360,
        rotEnd: (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 100),
        scale: isPetal ? 0.5 + Math.random() * 0.38 : 0.44 + Math.random() * 0.28,
        born: now,
      });
    }
  });
  return out;
}

// Layered branch stroke helper
type BranchSpec = [string, number, string, number];

function Branch({ specs }: { specs: BranchSpec[] }) {
  return (
    <>
      {specs.map(([d, w, c, o], i) => (
        <path key={i} d={d} stroke={`#${c}`} strokeWidth={w}
          strokeLinecap="round" fill="none" opacity={o} />
      ))}
    </>
  );
}

// Does the flower region of a branch svg overlap any visible text in <main>?
// The flowers sit in the interior half of the viewBox nearest the content,
// so we test that region's on-screen box against each text element's box.
function branchOverlapsText(svg: SVGSVGElement | null): boolean {
  if (!svg) return false;
  const main = document.getElementById("main");
  if (!main) return false;

  const box = svg.getBoundingClientRect();
  if (box.width === 0) return false;

  // Flowers live roughly within x∈[172,524], y∈[46,196] of a 0–600 / 0–400 vb.
  const sx = box.width / VBW;
  const sy = box.height / VBH;
  const flowerBox = {
    left: box.left + 172 * sx,
    right: box.left + 524 * sx,
    top: box.top + 46 * sy,
    bottom: box.top + 196 * sy,
  };

  const nodes = main.querySelectorAll(
    "h1, h2, h3, h4, p, li, blockquote, time, a, span"
  );
  for (const node of nodes) {
    if (!node.textContent?.trim()) continue;
    const r = node.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const overlaps =
      r.left < flowerBox.right &&
      r.right > flowerBox.left &&
      r.top < flowerBox.bottom &&
      r.bottom > flowerBox.top;
    if (overlaps) return true;
  }
  return false;
}

export function SakuraCorner() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimRight, setDimRight] = useState(false);
  const [dimLeft, setDimLeft] = useState(false);
  const rightRef = useRef<SVGSVGElement>(null);
  const leftRef  = useRef<SVGSVGElement>(null);
  const reduced  = useReducedMotion();

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setDimRight(branchOverlapsText(rightRef.current));
        setDimLeft(branchOverlapsText(leftRef.current));
      });
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const handleRight = useCallback(() => {
    if (reduced || !rightRef.current) return;
    const p = spawnFromBranch(rightRef.current.getBoundingClientRect(), FLOWERS_RIGHT);
    setParticles(prev => [...prev, ...p].slice(-MAX_PARTICLES));
  }, [reduced]);

  const handleLeft = useCallback(() => {
    if (reduced || !leftRef.current) return;
    const p = spawnFromBranch(leftRef.current.getBoundingClientRect(), FLOWERS_LEFT);
    setParticles(prev => [...prev, ...p].slice(-MAX_PARTICLES));
  }, [reduced]);

  useEffect(() => {
    if (particles.length === 0) return;
    let raf: number;
    const loop = () => {
      const now = performance.now();
      setParticles(prev => prev.filter(p => now - p.born - p.delay < p.duration + 80));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [particles.length]);

  return (
    <>
      {/* ── RIGHT BRANCH — enters from right, mid-height ── */}
      <div className="sakura-branch-wrap sakura-branch-right" aria-hidden="true">
        <svg ref={rightRef} viewBox="0 0 600 400" fill="none"
          className="sakura-branch-svg" onClick={handleRight}
          style={{ cursor: "pointer", overflow: "visible",
            opacity: dimRight ? 0.25 : 1, transition: "opacity 400ms ease" }}>
          <defs>
            {/* Fades out near the right entry edge (x=600) */}
            <linearGradient id="fade-r" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="white" stopOpacity="1" />
              <stop offset="72%"  stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="mask-r" maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill="url(#fade-r)" />
            </mask>
          </defs>
          <g mask="url(#mask-r)">
          {/* Primary */}
          <Branch specs={[
            ["M600 218 C558 210, 510 196, 468 178 C432 162, 400 148, 372 138 C348 130, 326 126, 306 122 C284 118, 262 118, 242 120", 8.5, "5a3e28", 0.62],
            ["M600 218 C558 210, 510 196, 468 178 C432 162, 400 148, 372 138 C348 130, 326 126, 306 122 C284 118, 262 118, 242 120", 5.0, "5a3e28", 0.74],
            ["M600 218 C558 210, 510 196, 468 178 C432 162, 400 148, 372 138 C348 130, 326 126, 306 122 C284 118, 262 118, 242 120", 2.0, "3d2818", 0.85],
          ]} />
          {/* Fork up */}
          <Branch specs={[
            ["M420 164 C408 148, 394 130, 378 112 C366 98, 352 86, 340 76", 5.0, "5a3e28", 0.60],
            ["M420 164 C408 148, 394 130, 378 112 C366 98, 352 86, 340 76", 3.0, "5a3e28", 0.72],
            ["M420 164 C408 148, 394 130, 378 112 C366 98, 352 86, 340 76", 1.3, "3d2818", 0.82],
          ]} />
          {/* Fork left-low */}
          <Branch specs={[
            ["M306 122 C288 124, 268 130, 248 140 C232 148, 218 158, 206 168", 3.8, "5a3e28", 0.58],
            ["M306 122 C288 124, 268 130, 248 140 C232 148, 218 158, 206 168", 2.2, "5a3e28", 0.68],
            ["M306 122 C288 124, 268 130, 248 140 C232 148, 218 158, 206 168", 1.0, "3d2818", 0.80],
          ]} />
          {/* Twigs */}
          {[
            "M340 134 C330 140, 320 144, 312 148",
            "M360 106 C356 110, 352 114, 348 118",
            "M282 120 C279 125, 277 129, 274 132",
            "M378 92 C382 93, 386 94, 388 96",
            "M248 118 C245 114, 242 111, 240 108",
            "M426 126 C424 129, 421 132, 418 134",
            "M360 158 C357 162, 354 165, 352 168",
            "M214 158 C212 154, 211 151, 210 148",
            "M462 118 C459 115, 457 113, 455 112",
            "M298 162 C295 166, 292 169, 290 172",
            "M468 170 C466 166, 464 163, 462 160",
            "M474 178 C476 183, 478 186, 480 190",
            "M370 90 C368 86, 366 83, 364 80",
            "M336 100 C334 102, 332 104, 330 106",
            "M196 162 C192 160, 189 158, 186 156",
            "M234 122 C231 124, 228 126, 226 128",
          ].map((d, i) => (
            <path key={i} d={d} stroke="#4a3020" strokeWidth="0.85"
              strokeLinecap="round" fill="none" opacity="0.65" />
          ))}
          {FLOWERS_RIGHT.map((f, i) => (
            <g key={i} transform={`translate(${f.x},${f.y}) rotate(${f.rot})`}>
              <FlowerShape scale={f.r} petalOp={0.72} />
            </g>
          ))}
          </g>{/* end mask-r group */}
        </svg>
      </div>

      {/* ── LEFT BRANCH — exact mirror of right branch ── */}
      <div className="sakura-branch-wrap sakura-branch-left" aria-hidden="true">
        <svg ref={leftRef} viewBox="0 0 600 400" fill="none"
          className="sakura-branch-svg" onClick={handleLeft}
          style={{ cursor: "pointer", overflow: "visible" }}>
          <defs>
            {/* Left branch enters from left (x=0), so fade at x=0 end */}
            <linearGradient id="fade-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="white" stopOpacity="0" />
              <stop offset="28%"  stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
            <mask id="mask-l" maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill="url(#fade-l)" />
            </mask>
          </defs>
          <g mask="url(#mask-l)">
          {/* Flip horizontally around the centre of the viewBox (x=300) */}
          <g transform="scale(-1,1) translate(-600,0)">
            <Branch specs={[
              ["M600 218 C558 210, 510 196, 468 178 C432 162, 400 148, 372 138 C348 130, 326 126, 306 122 C284 118, 262 118, 242 120", 8.5, "5a3e28", 0.62],
              ["M600 218 C558 210, 510 196, 468 178 C432 162, 400 148, 372 138 C348 130, 326 126, 306 122 C284 118, 262 118, 242 120", 5.0, "5a3e28", 0.74],
              ["M600 218 C558 210, 510 196, 468 178 C432 162, 400 148, 372 138 C348 130, 326 126, 306 122 C284 118, 262 118, 242 120", 2.0, "3d2818", 0.85],
            ]} />
            <Branch specs={[
              ["M420 164 C408 148, 394 130, 378 112 C366 98, 352 86, 340 76", 5.0, "5a3e28", 0.60],
              ["M420 164 C408 148, 394 130, 378 112 C366 98, 352 86, 340 76", 3.0, "5a3e28", 0.72],
              ["M420 164 C408 148, 394 130, 378 112 C366 98, 352 86, 340 76", 1.3, "3d2818", 0.82],
            ]} />
            <Branch specs={[
              ["M306 122 C288 124, 268 130, 248 140 C232 148, 218 158, 206 168", 3.8, "5a3e28", 0.58],
              ["M306 122 C288 124, 268 130, 248 140 C232 148, 218 158, 206 168", 2.2, "5a3e28", 0.68],
              ["M306 122 C288 124, 268 130, 248 140 C232 148, 218 158, 206 168", 1.0, "3d2818", 0.80],
            ]} />
            {[
              "M340 134 C330 140, 320 144, 312 148",
              "M360 106 C356 110, 352 114, 348 118",
              "M282 120 C279 125, 277 129, 274 132",
              "M378 92 C382 93, 386 94, 388 96",
              "M248 118 C245 114, 242 111, 240 108",
              "M426 126 C424 129, 421 132, 418 134",
              "M360 158 C357 162, 354 165, 352 168",
              "M214 158 C212 154, 211 151, 210 148",
              "M462 118 C459 115, 457 113, 455 112",
              "M298 162 C295 166, 292 169, 290 172",
              "M468 170 C466 166, 464 163, 462 160",
              "M474 178 C476 183, 478 186, 480 190",
              "M370 90 C368 86, 366 83, 364 80",
              "M336 100 C334 102, 332 104, 330 106",
              "M196 162 C192 160, 189 158, 186 156",
              "M234 122 C231 124, 228 126, 226 128",
            ].map((d, i) => (
              <path key={i} d={d} stroke="#4a3020" strokeWidth="0.85"
                strokeLinecap="round" fill="none" opacity="0.65" />
            ))}
            {/* Flowers — use mirrored rot so petals face correctly after the flip */}
            {FLOWERS_LEFT.map((f, i) => (
              <g key={i} transform={`translate(${600 - f.x},${f.y}) rotate(${-f.rot})`}>
                <FlowerShape scale={f.r} petalOp={0.72} />
              </g>
            ))}
          </g>{/* end flip group */}
          </g>{/* end mask-l group */}
        </svg>
      </div>

      {particles.map(p => <FallingParticle key={p.id} p={p} />)}
    </>
  );
}

function FallingParticle({ p }: { p: Particle }) {
  const ref    = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now() + p.delay;
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";

    const tick = (now: number) => {
      if (now < start) { rafRef.current = requestAnimationFrame(tick); return; }
      const t = Math.min((now - start) / p.duration, 1);
      const dx = p.driftAmp * Math.sin(p.driftFreq * t * Math.PI * 2 + p.driftPhase);
      const dy = p.totalDrop * (t * t * 0.55 + t * 0.45);
      const rot = p.rotStart + p.rotEnd * t;
      const opacity = t < 0.88 ? 0.82 : 0.82 * (1 - (t - 0.88) / 0.12);
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      el.style.opacity = String(Math.max(0, opacity));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else el.style.opacity = "0";
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [p]);

  const size = p.type === "flower" ? 22 : 15;
  return (
    <svg ref={ref} width={size} height={size}
      viewBox={`-${size / 2} -${size / 2} ${size} ${size}`}
      style={{
        position: "fixed", left: p.x, top: p.y,
        pointerEvents: "none", zIndex: 9999,
        opacity: 0, willChange: "transform, opacity",
      }}
    >
      {p.type === "petal"
        ? <PetalShape scale={p.scale} />
        : <FlowerShape scale={p.scale * 0.7} petalOp={0.88} forParticle />
      }
    </svg>
  );
}
