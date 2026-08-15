import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { radiusClass } from '../lib/radius';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'inverse'
  | 'inverseSecondary';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'nav';

function resolveButtonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): string {
  return cn(
    'ui:inline-flex ui:items-center ui:justify-center ui:gap-2 ui:font-medium ui:transition ui:focus-visible:outline ui:focus-visible:outline-2 ui:focus-visible:outline-offset-2 ui:focus-visible:outline-[var(--brand)] ui:disabled:pointer-events-none ui:disabled:opacity-40',
    radiusClass('control'),
    size === 'sm' && 'ui:h-8 ui:px-3 ui:text-[12px]',
    size === 'md' && 'ui:h-9 ui:px-3.5 ui:text-[13px]',
    size === 'lg' && 'ui:h-11 ui:px-5 ui:text-sm',
    size === 'nav' &&
      'ui:px-3.5 ui:py-2 ui:text-xs ui:tracking-[0.04em]',
    variant === 'primary' &&
      'ui:bg-[var(--ink)] ui:text-white ui:hover:bg-[var(--ink)]/90',
    variant === 'secondary' &&
      'ui:border ui:border-[var(--border-strong)] ui:text-[var(--ink)] ui:hover:border-[var(--ink)]',
    variant === 'ghost' &&
      'ui:bg-transparent ui:text-[var(--ink)] ui:hover:bg-black/[0.04]',
    variant === 'danger' &&
      'ui:bg-[var(--danger)] ui:text-white ui:hover:bg-[var(--danger-hover)]',
    variant === 'inverse' &&
      'ui:bg-[var(--canvas)] ui:text-[var(--ink)] ui:hover:bg-white',
    variant === 'inverseSecondary' &&
      'ui:border ui:border-white/30 ui:text-[var(--canvas)] ui:hover:border-white/60',
    className
  );
}

type ButtonOwnProps<T extends ElementType> = {
  as?: T;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
};

export type ButtonProps<T extends ElementType = 'button'> = ButtonOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;

export function Button<T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Comp = as ?? 'button';
  const rest =
    Comp === 'button' && !('type' in props)
      ? { type: 'button' as const, ...props }
      : props;

  return (
    <Comp
      className={resolveButtonClassName({ variant, size, className })}
      {...rest}
    >
      {children}
    </Comp>
  );
}
