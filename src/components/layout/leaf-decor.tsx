// Cherry blossom branch decorations, fixed to viewport sides.
// Only shown on screens wider than 1280px via CSS.

function CherryBranchSvg() {
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

      {/* Sub-branch top-left */}
      <path
        d="M71 180 C50 165, 25 150, 10 135"
        stroke="var(--color-accent-olive)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />
      {/* Sub-branch top-right */}
      <path
        d="M68 240 C88 220, 110 210, 128 195"
        stroke="var(--color-accent-olive)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />
      {/* Sub-branch mid-left */}
      <path
        d="M58 420 C38 405, 18 395, 2 380"
        stroke="var(--color-accent-olive)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.25"
      />
      {/* Sub-branch mid-right */}
      <path
        d="M62 490 C82 472, 105 460, 122 448"
        stroke="var(--color-accent-olive)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.25"
      />
      {/* Sub-branch lower-left */}
      <path
        d="M56 660 C36 645, 16 635, 0 622"
        stroke="var(--color-accent-olive)"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.2"
      />

      {/* ── Cherry blossoms ── */}
      {/* Each blossom: 5 rounded petals arranged around a centre */}

      {/* Blossom at top-left branch tip (~10, 135) */}
      <g transform="translate(10,135)" opacity="0.45">
        <ellipse cx="0"  cy="-6"  rx="3.5" ry="5" fill="var(--color-accent-pink)" transform="rotate(0)" />
        <ellipse cx="0"  cy="-6"  rx="3.5" ry="5" fill="var(--color-accent-pink)" transform="rotate(72)" />
        <ellipse cx="0"  cy="-6"  rx="3.5" ry="5" fill="var(--color-accent-pink)" transform="rotate(144)" />
        <ellipse cx="0"  cy="-6"  rx="3.5" ry="5" fill="var(--color-accent-pink)" transform="rotate(216)" />
        <ellipse cx="0"  cy="-6"  rx="3.5" ry="5" fill="var(--color-accent-pink)" transform="rotate(288)" />
        <circle cx="0" cy="0" r="1.8" fill="var(--color-accent-pink)" opacity="0.6" />
      </g>

      {/* Smaller blossom slightly up the branch (~22, 148) */}
      <g transform="translate(22,148)" opacity="0.35">
        <ellipse cx="0"  cy="-4.5" rx="2.8" ry="4" fill="var(--color-accent-pink)" transform="rotate(0)" />
        <ellipse cx="0"  cy="-4.5" rx="2.8" ry="4" fill="var(--color-accent-pink)" transform="rotate(72)" />
        <ellipse cx="0"  cy="-4.5" rx="2.8" ry="4" fill="var(--color-accent-pink)" transform="rotate(144)" />
        <ellipse cx="0"  cy="-4.5" rx="2.8" ry="4" fill="var(--color-accent-pink)" transform="rotate(216)" />
        <ellipse cx="0"  cy="-4.5" rx="2.8" ry="4" fill="var(--color-accent-pink)" transform="rotate(288)" />
        <circle cx="0" cy="0" r="1.4" fill="var(--color-accent-pink)" opacity="0.5" />
      </g>

      {/* Blossom at top-right branch tip (~128, 195) */}
      <g transform="translate(128,195)" opacity="0.4">
        <ellipse cx="0"  cy="-5.5" rx="3.2" ry="4.8" fill="var(--color-accent-pink)" transform="rotate(18)" />
        <ellipse cx="0"  cy="-5.5" rx="3.2" ry="4.8" fill="var(--color-accent-pink)" transform="rotate(90)" />
        <ellipse cx="0"  cy="-5.5" rx="3.2" ry="4.8" fill="var(--color-accent-pink)" transform="rotate(162)" />
        <ellipse cx="0"  cy="-5.5" rx="3.2" ry="4.8" fill="var(--color-accent-pink)" transform="rotate(234)" />
        <ellipse cx="0"  cy="-5.5" rx="3.2" ry="4.8" fill="var(--color-accent-pink)" transform="rotate(306)" />
        <circle cx="0" cy="0" r="1.6" fill="var(--color-accent-pink)" opacity="0.55" />
      </g>

      {/* Small blossom on main branch (~65, 310) */}
      <g transform="translate(65,310)" opacity="0.3">
        <ellipse cx="0"  cy="-4" rx="2.5" ry="3.6" fill="var(--color-accent-pink)" transform="rotate(0)" />
        <ellipse cx="0"  cy="-4" rx="2.5" ry="3.6" fill="var(--color-accent-pink)" transform="rotate(72)" />
        <ellipse cx="0"  cy="-4" rx="2.5" ry="3.6" fill="var(--color-accent-pink)" transform="rotate(144)" />
        <ellipse cx="0"  cy="-4" rx="2.5" ry="3.6" fill="var(--color-accent-pink)" transform="rotate(216)" />
        <ellipse cx="0"  cy="-4" rx="2.5" ry="3.6" fill="var(--color-accent-pink)" transform="rotate(288)" />
        <circle cx="0" cy="0" r="1.2" fill="var(--color-accent-pink)" opacity="0.5" />
      </g>

      {/* Blossom at mid-left tip (~2, 380) */}
      <g transform="translate(2,380)" opacity="0.38">
        <ellipse cx="0"  cy="-5" rx="3" ry="4.5" fill="var(--color-accent-pink)" transform="rotate(36)" />
        <ellipse cx="0"  cy="-5" rx="3" ry="4.5" fill="var(--color-accent-pink)" transform="rotate(108)" />
        <ellipse cx="0"  cy="-5" rx="3" ry="4.5" fill="var(--color-accent-pink)" transform="rotate(180)" />
        <ellipse cx="0"  cy="-5" rx="3" ry="4.5" fill="var(--color-accent-pink)" transform="rotate(252)" />
        <ellipse cx="0"  cy="-5" rx="3" ry="4.5" fill="var(--color-accent-pink)" transform="rotate(324)" />
        <circle cx="0" cy="0" r="1.5" fill="var(--color-accent-pink)" opacity="0.5" />
      </g>

      {/* Blossom at mid-right tip (~122, 448) */}
      <g transform="translate(122,448)" opacity="0.35">
        <ellipse cx="0"  cy="-5" rx="3" ry="4.5" fill="var(--color-accent-pink)" transform="rotate(0)" />
        <ellipse cx="0"  cy="-5" rx="3" ry="4.5" fill="var(--color-accent-pink)" transform="rotate(72)" />
        <ellipse cx="0"  cy="-5" rx="3" ry="4.5" fill="var(--color-accent-pink)" transform="rotate(144)" />
        <ellipse cx="0"  cy="-5" rx="3" ry="4.5" fill="var(--color-accent-pink)" transform="rotate(216)" />
        <ellipse cx="0"  cy="-5" rx="3" ry="4.5" fill="var(--color-accent-pink)" transform="rotate(288)" />
        <circle cx="0" cy="0" r="1.5" fill="var(--color-accent-pink)" opacity="0.5" />
      </g>

      {/* Tiny scattered petals (fallen / floating) */}
      <ellipse cx="35" cy="560" rx="3" ry="4.5" fill="var(--color-accent-pink)" opacity="0.2" transform="rotate(-30, 35, 560)" />
      <ellipse cx="90" cy="590" rx="2.5" ry="4"   fill="var(--color-accent-pink)" opacity="0.15" transform="rotate(20, 90, 590)" />
      <ellipse cx="15" cy="700" rx="2.8" ry="4.2" fill="var(--color-accent-pink)" opacity="0.15" transform="rotate(-15, 15, 700)" />

      {/* Blossom at lower-left tip (~0, 622) */}
      <g transform="translate(0,622)" opacity="0.28">
        <ellipse cx="0"  cy="-4.5" rx="2.8" ry="4" fill="var(--color-accent-pink)" transform="rotate(0)" />
        <ellipse cx="0"  cy="-4.5" rx="2.8" ry="4" fill="var(--color-accent-pink)" transform="rotate(72)" />
        <ellipse cx="0"  cy="-4.5" rx="2.8" ry="4" fill="var(--color-accent-pink)" transform="rotate(144)" />
        <ellipse cx="0"  cy="-4.5" rx="2.8" ry="4" fill="var(--color-accent-pink)" transform="rotate(216)" />
        <ellipse cx="0"  cy="-4.5" rx="2.8" ry="4" fill="var(--color-accent-pink)" transform="rotate(288)" />
        <circle cx="0" cy="0" r="1.3" fill="var(--color-accent-pink)" opacity="0.45" />
      </g>
    </svg>
  );
}

export function LeafDecor() {
  return (
    <>
      <div className="leaf-decor leaf-decor-left" aria-hidden>
        <CherryBranchSvg />
      </div>
      <div className="leaf-decor leaf-decor-right" aria-hidden>
        {/* Mirror horizontally */}
        <div className="h-full w-full" style={{ transform: "scaleX(-1)" }}>
          <CherryBranchSvg />
        </div>
      </div>
    </>
  );
}
