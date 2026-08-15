import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type DividedListTone = 'default' | 'ink';
export type DividedListDensity = 'default' | 'compact';
export type DividedListMarker = 'none' | 'danger' | 'success';

export function DividedList({
  items,
  tone = 'default',
  density = 'default',
  marker = 'none',
  className,
  ...props
}: Omit<HTMLAttributes<HTMLUListElement>, 'children'> & {
  items: readonly string[];
  tone?: DividedListTone;
  density?: DividedListDensity;
  marker?: DividedListMarker;
}) {
  const compact = density === 'compact';

  return (
    <ul
      className={cn(compact ? 'ui:space-y-3' : 'ui:space-y-4', className)}
      {...props}
    >
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            'ui:first:border-t-0 ui:first:pt-0',
            compact
              ? 'ui:border-t ui:pt-3 ui:text-[15px]'
              : 'ui:border-t ui:pt-4 ui:text-[15px] ui:md:text-base',
            tone === 'default' &&
              'ui:border-[var(--line)] ui:text-[var(--ink)]',
            tone === 'ink' && 'ui:border-white/10',
            marker !== 'none' && 'ui:flex ui:gap-3'
          )}
        >
          {marker !== 'none' ? (
            <>
              <span
                className={cn(
                  'ui:mt-1.5 ui:h-1.5 ui:w-1.5 ui:shrink-0 ui:rounded-full',
                  marker === 'danger' && 'ui:bg-[var(--danger)]',
                  marker === 'success' && 'ui:bg-[var(--success)]'
                )}
                aria-hidden
              />
              <span>{item}</span>
            </>
          ) : (
            item
          )}
        </li>
      ))}
    </ul>
  );
}
