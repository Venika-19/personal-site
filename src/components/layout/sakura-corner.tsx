"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type FlowerDef = { x: number; y: number; r: number; rot: number };

// Right branch — enters from right edge at mid-height, curves left+up
// viewBox: 0 0 600 400
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
];

// Left branch — enters from left edge at mid-height, curves right+up
// viewBox: 0 0 600 400
const FLOWERS_LEFT: FlowerDef[] = [
  { x: 126, y: 208, r: 0.88, rot: -12 },
  { x: 140, y: 166, r: 0.82, rot:  28 },
  { x: 104, y: 128, r: 0.76, rot: -22 },
  { x:  94, y:  82, r: 0.70, rot:  44 },
  { x: 198, y: 178, r: 0.84, rot:  15 },
  { x: 258, y: 162, r: 0.78, rot: -30 },
  { x: 350, y: 150, r: 0.72, rot:  50 },
  { x: 368, y: 178, r: 0.68, rot: -18 },
  { x: 398, y: 210, r: 0.64, rot:  35 },
  { x:  88, y: 170, r: 0.66, rot:   8 },
  { x: 170, y: 152, r: 0.70, rot: -40 },
  { x: 316, y: 158, r: 0.74, rot:  22 },
];

// 5-petal flower — faint by default for the static branch illustration
function FlowerShape({
  scale = 1,
  color = "#ebb8c8",
  petalOp = 0.58,
}: {
  scale?: number;
  color?: string;
  petalOp?: number;
}) {
  return (
    <g transform={`scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx={0} cy={-8}
          rx={3.2} ry={5.8}
          fill={color}
          transform={`rotate(${a})`}
          opacity={petalOp}
        />
      ))}
      <circle cx={0} cy={0} r={2.1} fill="#fce8f0" opacity={petalOp * 1.15} />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={+(Math.sin((a * Math.PI) / 180) * 4.4).toFixed(2)}
          cy={-(Math.cos((a * Math.PI) / 180) * 4.4).toFixed(2)}
          r={0.7}
          fill="#b86880"
          opacity={petalOp * 0.7}
        />
      ))}
    </g>
  );
}

function PetalShape({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <ellipse cx={0} cy={-5} rx={2.8} ry={5.0} fill="#efb5c6" opacity={0.88} />
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
        duration: isPetal ? 1600 + Math.random() * 700 : 1900 + Math.random() * 500,
        // Much gentler drift — barely noticeable side movement
        driftAmp:   4 + Math.random() * 7,
        driftFreq:  0.3 + Math.random() * 0.4,
        driftPhase: Math.random() * Math.PI * 2,
        totalDrop: 110 + Math.random() * 90,
        rotStart: Math.random() * 360,
        rotEnd: (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 100),
        scale: isPetal ? 0.5 + Math.random() * 0.38 : 0.44 + Math.random() * 0.28,
        born: now,
      });
    }
  });
  return out;
}

export function SakuraCorner() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const rightRef = useRef<SVGSVGElement>(null);
  const leftRef  = useRef<SVGSVGElement>(null);
  const reduced  = useReducedMotion();

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

  // Clean up finished particles
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
      {/* ── RIGHT BRANCH ── */}
      <div className="sakura-branch-wrap sakura-branch-right" aria-hidden="true">
        <svg
          ref={rightRef}
          viewBox="0 0 600 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="sakura-branch-svg"
          onClick={handleRight}
          style={{ cursor: "pointer", overflow: "visible" }}
        >
          {/* Primary — enters from right at y=218, curves left+up */}
          {([
            ["M600 218 C558 210, 510 196, 468 178 C432 162, 400 148, 372 138 C348 130, 326 126, 306 122 C284 118, 262 118, 242 120", 8.5, "#5a3e28", 0.62],
            ["M600 218 C558 210, 510 196, 468 178 C432 162, 400 148, 372 138 C348 130, 326 126, 306 122 C284 118, 262 118, 242 120", 5.0, "#5a3e28", 0.74],
            ["M600 218 C558 210, 510 196, 468 178 C432 162, 400 148, 372 138 C348 130, 326 126, 306 122 C284 118, 262 118, 242 120", 2.0, "#3d2818", 0.85],
          ] as [string,number,string,number][]).map(([d, w, c, o], i) => (
            <path key={i} d={d} stroke={c} strokeWidth={w} strokeLinecap="round" fill="none" opacity={o} />
          ))}
          {/* Secondary up — forks at ~x=420 */}
          {([
            ["M420 164 C408 148, 394 130, 378 112 C366 98, 352 86, 340 76", 5.0, "#5a3e28", 0.60],
            ["M420 164 C408 148, 394 130, 378 112 C366 98, 352 86, 340 76", 3.0, "#5a3e28", 0.72],
            ["M420 164 C408 148, 394 130, 378 112 C366 98, 352 86, 340 76", 1.3, "#3d2818", 0.82],
          ] as [string,number,string,number][]).map(([d, w, c, o], i) => (
            <path key={i} d={d} stroke={c} strokeWidth={w} strokeLinecap="round" fill="none" opacity={o} />
          ))}
          {/* Secondary left — continues left, slightly lower */}
          {([
            ["M306 122 C288 124, 268 130, 248 140 C232 148, 218 158, 206 168", 3.8, "#5a3e28", 0.58],
            ["M306 122 C288 124, 268 130, 248 140 C232 148, 218 158, 206 168", 2.2, "#5a3e28", 0.68],
            ["M306 122 C288 124, 268 130, 248 140 C232 148, 218 158, 206 168", 1.0, "#3d2818", 0.80],
          ] as [string,number,string,number][]).map(([d, w, c, o], i) => (
            <path key={i} d={d} stroke={c} strokeWidth={w} strokeLinecap="round" fill="none" opacity={o} />
          ))}
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
            <path key={i} d={d} stroke="#4a3020" strokeWidth="0.85" strokeLinecap="round" fill="none" opacity="0.68" />
          ))}
          {/* Flowers */}
          {FLOWERS_RIGHT.map((f, i) => (
            <g key={i} transform={`translate(${f.x},${f.y}) rotate(${f.rot})`}>
              <FlowerShape scale={f.r} petalOp={0.56} />
            </g>
          ))}
        </svg>
      </div>

      {/* ── LEFT BRANCH ── */}
      <div className="sakura-branch-wrap sakura-branch-left" aria-hidden="true">
        <svg
          ref={leftRef}
          viewBox="0 0 600 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="sakura-branch-svg"
          onClick={handleLeft}
          style={{ cursor: "pointer", overflow: "visible" }}
        >
          {/* Primary — enters from left at y=252, curves right+up */}
          {([
            ["M0 252 C38 242, 80 228, 122 214 C158 202, 196 190, 232 180 C262 172, 290 166, 318 162 C340 160, 360 160, 376 164", 8.0, "#5a3e28", 0.62],
            ["M0 252 C38 242, 80 228, 122 214 C158 202, 196 190, 232 180 C262 172, 290 166, 318 162 C340 160, 360 160, 376 164", 4.8, "#5a3e28", 0.74],
            ["M0 252 C38 242, 80 228, 122 214 C158 202, 196 190, 232 180 C262 172, 290 166, 318 162 C340 160, 360 160, 376 164", 1.9, "#3d2818", 0.85],
          ] as [string,number,string,number][]).map(([d, w, c, o], i) => (
            <path key={i} d={d} stroke={c} strokeWidth={w} strokeLinecap="round" fill="none" opacity={o} />
          ))}
          {/* Secondary up — forks from ~x=156, y=198 going upper-left */}
          {([
            ["M156 198 C146 178, 134 154, 120 132 C108 112, 96 90, 82 70", 4.8, "#5a3e28", 0.60],
            ["M156 198 C146 178, 134 154, 120 132 C108 112, 96 90, 82 70", 2.8, "#5a3e28", 0.72],
            ["M156 198 C146 178, 134 154, 120 132 C108 112, 96 90, 82 70", 1.2, "#3d2818", 0.82],
          ] as [string,number,string,number][]).map(([d, w, c, o], i) => (
            <path key={i} d={d} stroke={c} strokeWidth={w} strokeLinecap="round" fill="none" opacity={o} />
          ))}
          {/* Secondary right — continues from x=318, y=162 drooping slightly */}
          {([
            ["M318 162 C340 170, 362 180, 380 192 C396 202, 410 216, 420 232", 3.6, "#5a3e28", 0.58],
            ["M318 162 C340 170, 362 180, 380 192 C396 202, 410 216, 420 232", 2.1, "#5a3e28", 0.68],
            ["M318 162 C340 170, 362 180, 380 192 C396 202, 410 216, 420 232", 0.95, "#3d2818", 0.80],
          ] as [string,number,string,number][]).map(([d, w, c, o], i) => (
            <path key={i} d={d} stroke={c} strokeWidth={w} strokeLinecap="round" fill="none" opacity={o} />
          ))}
          {/* Twigs */}
          {[
            "M118 214 C121 212, 124 210, 126 208",
            "M148 178 C145 174, 142 170, 140 166",
            "M118 136 C112 133, 108 130, 104 128",
            "M86 72 C89 76, 91 79, 94 82",
            "M192 188 C194 184, 196 181, 198 178",
            "M262 170 C261 167, 260 164, 258 162",
            "M346 160 C347 156, 348 153, 350 150",
            "M362 166 C364 170, 366 174, 368 178",
            "M392 200 C394 204, 396 207, 398 210",
            "M110 150 C100 157, 94 163, 88 170",
            "M156 166 C161 160, 166 156, 170 152",
            "M312 162 C313 161, 314 159, 316 158",
          ].map((d, i) => (
            <path key={i} d={d} stroke="#4a3020" strokeWidth="0.85" strokeLinecap="round" fill="none" opacity="0.68" />
          ))}
          {/* Flowers */}
          {FLOWERS_LEFT.map((f, i) => (
            <g key={i} transform={`translate(${f.x},${f.y}) rotate(${f.rot})`}>
              <FlowerShape scale={f.r} petalOp={0.56} />
            </g>
          ))}
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

      // Gentle sinusoidal drift — small amplitude, slow frequency
      const dx = p.driftAmp * Math.sin(p.driftFreq * t * Math.PI * 2 + p.driftPhase);
      // Ease-in drop
      const dy = p.totalDrop * (t * t * 0.55 + t * 0.45);
      const rot = p.rotStart + p.rotEnd * t;
      const opacity = t < 0.62 ? 0.82 : 0.82 * (1 - (t - 0.62) / 0.38);

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
    <svg
      ref={ref}
      width={size} height={size}
      viewBox={`-${size / 2} -${size / 2} ${size} ${size}`}
      style={{
        position: "fixed",
        left: p.x, top: p.y,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0,
        willChange: "transform, opacity",
      }}
    >
      {p.type === "petal"
        ? <PetalShape scale={p.scale} />
        : <FlowerShape scale={p.scale * 0.7} color="#f2bfce" petalOp={0.88} />
      }
    </svg>
  );
}
