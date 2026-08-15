import { cn } from '@repo/ui';

export function SkeletonRows({
  rows = 6,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="overflow-hidden rounded border border-[var(--line)]">
      <div className="border-b border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5">
        <div className="h-2.5 w-24 animate-pulse rounded bg-[var(--line)]" />
      </div>
      <ul>
        {Array.from({ length: rows }).map((_, row) => (
          <li
            key={row}
            className="flex items-center gap-3 border-t border-[var(--line)] px-2.5 py-2"
          >
            {Array.from({ length: cols }).map((__, col) => (
              <div
                key={col}
                className={cn(
                  'h-2.5 animate-pulse rounded bg-[var(--line)]',
                  col === 0 ? 'w-[28%]' : 'w-[12%]'
                )}
              />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkeletonFields({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-1.5">
          <div className="h-2.5 w-20 animate-pulse rounded bg-[var(--line)]" />
          <div className="h-8 w-full animate-pulse rounded border border-[var(--line)] bg-[var(--surface)]" />
        </div>
      ))}
    </div>
  );
}
