import { cn } from '@repo/ui';
import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import Link from 'next/link';

export function OpsTable({
  children,
  minWidth = 560,
  className,
}: {
  children: ReactNode;
  minWidth?: number;
  className?: string;
}) {
  return (
    <div className={cn('overflow-x-auto rounded border border-[var(--line)]', className)}>
      <table
        className="w-full border-collapse text-left text-[12px]"
        style={{ minWidth }}
      >
        {children}
      </table>
    </div>
  );
}

export function OpsThead({ children }: { children: ReactNode }) {
  return (
    <thead className="sticky top-0 bg-[var(--surface)] text-[10px] font-semibold tracking-[0.04em] text-[var(--text-muted)] uppercase">
      {children}
    </thead>
  );
}

export function OpsTh({
  className,
  align = 'left',
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & {
  align?: 'left' | 'right' | 'center';
}) {
  return (
    <th
      className={cn(
        'px-2.5 py-1.5 font-semibold',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className
      )}
      {...props}
    />
  );
}

export function OpsTd({
  className,
  numeric,
  muted,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & {
  numeric?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      className={cn(
        'px-2.5 py-1.5',
        numeric && 'tabular-nums',
        muted ? 'text-[var(--text-muted)]' : 'text-[var(--text-secondary)]',
        className
      )}
      {...props}
    />
  );
}

export function OpsRow({
  selected,
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & {
  selected?: boolean;
}) {
  return (
    <tr
      className={cn(
        'border-t border-[var(--line)]',
        selected
          ? 'bg-[var(--brand-soft)]/40 shadow-[inset_2px_0_0_0_var(--brand)]'
          : 'bg-[var(--surface-pure)] hover:bg-[var(--canvas)]/60',
        className
      )}
      {...props}
    />
  );
}

export function OpsIdentity({
  title,
  subtitle,
  href,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  href?: string;
}) {
  const name = href ? (
    <Link
      href={href}
      className="font-medium text-[var(--ink)] hover:underline"
    >
      {title}
    </Link>
  ) : (
    <span className="font-medium text-[var(--ink)]">{title}</span>
  );

  return (
    <div className="min-w-0">
      {name}
      {subtitle != null && subtitle !== '' ? (
        <div className="truncate text-[10px] text-[var(--text-muted)]">
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

export function OpsActionsCell({ children }: { children: ReactNode }) {
  return (
    <td className="px-2.5 py-1.5 text-right">
      <div className="inline-flex items-center justify-end gap-1">{children}</div>
    </td>
  );
}
