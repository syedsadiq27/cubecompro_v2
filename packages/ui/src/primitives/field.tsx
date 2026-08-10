import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Label } from './label';

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('ui:flex ui:flex-col ui:gap-1.5', className)}>
      {label ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      {children}
      {error ? (
        <p className="ui:text-[12px] ui:text-[var(--danger)]">{error}</p>
      ) : hint ? (
        <p className="ui:text-[12px] ui:text-[var(--text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}
