import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';

export type CardVariant = 'default' | 'soft' | 'surface' | 'muted' | 'ink';
export type CardPadding = 'none' | 'md' | 'sm' | 'tight' | 'chip';

type CardOwnProps<T extends ElementType> = {
  as?: T;
  variant?: CardVariant;
  padding?: CardPadding;
  inset?: boolean;
  className?: string;
  children?: ReactNode;
};

export type CardProps<T extends ElementType = 'div'> = CardOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps<T>>;

function resolveCardClassName({
  variant = 'default',
  padding = 'none',
  inset = false,
  className,
}: {
  variant?: CardVariant;
  padding?: CardPadding;
  inset?: boolean;
  className?: string;
}): string {
  return cn(
    !inset && variant === 'default' &&
      'ui:rounded-2xl ui:border ui:border-[var(--border-strong)] ui:bg-[var(--surface-pure)]',
    !inset && variant === 'soft' &&
      'ui:rounded-2xl ui:border ui:border-[var(--line)] ui:bg-[var(--surface-pure)]',
    !inset && variant === 'surface' &&
      'ui:rounded-2xl ui:border ui:border-[var(--line)] ui:bg-[var(--surface)]',
    !inset && variant === 'muted' &&
      'ui:rounded-xl ui:border ui:border-[var(--line)] ui:border-t-[2.5px] ui:border-t-[var(--ink)] ui:bg-[var(--surface)]',
    !inset && variant === 'ink' &&
      'ui:rounded-2xl ui:border ui:border-[var(--ink)] ui:bg-[var(--ink)] ui:text-white',
    inset && variant === 'default' && 'ui:bg-[var(--surface-pure)]',
    inset && variant === 'soft' && 'ui:bg-[var(--surface-pure)]',
    inset && variant === 'surface' && 'ui:bg-[var(--surface)]',
    inset && variant === 'muted' && 'ui:bg-[var(--surface)]',
    inset && variant === 'ink' && 'ui:bg-[var(--ink)] ui:text-white',
    padding === 'md' && 'ui:p-6 ui:md:p-7',
    padding === 'sm' && 'ui:px-5 ui:py-4 ui:md:px-6',
    padding === 'tight' && 'ui:p-5',
    padding === 'chip' && 'ui:px-4 ui:py-3',
    className
  );
}

export function Card<T extends ElementType = 'div'>({
  as,
  variant = 'default',
  padding = 'none',
  inset = false,
  className,
  ...props
}: CardProps<T>) {
  const Comp = as ?? 'div';
  return (
    <Comp
      className={resolveCardClassName({
        variant,
        padding,
        inset,
        className,
      })}
      {...props}
    />
  );
}

export function DarkPanel({
  variant: _variant,
  ...props
}: Omit<CardProps, 'variant'> & { variant?: never }) {
  return <Card variant="ink" {...props} />;
}
