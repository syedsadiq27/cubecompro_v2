import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { cardRadiusClass, type CardRadius } from '../lib/radius';
import type { SurfaceTone } from '../lib/tone';

export type CardTone = SurfaceTone;
export type CardPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg';
export type { CardRadius };

type CardOwnProps<T extends ElementType> = {
  as?: T;
  tone?: CardTone;
  padding?: CardPadding;
  radius?: CardRadius;
  inset?: boolean;
  className?: string;
  children?: ReactNode;
};

export type CardProps<T extends ElementType = 'div'> = CardOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps<T>>;

function cardPaddingClass(padding: CardPadding): string | false {
  if (padding === 'xs') return 'ui:px-4 ui:py-3';
  if (padding === 'sm') return 'ui:p-5';
  if (padding === 'md') return 'ui:p-6 ui:md:p-7';
  if (padding === 'lg') return 'ui:p-5 ui:md:p-8';
  return false;
}

function resolveCardClassName({
  tone = 'surface',
  padding = 'none',
  radius = 'lg',
  inset = false,
  className,
}: {
  tone?: CardTone;
  padding?: CardPadding;
  radius?: CardRadius;
  inset?: boolean;
  className?: string;
}): string {
  return cn(
    !inset && cardRadiusClass(radius),
    !inset &&
      tone === 'surface' &&
      'ui:border ui:border-[var(--border-strong)] ui:bg-[var(--surface-pure)]',
    !inset &&
      tone === 'soft' &&
      'ui:border ui:border-[var(--line)] ui:bg-[var(--surface)]',
    !inset &&
      tone === 'canvas' &&
      'ui:border ui:border-[var(--line)] ui:bg-[var(--canvas)]',
    !inset &&
      tone === 'ink' &&
      'ui:border ui:border-[var(--ink)] ui:bg-[var(--ink)]',
    inset && tone === 'surface' && 'ui:bg-[var(--surface-pure)]',
    inset && tone === 'soft' && 'ui:bg-[var(--surface)]',
    inset && tone === 'canvas' && 'ui:bg-[var(--canvas)]',
    inset && tone === 'ink' && 'ui:bg-[var(--ink)]',
    cardPaddingClass(padding),
    className
  );
}

export function Card<T extends ElementType = 'div'>({
  as,
  tone = 'surface',
  padding = 'none',
  radius = 'lg',
  inset = false,
  className,
  ...props
}: CardProps<T>) {
  const Comp = as ?? 'div';
  return (
    <Comp
      data-surface-tone={tone}
      className={resolveCardClassName({
        tone,
        padding,
        radius,
        inset,
        className,
      })}
      {...props}
    />
  );
}
