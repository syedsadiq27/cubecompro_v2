import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import type { TextTone } from '../lib/tone';

export type TypographyVariant =
  | 'body'
  | 'bodyStrong'
  | 'prose'
  | 'support'
  | 'meta'
  | 'label'
  | 'mono'
  | 'code'
  | 'title'
  | 'titleSm'
  | 'titleLg';

export type TypographyTone = TextTone;

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
    variant === 'body' && 'ui:text-[15px] ui:leading-relaxed',
    variant === 'bodyStrong' &&
      'ui:text-[15px] ui:leading-relaxed ui:font-medium',
    variant === 'prose' &&
      'ui:max-w-[34rem] ui:text-[14px] ui:leading-[1.55]',
    variant === 'support' && 'ui:text-sm ui:leading-relaxed',
    variant === 'meta' &&
      'ui:text-[12px] ui:font-[450] ui:leading-[1.4]',
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
        ? 'ui:text-[var(--ui-text-muted)]'
        : variant === 'title' ||
            variant === 'titleSm' ||
            variant === 'titleLg' ||
            variant === 'bodyStrong' ||
            variant === 'code'
          ? 'ui:text-[var(--ui-text-strong)]'
          : 'ui:text-[var(--ui-text)]'),
    tone === 'muted' && 'ui:text-[var(--ui-text-muted)]',
    tone === 'inverse' &&
      (variant === 'label' ||
      variant === 'mono' ||
      variant === 'meta' ||
      variant === 'code'
        ? 'ui:text-white/45'
        : 'ui:text-white'),
    tone === 'accent' && 'ui:text-[var(--stage-violet)]',
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

export function Body({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>) {
  return <Typography variant="prose" className={className} {...props} />;
}

export function Meta({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>) {
  return <Typography variant="meta" className={className} {...props} />;
}
