import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type FaqListItem = {
  question: string;
  answer: string;
};

export function FaqList({
  items,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  items: readonly FaqListItem[];
}) {
  return (
    <div
      className={cn(
        'ui:divide-y ui:divide-[var(--line)] ui:border-y ui:border-[var(--line)]',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <details key={item.question} className="ui:group ui:py-5">
          <summary className="ui:cursor-pointer ui:list-none ui:text-base ui:font-medium ui:tracking-tight ui:text-[var(--ui-text-strong)] ui:marker:content-none ui:[&::-webkit-details-marker]:hidden">
            <span className="ui:flex ui:items-start ui:justify-between ui:gap-6">
              {item.question}
              <span
                aria-hidden
                className="ui:mt-0.5 ui:shrink-0 ui:text-[var(--ui-text-muted)] ui:transition ui:group-open:rotate-45"
              >
                +
              </span>
            </span>
          </summary>
          <p className="ui:mt-3 ui:max-w-2xl ui:text-sm ui:leading-relaxed ui:text-[var(--ui-text)]">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
