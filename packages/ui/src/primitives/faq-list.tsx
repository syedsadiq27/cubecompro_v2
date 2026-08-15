import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type FaqListVariant = 'rail' | 'stack';

export type FaqListItem = {
  question: string;
  answer: string;
};

export function FaqList({
  items,
  variant = 'stack',
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  items: readonly FaqListItem[];
  variant?: FaqListVariant;
}) {
  return (
    <div
      className={cn(
        variant === 'rail' &&
          'ui:divide-y ui:divide-[var(--line)] ui:border-y ui:border-[var(--line)]',
        variant === 'stack' && 'ui:space-y-0',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <details
          key={item.question}
          className={cn(
            'ui:group',
            variant === 'rail' && 'ui:py-5',
            variant === 'stack' &&
              'ui:border-t ui:border-[var(--line)] ui:first:border-t-0'
          )}
        >
          <summary
            className={cn(
              'ui:cursor-pointer ui:list-none ui:[&::-webkit-details-marker]:hidden',
              variant === 'rail' &&
                'ui:text-base ui:font-medium ui:tracking-tight ui:text-[var(--ink)] ui:marker:content-none',
              variant === 'stack' &&
                'ui:flex ui:items-center ui:justify-between ui:gap-4 ui:py-4 ui:text-left ui:font-[family-name:var(--font-display)] ui:text-[17px] ui:font-semibold ui:tracking-[-0.02em] ui:text-[var(--ink)] ui:md:text-[18px]'
            )}
          >
            {variant === 'rail' ? (
              <span className="ui:flex ui:items-start ui:justify-between ui:gap-6">
                {item.question}
                <span
                  aria-hidden
                  className="ui:mt-0.5 ui:shrink-0 ui:text-[var(--text-muted)] ui:transition ui:group-open:rotate-45"
                >
                  +
                </span>
              </span>
            ) : (
              <>
                <span>{item.question}</span>
                <span
                  className="ui:shrink-0 ui:font-mono ui:text-sm ui:text-[var(--text-muted)] ui:transition ui:group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </>
            )}
          </summary>
          <p
            className={cn(
              'ui:leading-relaxed ui:text-[var(--text-secondary)]',
              variant === 'rail' && 'ui:mt-3 ui:max-w-2xl ui:text-sm',
              variant === 'stack' &&
                'ui:pb-5 ui:text-sm ui:md:text-base'
            )}
          >
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
