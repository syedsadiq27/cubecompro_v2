import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

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
        <linearGradient id="ui-crown" x1="60" y1="40" x2="220" y2="120">
          <stop stopColor="#F5F3EE" />
          <stop offset="0.45" stopColor="#ECE9E2" />
          <stop offset="1" stopColor="#D8D5CE" />
        </linearGradient>
        <linearGradient id="ui-bill" x1="40" y1="110" x2="240" y2="150">
          <stop stopColor="#24252A" />
          <stop offset="1" stopColor="#0E0F12" />
        </linearGradient>
        <radialGradient
          id="ui-button"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(140 78) rotate(90) scale(14)"
        >
          <stop stopColor="#A8A0FF" />
          <stop offset="1" stopColor="#665CFF" />
        </radialGradient>
      </defs>
      <path
        d="M52 108c10-34 40-58 88-58s78 24 88 58c2 8-4 16-12 18H64c-8-2-14-10-12-18z"
        fill="url(#ui-crown)"
      />
      <path
        d="M78 112c12-20 32-34 62-34s50 14 62 34"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="2"
      />
      <path
        d="M96 88c10-5 22-8 44-8 20 0 34 3 44 8"
        stroke="rgba(14,15,18,0.08)"
        strokeWidth="2"
      />
      <path
        d="M42 116c14 5 34 10 54 10h24c5 0 10-2 12-7 7-12 22-20 40-20 10 0 20 3 28 8 5 3 10 10 10 17v5c0 5-3 10-8 12H54c-10 0-18-8-18-17 0-4 2-7 6-8z"
        fill="url(#ui-bill)"
      />
      <path
        d="M168 104c22 3 40 10 54 20"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="2"
      />
      <circle cx="140" cy="78" r="7" fill="url(#ui-button)" />
      <circle
        cx="140"
        cy="78"
        r="11"
        stroke="rgba(102,92,255,0.28)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

type StageSize = 'full' | 'cover' | 'thumb';

export function Stage({
  size = 'cover',
  plane = true,
  product = false,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  size?: StageSize;
  plane?: boolean;
  product?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'ui-stage',
        size === 'full' && 'ui-stage--full',
        size === 'cover' && 'ui-stage--cover',
        size === 'thumb' && 'ui-stage--thumb',
        !plane && 'ui-stage--plane-off',
        className
      )}
      {...props}
    >
      <div className="ui-stage-field" aria-hidden />
      {product ? (
        <>
          <div className="ui-stage-ground" aria-hidden />
          <div className="ui:absolute ui:inset-x-0 ui:top-[8%] ui:bottom-[10%] ui:z-[1] ui:flex ui:items-center ui:justify-center">
            <StageProduct className="ui:h-auto ui:w-[min(78%,420px)] ui:drop-shadow-[0_36px_48px_rgba(14,15,18,0.16)]" />
          </div>
        </>
      ) : null}
      {children ? (
        <div className="ui:relative ui:z-[2]">{children}</div>
      ) : null}
    </div>
  );
}
