import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { spaceBodyOffsetClass, type Space } from '../lib/space';
import type { SurfaceTone } from '../lib/tone';
import { Container, type ContainerPadding } from './container';
import {
  Eyebrow,
  Heading,
  Lede,
  type HeadingSpacing,
} from './heading';

export type SectionTone = Exclude<SurfaceTone, 'surface'>;
export type SectionSpacing = 'default' | 'compact' | 'cta' | 'softTop';
export type SectionBodyGap = Space;

function spacingToPadding(spacing: SectionSpacing): ContainerPadding {
  if (spacing === 'compact') return 'sectionCompact';
  if (spacing === 'cta') return 'cta';
  if (spacing === 'softTop') return 'sectionSoftTop';
  return 'section';
}

function resolveSectionClassName({
  tone = 'canvas',
  bordered = true,
  className,
}: {
  tone?: SectionTone;
  bordered?: boolean;
  className?: string;
}): string {
  return cn(
    bordered &&
      tone === 'ink' &&
      'ui:border-t ui:border-[var(--ink)] ui:bg-[var(--ink)]',
    bordered &&
      tone === 'soft' &&
      'ui:border-t ui:border-[var(--line)] ui:bg-[var(--surface)]',
    bordered &&
      tone === 'canvas' &&
      'ui:border-t ui:border-[var(--line)] ui:bg-[var(--canvas)]',
    !bordered && tone === 'ink' && 'ui:bg-[var(--ink)]',
    !bordered && tone === 'soft' && 'ui:bg-[var(--surface)]',
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
      data-surface-tone={tone}
      className={resolveSectionClassName({ tone, bordered, className })}
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
  spacing = 'none',
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & {
  spacing?: HeadingSpacing;
}) {
  return (
    <Heading
      as="h2"
      variant="section"
      spacing={spacing}
      className={className}
      {...props}
    />
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
        <SectionTitle spacing={eyebrow ? 'eyebrow' : 'none'}>
          {title}
        </SectionTitle>
      ) : null}
      {description ? (
        <SectionDescription>{description}</SectionDescription>
      ) : null}
    </div>
  );
}

export function SectionBody({
  gap = 'md',
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  gap?: SectionBodyGap;
}) {
  return (
    <div className={cn(spaceBodyOffsetClass(gap), className)} {...props} />
  );
}

export const Section = Object.assign(SectionRoot, {
  Header: SectionHeader,
  Eyebrow: SectionEyebrow,
  Title: SectionTitle,
  Description: SectionDescription,
  Body: SectionBody,
});
