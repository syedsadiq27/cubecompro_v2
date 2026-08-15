import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { List, ListItem } from './list';

export type DividedListDensity = 'default' | 'compact';
export type DividedListMarker = 'none' | 'danger' | 'success';

export function DividedList({
  items,
  density = 'default',
  marker = 'none',
  className,
  ...props
}: Omit<HTMLAttributes<HTMLUListElement>, 'children'> & {
  items: readonly string[];
  density?: DividedListDensity;
  marker?: DividedListMarker;
}) {
  const compact = density === 'compact';

  return (
    <List
      gap={compact ? 'sm' : 'md'}
      className={className}
      {...props}
    >
      {items.map((item) => (
        <ListItem
          key={item}
          className={cn(
            'ui:border-t ui:border-[var(--ui-divider)] ui:text-[var(--ui-text-strong)] ui:first:border-t-0 ui:first:pt-0',
            compact
              ? 'ui:pt-3 ui:text-[15px]'
              : 'ui:pt-4 ui:text-[15px] ui:md:text-base',
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
        </ListItem>
      ))}
    </List>
  );
}
