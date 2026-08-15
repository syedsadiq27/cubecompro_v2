import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'inverse'
  | 'inverseSecondary';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'nav';

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  const marketing = size === 'lg' || size === 'nav';

  return cn(
    'ui:inline-flex ui:items-center ui:justify-center ui:gap-2 ui:font-medium ui:transition ui:focus-visible:outline ui:focus-visible:outline-2 ui:focus-visible:outline-offset-2 ui:focus-visible:outline-[var(--ink)] ui:disabled:pointer-events-none ui:disabled:opacity-40',
    size === 'sm' && 'ui:h-8 ui:rounded-[7px] ui:px-3 ui:text-[12px]',
    size === 'md' && 'ui:h-9 ui:rounded-[7px] ui:px-3.5 ui:text-[13px]',
    size === 'lg' && 'ui:rounded-lg ui:px-5 ui:py-3 ui:text-sm',
    size === 'nav' &&
      'ui:rounded-lg ui:px-3.5 ui:py-2 ui:text-xs ui:tracking-[0.04em]',
    !marketing &&
      variant === 'primary' &&
      'ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black',
    !marketing &&
      variant === 'secondary' &&
      'ui:border ui:border-[var(--line)] ui:bg-[var(--surface-pure)] ui:text-[var(--ink)] ui:hover:border-[var(--border-strong)] ui:hover:bg-[var(--surface)]',
    !marketing &&
      variant === 'ghost' &&
      'ui:bg-transparent ui:text-[var(--ink)] ui:hover:bg-black/[0.04]',
    !marketing &&
      variant === 'danger' &&
      'ui:bg-[var(--danger)] ui:text-white ui:hover:bg-[#b03e3e]',
    marketing &&
      variant === 'primary' &&
      'ui:bg-[var(--ink)] ui:text-white ui:hover:bg-[var(--ink)]/90',
    marketing &&
      variant === 'secondary' &&
      'ui:border ui:border-[var(--border-strong)] ui:text-[var(--ink)] ui:hover:border-[var(--ink)]',
    marketing &&
      variant === 'ghost' &&
      'ui:bg-transparent ui:text-[var(--ink)] ui:hover:bg-black/[0.04]',
    marketing &&
      variant === 'danger' &&
      'ui:bg-[var(--danger)] ui:text-white ui:hover:bg-[#b03e3e]',
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
      className={buttonClassName({ variant, size, className })}
      {...rest}
    >
      {children}
    </Comp>
  );
}
