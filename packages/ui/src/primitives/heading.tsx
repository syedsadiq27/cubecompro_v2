import type {
  ElementType,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';

export type HeadingVariant =
  | 'hero'
  | 'page'
  | 'pageFeature'
  | 'pageSeo'
  | 'pageWide'
  | 'section'
  | 'doc';

export type HeadingSpacing = 'none' | 'eyebrow' | 'brand';

export type LedeVariant = 'default' | 'ink' | 'hero' | 'support';

export function headingClassName({
  variant = 'section',
  spacing = 'none',
  className,
}: {
  variant?: HeadingVariant;
  spacing?: HeadingSpacing;
  className?: string;
} = {}): string {
  return cn(
    variant === 'hero' &&
      'ui-type-display ui:max-w-[14ch] ui:text-[clamp(2.15rem,4.6vw,3.35rem)]',
    variant === 'page' &&
      'ui-type-page ui:max-w-[16ch] ui:text-[clamp(2.2rem,5.2vw,3.75rem)]',
    variant === 'pageFeature' &&
      'ui-type-page ui:max-w-[18ch] ui:text-[clamp(2.35rem,5.4vw,3.9rem)]',
    variant === 'pageSeo' &&
      'ui-type-page ui:max-w-[18ch] ui:text-[clamp(2.1rem,4.8vw,3.5rem)]',
    variant === 'pageWide' &&
      'ui-type-page ui:max-w-3xl ui:text-[clamp(2rem,4vw,3rem)]',
    variant === 'section' &&
      'ui-section-title ui-type-page ui:max-w-3xl ui:text-[clamp(1.85rem,3.5vw,2.65rem)]',
    variant === 'doc' &&
      'ui-type-page ui:text-[clamp(1.85rem,3.5vw,2.5rem)]',
    spacing === 'eyebrow' && 'ui:mt-3 ui:md:mt-4',
    spacing === 'brand' && 'ui:mt-6',
    className
  );
}

export function ledeClassName({
  variant = 'default',
  className,
}: {
  variant?: LedeVariant;
  className?: string;
} = {}): string {
  return cn(
    variant === 'default' &&
      'ui-section-description ui:mt-4 ui:max-w-xl ui:text-base ui:leading-relaxed',
    variant === 'ink' &&
      'ui:mt-4 ui:max-w-2xl ui:text-base ui:leading-relaxed ui:text-white/60',
    variant === 'hero' &&
      'ui:mt-4 ui:max-w-lg ui:text-[15px] ui:leading-relaxed ui:text-[var(--text-secondary)] ui:md:mt-5 ui:md:text-lg',
    variant === 'support' &&
      'ui:mt-6 ui:max-w-lg ui:text-base ui:leading-relaxed ui:text-[var(--text-secondary)] ui:md:text-[17px]',
    className
  );
}

export function eyebrowClassName({
  className,
}: {
  className?: string;
} = {}): string {
  return cn('ui-section-eyebrow ui:text-sm', className);
}

export function Heading({
  as,
  variant = 'section',
  spacing = 'none',
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2' | 'h3';
  variant?: HeadingVariant;
  spacing?: HeadingSpacing;
  children?: ReactNode;
}) {
  const Comp = (as ??
    (variant === 'section' || variant === 'doc' ? 'h2' : 'h1')) as ElementType;

  return (
    <Comp
      className={headingClassName({ variant, spacing, className })}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Lede({
  variant = 'default',
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & {
  variant?: LedeVariant;
}) {
  return <p className={ledeClassName({ variant, className })} {...props} />;
}

export function Eyebrow({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={eyebrowClassName({ className })} {...props} />;
}
