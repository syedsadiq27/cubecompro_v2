import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';

export type TypographyVariant =
  | 'body'
  | 'bodyStrong'
  | 'support'
  | 'meta'
  | 'label'
  | 'mono'
  | 'code'
  | 'title'
  | 'titleSm'
  | 'titleLg';

export type TypographyTone =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'strong'
  | 'accent'
  | 'ink'
  | 'inherit';

type TypographyOwnProps<T extends ElementType> = {
  as?: T;
  variant?: TypographyVariant;
  tone?: TypographyTone;
  className?: string;
  children?: ReactNode;
};

export type TypographyProps<T extends ElementType = 'p'> =
  TypographyOwnProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof TypographyOwnProps<T>>;

function defaultElement(variant: TypographyVariant): ElementType {
  if (
    variant === 'title' ||
    variant === 'titleSm' ||
    variant === 'titleLg'
  ) {
    return 'h3';
  }
  return 'p';
}

function resolveTypographyClassName({
  variant = 'body',
  tone = 'default',
  className,
}: {
  variant?: TypographyVariant;
  tone?: TypographyTone;
  className?: string;
}): string {
  return cn(
    variant === 'body' &&
      'ui:text-[15px] ui:leading-relaxed',
    variant === 'bodyStrong' &&
      'ui:text-[15px] ui:leading-relaxed ui:font-medium',
    variant === 'support' &&
      'ui:text-sm ui:leading-relaxed',
    variant === 'meta' &&
      'ui:text-xs ui:leading-snug',
    variant === 'label' &&
      'ui:text-[11px] ui:font-medium ui:tracking-[0.1em] ui:uppercase',
    variant === 'mono' &&
      'ui:font-mono ui:text-[11px] ui:tracking-[0.14em] ui:uppercase',
    variant === 'code' &&
      'ui:font-mono ui:text-[11px] ui:tracking-[0.14em]',
    variant === 'title' &&
      'ui:font-[family-name:var(--font-display)] ui:text-[18px] ui:font-semibold ui:leading-snug ui:tracking-[-0.02em]',
    variant === 'titleSm' &&
      'ui:font-[family-name:var(--font-display)] ui:text-[17px] ui:font-semibold ui:leading-snug ui:tracking-[-0.02em]',
    variant === 'titleLg' &&
      'ui:font-[family-name:var(--font-display)] ui:text-[19px] ui:font-semibold ui:leading-snug ui:tracking-[-0.02em] ui:md:text-[20px]',
    tone === 'default' &&
      (variant === 'label' || variant === 'mono' || variant === 'meta'
        ? 'ui:text-[var(--text-muted)]'
        : variant === 'title' ||
            variant === 'titleSm' ||
            variant === 'titleLg' ||
            variant === 'bodyStrong' ||
            variant === 'code'
          ? 'ui:text-[var(--ink)]'
          : 'ui:text-[var(--text-secondary)]'),
    tone === 'secondary' && 'ui:text-[var(--text-secondary)]',
    tone === 'muted' && 'ui:text-[var(--text-muted)]',
    tone === 'strong' && 'ui:text-[var(--ink)]',
    tone === 'accent' && 'ui:text-[var(--stage-violet)]',
    tone === 'ink' &&
      (variant === 'label' || variant === 'mono' || variant === 'meta' || variant === 'code'
        ? 'ui:text-white/45'
        : 'ui:text-white'),
    tone === 'inherit' && 'ui:text-inherit',
    className
  );
}

export function Typography<T extends ElementType = 'p'>({
  as,
  variant = 'body',
  tone = 'default',
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as ?? defaultElement(variant);
  return (
    <Comp
      className={resolveTypographyClassName({ variant, tone, className })}
      {...props}
    />
  );
}

export function Display({
  className,
  ...props
}: ComponentPropsWithoutRef<'h1'>) {
  return <h1 className={cn('ui-type-display', className)} {...props} />;
}

export function PageTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<'h1'>) {
  return <h1 className={cn('ui-type-page', className)} {...props} />;
}

export function TextSectionTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<'h2'>) {
  return <h2 className={cn('ui-type-section', className)} {...props} />;
}

export function Body({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('ui-type-body', className)} {...props} />;
}

export function Meta({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('ui-type-meta', className)} {...props} />;
}
