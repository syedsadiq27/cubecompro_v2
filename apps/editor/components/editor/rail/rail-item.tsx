'use client';

import { cn } from '@repo/ui';

export function RailItem({
  active = false,
  label,
  icon,
  onClick,
  compact = false,
}: {
  active?: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        'relative flex w-full flex-col items-center justify-center rounded-lg font-medium transition-colors',
        compact ? 'py-2' : 'py-1.5',
        active
          ? 'bg-white/[0.12] text-white shadow-xs'
          : 'text-white/65 hover:bg-white/[0.06] hover:text-white'
      )}
    >
      <span className={cn('shrink-0', active ? 'text-white' : 'text-white/50')}>
        {icon}
      </span>
      {!compact ? (
        <span className="mt-0.5 text-[9px] leading-tight">{label}</span>
      ) : null}
    </button>
  );
}
