import Link from 'next/link';

export function CubeWordmark({
  size = 'md',
  showPro = false,
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg' | 'nav';
  showPro?: boolean;
  className?: string;
}) {
  const word =
    size === 'lg'
      ? 'text-[28px] tracking-[-0.045em]'
      : size === 'nav'
        ? 'text-[20px] tracking-[-0.035em]'
        : size === 'sm'
          ? 'text-[17px] tracking-[-0.03em]'
          : 'text-[18px] tracking-[-0.035em]';
  const o =
    size === 'lg' || size === 'nav'
      ? 'h-[0.72em] w-[0.72em]'
      : 'h-[0.7em] w-[0.7em]';

  return (
    <div className={`flex items-baseline gap-2.5 ${className}`}>
      <span
        className={`inline-flex items-baseline font-semibold text-[var(--ink)] lowercase ${word}`}
      >
        cubec
        <span
          aria-hidden
          className={`relative mx-[0.04em] inline-flex ${o} shrink-0 translate-y-[0.06em] items-center justify-center`}
        >
          <span className="absolute inset-0 rounded-full border-[1.5px] border-[var(--stage-violet)]" />
          <span className="absolute inset-[22%] rounded-full bg-[var(--stage-violet)]/18" />
        </span>
        m
      </span>
      {showPro ? (
        <span className="text-[11px] font-medium tracking-[0.08em] text-[var(--text-muted)] uppercase">
          Pro
        </span>
      ) : null}
    </div>
  );
}

export function StageProduct({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="crown" x1="60" y1="40" x2="220" y2="120">
          <stop stopColor="#f4f1ea" />
          <stop offset="0.45" stopColor="#e6e0d4" />
          <stop offset="1" stopColor="#cfc6b6" />
        </linearGradient>
        <linearGradient id="bill" x1="40" y1="110" x2="240" y2="150">
          <stop stopColor="#2a2a2c" />
          <stop offset="1" stopColor="#111113" />
        </linearGradient>
        <radialGradient id="button" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(140 78) rotate(90) scale(14)">
          <stop stopColor="#8b84f8" />
          <stop offset="1" stopColor="#5f57f7" />
        </radialGradient>
      </defs>
      <path
        d="M52 108c10-34 40-58 88-58s78 24 88 58c2 8-4 16-12 18H64c-8-2-14-10-12-18z"
        fill="url(#crown)"
      />
      <path
        d="M78 112c12-20 32-34 62-34s50 14 62 34"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="2"
      />
      <path
        d="M96 88c10-5 22-8 44-8 20 0 34 3 44 8"
        stroke="rgba(16,16,16,0.08)"
        strokeWidth="2"
      />
      <path
        d="M42 116c14 5 34 10 54 10h24c5 0 10-2 12-7 7-12 22-20 40-20 10 0 20 3 28 8 5 3 10 10 10 17v5c0 5-3 10-8 12H54c-10 0-18-8-18-17 0-4 2-7 6-8z"
        fill="url(#bill)"
      />
      <path
        d="M168 104c22 3 40 10 54 20"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="2"
      />
      <circle cx="140" cy="78" r="7" fill="url(#button)" />
      <circle
        cx="140"
        cy="78"
        r="11"
        stroke="rgba(95,87,247,0.28)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CubeStage({
  children,
  className = '',
  product = false,
}: {
  children?: React.ReactNode;
  className?: string;
  product?: boolean;
}) {
  return (
    <div className={`cube-stage ${className}`}>
      <div className="cube-stage-field" aria-hidden />
      {product ? (
        <>
          <div className="cube-product-ground" aria-hidden />
          <div className="absolute inset-x-0 top-[8%] bottom-[10%] z-[1] flex items-center justify-center">
            <StageProduct className="h-auto w-[min(78%,420px)] drop-shadow-[0_36px_48px_rgba(16,16,16,0.16)]" />
          </div>
        </>
      ) : null}
      {children ? (
        <div className="relative z-[2]">{children}</div>
      ) : null}
    </div>
  );
}

export function CubeSurface({
  children,
  className = '',
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const classes = `cube-surface block transition duration-150 hover:border-[var(--ink)]/40 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        <div className="relative z-[1]">{children}</div>
      </Link>
    );
  }

  return (
    <div className={classes}>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
