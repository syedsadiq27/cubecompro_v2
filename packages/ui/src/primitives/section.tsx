import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Container, type ContainerPadding } from './container';
import {
  Eyebrow,
  Heading,
  Lede,
} from './heading';

export type SectionTone = 'canvas' | 'muted' | 'ink';
export type SectionSpacing = 'default' | 'compact' | 'cta' | 'softTop';
export type SectionBodyGap =
  | 'default'
  | 'loose'
  | 'spacious'
  | 'tight'
  | 'compare'
  | 'none';

function spacingToPadding(spacing: SectionSpacing): ContainerPadding {
  if (spacing === 'compact') return 'sectionCompact';
  if (spacing === 'cta') return 'cta';
  if (spacing === 'softTop') return 'sectionSoftTop';
  return 'section';
}

export function sectionClassName({
  tone = 'canvas',
  bordered = true,
  className,
}: {
  tone?: SectionTone;
  bordered?: boolean;
  className?: string;
} = {}): string {
  return cn(
    bordered &&
      tone === 'ink' &&
      'ui:border-t ui:border-[var(--ink)] ui:bg-[var(--ink)] ui:text-[var(--canvas)]',
    bordered &&
      tone === 'muted' &&
      'ui:border-t ui:border-[var(--line)] ui:bg-[var(--surface)]',
    bordered &&
      tone === 'canvas' &&
      'ui:border-t ui:border-[var(--line)] ui:bg-[var(--canvas)]',
    !bordered &&
      tone === 'ink' &&
      'ui:bg-[var(--ink)] ui:text-[var(--canvas)]',
    !bordered && tone === 'muted' && 'ui:bg-[var(--surface)]',
    !bordered && tone === 'canvas' && 'ui:bg-[var(--canvas)]',
    className
  );
}

function SectionRoot({
  tone = 'canvas',
  spacing = 'default',
  bordered = true,
  id,
  className,
  containerClassName: containerClassNameProp,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  tone?: SectionTone;
  spacing?: SectionSpacing;
  bordered?: boolean;
  containerClassName?: string;
}) {
  return (
    <section
      id={id}
      data-section-tone={tone}
      className={sectionClassName({ tone, bordered, className })}
      {...props}
    >
      <Container
        padding={spacingToPadding(spacing)}
        className={containerClassNameProp}
      >
        {children}
      </Container>
    </section>
  );
}

export function SectionEyebrow({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <Eyebrow className={className} {...props} />;
}

export function SectionTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Heading as="h2" variant="section" className={className} {...props} />
  );
}

export function SectionDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <Lede variant="default" className={className} {...props} />;
}

export function SectionHeader({
  className,
  eyebrow,
  title,
  description,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
}) {
  if (children) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      {eyebrow ? <SectionEyebrow>{eyebrow}</SectionEyebrow> : null}
      {title ? (
        <SectionTitle className={eyebrow ? 'ui:mt-3' : undefined}>
          {title}
        </SectionTitle>
      ) : null}
      {description ? (
        <SectionDescription>{description}</SectionDescription>
      ) : null}
    </div>
  );
}

function bodyGapClass(gap: SectionBodyGap): string {
  if (gap === 'loose') return 'ui:mt-10';
  if (gap === 'spacious') return 'ui:mt-12';
  if (gap === 'tight') return 'ui:mt-6 ui:md:mt-8';
  if (gap === 'compare') return 'ui:mt-8 ui:md:mt-12';
  if (gap === 'none') return 'ui:mt-0';
  return 'ui:mt-8 ui:md:mt-10';
}

export function SectionBody({
  gap = 'default',
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  gap?: SectionBodyGap;
}) {
  return <div className={cn(bodyGapClass(gap), className)} {...props} />;
}

export const Section = Object.assign(SectionRoot, {
  Header: SectionHeader,
  Eyebrow: SectionEyebrow,
  Title: SectionTitle,
  Description: SectionDescription,
  Body: SectionBody,
});
