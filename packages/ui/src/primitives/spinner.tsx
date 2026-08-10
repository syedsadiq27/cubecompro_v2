import { cn } from '../lib/cn';

export function Spinner({
  size = 'md',
  label = 'Loading',
  className,
}: {
  size?: 'sm' | 'md';
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('ui:inline-flex ui:items-center ui:gap-2', className)}
    >
      <span
        aria-hidden
        className={cn(
          'ui-spinner ui:rounded-full ui:border-2 ui:border-[var(--ink)]/20 ui:border-t-[var(--ink)]',
          size === 'sm' && 'ui:h-4 ui:w-4',
          size === 'md' && 'ui:h-5 ui:w-5'
        )}
      />
      <span className="ui:sr-only">{label}</span>
    </div>
  );
}
