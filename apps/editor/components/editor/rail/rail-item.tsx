'use client';

import { cn } from '@repo/ui';

export function RailItem({
  active = false,
  label,
  title,
  icon,
  onClick,
  compact = false,
}: {
  active?: boolean;
  label: string;
  title?: string;
  icon: React.ReactNode;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title || label}
      className={cn(
        'group relative flex w-full flex-col items-center justify-center rounded-xl font-medium transition-all duration-150',
        compact ? 'h-10 w-10 mx-auto' : 'py-2 px-1',
        active
          ? 'bg-[#5B50EC] text-white shadow-md shadow-[#5B50EC]/30'
          : 'text-white/60 hover:bg-white/10 hover:text-white'
      )}
    >
      <span className={cn('shrink-0 transition-transform group-hover:scale-105', active ? 'text-white' : 'text-white/60 group-hover:text-white')}>
        {icon}
      </span>
      {!compact ? (
        <span className={cn('mt-1 text-[10px] font-medium leading-none tracking-tight', active ? 'text-white' : 'text-white/60 group-hover:text-white')}>
          {label}
        </span>
      ) : null}
    </button>
  );
}
