import type {
  ElementType,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';

export type HeadingVariant =
  | 'display'
  | 'hero'
  | 'page'
  | 'pageTitle'
  | 'pageFeature'
  | 'pageSeo'
  | 'pageWide'
  | 'section'
  | 'panel'
  | 'doc';

export const marketingHeadingTiers = [
  { variant: 'hero', role: 'Homepage category hero' },
  { variant: 'page', role: 'Standard solution page' },
  {
    variant: 'pageFeature',
    role: 'Solution page with stronger visual or technical emphasis',
  },
  { variant: 'pageSeo', role: 'SEO, integration, or industry landing page' },
  { variant: 'pageWide', role: 'Utility marketing page (e.g. pricing)' },
  { variant: 'doc', role: 'Legal and document contexts' },
] as const satisfies ReadonlyArray<{
  variant: HeadingVariant;
  role: string;
}>;

export type HeadingSpacing = 'none' | 'eyebrow' | 'brand';

export type LedeVariant = 'default' | 'ink' | 'hero' | 'support';

function resolveHeadingClassName({
  variant = 'section',
  spacing = 'none',
  className,
}: {
  variant?: HeadingVariant;
  spacing?: HeadingSpacing;
  className?: string;
}): string {
  return cn(
    variant === 'display' &&
      'ui-type-display ui:text-[clamp(3rem,4.6vw,4.5rem)]',
    variant === 'hero' &&
      'ui-type-hero ui:max-w-[22ch] ui:text-[clamp(3.25rem,4.4vw,4.75rem)]',
    variant === 'page' &&
      'ui-type-page ui:max-w-[16ch] ui:text-[clamp(2.2rem,5.2vw,3.75rem)]',
    variant === 'pageTitle' && 'ui-type-page ui:text-[32px]',
    variant === 'pageFeature' &&
      'ui-type-page ui:max-w-[18ch] ui:text-[clamp(2.35rem,5.4vw,3.9rem)]',
    variant === 'pageSeo' &&
      'ui-type-page ui:max-w-[18ch] ui:text-[clamp(2.1rem,4.8vw,3.5rem)]',
    variant === 'pageWide' &&
      'ui-type-page ui:max-w-3xl ui:text-[clamp(2rem,4vw,3rem)]',
    variant === 'section' &&
      'ui-section-title ui-type-page ui:max-w-3xl ui:text-[clamp(1.85rem,3.5vw,2.65rem)]',
    variant === 'panel' && 'ui-type-panel ui:text-[21px]',
    variant === 'doc' &&
      'ui-type-page ui:text-[clamp(1.85rem,3.5vw,2.5rem)]',
    spacing === 'eyebrow' && 'ui:mt-3 ui:md:mt-4',
    spacing === 'brand' && 'ui:mt-6',
    className
  );
}

function resolveLedeClassName({
  variant = 'default',
  className,
}: {
  variant?: LedeVariant;
  className?: string;
}): string {
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

function resolveEyebrowClassName({
  className,
}: {
  className?: string;
}): string {
  return cn(
    'ui-section-eyebrow ui:text-xs ui:font-mono ui:font-semibold ui:uppercase ui:tracking-[0.1em] ui:text-[var(--stage-violet)]',
    className
  );
}

function defaultHeadingElement(variant: HeadingVariant): ElementType {
  if (
    variant === 'section' ||
    variant === 'doc' ||
    variant === 'panel'
  ) {
    return 'h2';
  }
  return 'h1';
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
  const Comp = (as ?? defaultHeadingElement(variant)) as ElementType;

  return (
    <Comp
      className={resolveHeadingClassName({ variant, spacing, className })}
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
  return (
    <p className={resolveLedeClassName({ variant, className })} {...props} />
  );
}

export function Eyebrow({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={resolveEyebrowClassName({ className })} {...props} />
  );
}

export function Display({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Heading as="h1" variant="display" className={className} {...props} />
  );
}

export function PageTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Heading as="h1" variant="pageTitle" className={className} {...props} />
  );
}

export function TextSectionTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Heading as="h2" variant="panel" className={className} {...props} />
  );
}
