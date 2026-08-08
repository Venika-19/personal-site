export function LeafDecor() {
  return (
    <>
      <div className="leaf-decor leaf-decor-left" aria-hidden>
        <svg
          viewBox="0 0 200 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Large hanging branch from top-left */}
          <path
            d="M20 0 C30 80, 60 140, 40 220"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-[var(--color-accent-olive)] opacity-20"
          />
          {/* Leaf cluster 1 */}
          <path
            d="M40 120 C20 90, -10 70, 10 50 C30 30, 55 55, 40 120Z"
            fill="currentColor"
            className="text-[var(--color-accent-olive)] opacity-15"
          />
          <path
            d="M38 115 C55 85, 80 75, 70 55 C60 35, 38 60, 38 115Z"
            fill="currentColor"
            className="text-[var(--color-accent-olive)] opacity-10"
          />
          {/* Stem continues */}
          <path
            d="M40 220 C50 300, 20 360, 50 430"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="text-[var(--color-accent-olive)] opacity-15"
          />
          {/* Leaf cluster 2 */}
          <path
            d="M45 320 C20 295, -5 275, 15 255 C35 235, 55 265, 45 320Z"
            fill="currentColor"
            className="text-[var(--color-accent-olive)] opacity-12"
          />
          <path
            d="M47 315 C65 285, 85 280, 78 258 C70 238, 47 265, 47 315Z"
            fill="currentColor"
            className="text-[var(--color-accent-olive)] opacity-8"
          />
          {/* Small pink accent bud */}
          <circle
            cx="16"
            cy="258"
            r="4"
            fill="currentColor"
            className="text-[var(--color-accent-pink)] opacity-20"
          />
          {/* Lower stem */}
          <path
            d="M50 430 C35 510, 55 570, 30 650"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-[var(--color-accent-olive)] opacity-12"
          />
          {/* Leaf cluster 3 */}
          <path
            d="M38 530 C15 505, -8 490, 12 468 C32 448, 50 478, 38 530Z"
            fill="currentColor"
            className="text-[var(--color-accent-olive)] opacity-10"
          />
          {/* Tiny pink buds */}
          <circle
            cx="10"
            cy="470"
            r="3"
            fill="currentColor"
            className="text-[var(--color-accent-pink)] opacity-18"
          />
          <circle
            cx="28"
            cy="490"
            r="2.5"
            fill="currentColor"
            className="text-[var(--color-accent-pink)] opacity-14"
          />
          {/* Bottom leaf */}
          <path
            d="M30 650 C10 625, -12 608, 8 588 C28 568, 44 598, 30 650Z"
            fill="currentColor"
            className="text-[var(--color-accent-olive)] opacity-8"
          />
        </svg>
      </div>

      <div className="leaf-decor leaf-decor-right" aria-hidden>
        <svg
          viewBox="0 0 200 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <path
            d="M20 0 C30 80, 60 140, 40 220"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-[var(--color-accent-olive)] opacity-20"
          />
          <path
            d="M40 120 C20 90, -10 70, 10 50 C30 30, 55 55, 40 120Z"
            fill="currentColor"
            className="text-[var(--color-accent-olive)] opacity-15"
          />
          <path
            d="M38 115 C55 85, 80 75, 70 55 C60 35, 38 60, 38 115Z"
            fill="currentColor"
            className="text-[var(--color-accent-olive)] opacity-10"
          />
          <path
            d="M40 220 C50 300, 20 360, 50 430"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="text-[var(--color-accent-olive)] opacity-15"
          />
          <path
            d="M45 320 C20 295, -5 275, 15 255 C35 235, 55 265, 45 320Z"
            fill="currentColor"
            className="text-[var(--color-accent-olive)] opacity-12"
          />
          <path
            d="M47 315 C65 285, 85 280, 78 258 C70 238, 47 265, 47 315Z"
            fill="currentColor"
            className="text-[var(--color-accent-olive)] opacity-10"
          />
          <circle
            cx="16"
            cy="258"
            r="4"
            fill="currentColor"
            className="text-[var(--color-accent-pink)] opacity-20"
          />
          <path
            d="M50 430 C35 510, 55 570, 30 650"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-[var(--color-accent-olive)] opacity-12"
          />
          <path
            d="M38 530 C15 505, -8 490, 12 468 C32 448, 50 478, 38 530Z"
            fill="currentColor"
            className="text-[var(--color-accent-olive)] opacity-10"
          />
          <circle
            cx="10"
            cy="470"
            r="3"
            fill="currentColor"
            className="text-[var(--color-accent-pink)] opacity-18"
          />
          <circle
            cx="28"
            cy="490"
            r="2.5"
            fill="currentColor"
            className="text-[var(--color-accent-pink)] opacity-14"
          />
          <path
            d="M30 650 C10 625, -12 608, 8 588 C28 568, 44 598, 30 650Z"
            fill="currentColor"
            className="text-[var(--color-accent-olive)] opacity-8"
          />
        </svg>
      </div>
    </>
  );
}
