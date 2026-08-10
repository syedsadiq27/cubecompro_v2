import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Surface } from './surface';

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <Surface className={cn('ui:p-5', className)} {...props}>
      {title || description || actions ? (
        <div className="ui:mb-4 ui:flex ui:items-start ui:justify-between ui:gap-4">
          <div className="ui:min-w-0">
            {title ? (
              <h3 className="ui:text-[16px] ui:font-semibold ui:tracking-[-0.015em] ui:text-[var(--ink)]">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="ui:mt-1 ui:text-[13px] ui:text-[var(--text-secondary)]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="ui:shrink-0 ui:flex ui:items-center ui:gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}
      {children}
    </Surface>
  );
}
