import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export function Display({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn('ui-type-display', className)} {...props} />;
}

export function PageTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn('ui-type-page', className)} {...props} />;
}

export function SectionTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('ui-type-section', className)} {...props} />;
}

export function Body({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('ui-type-body', className)} {...props} />;
}

export function Meta({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('ui-type-meta', className)} {...props} />;
}
