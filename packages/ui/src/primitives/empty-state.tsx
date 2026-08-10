import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Stage } from '../brand/stage';

export function EmptyState({
  title,
  description,
  action,
  stage = false,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  stage?: boolean;
  className?: string;
}) {
  const content = (
    <div
      className={cn(
        'ui:flex ui:flex-col ui:items-center ui:justify-center ui:px-6 ui:py-10 ui:text-center',
        className
      )}
    >
      <h3 className="ui:text-[16px] ui:font-semibold ui:tracking-[-0.015em] ui:text-[var(--ink)]">
        {title}
      </h3>
      {description ? (
        <p className="ui:mt-2 ui:max-w-[28rem] ui:text-[13px] ui:leading-relaxed ui:text-[var(--text-secondary)]">
          {description}
        </p>
      ) : null}
      {action ? <div className="ui:mt-5">{action}</div> : null}
    </div>
  );

  if (!stage) {
    return content;
  }

  return (
    <Stage size="cover" plane className="ui:rounded-[10px]">
      {content}
    </Stage>
  );
}
