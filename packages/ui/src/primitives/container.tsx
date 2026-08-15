import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type ContainerPadding =
  | 'none'
  | 'section'
  | 'sectionCompact'
  | 'sectionSoftTop'
  | 'cta';

export function containerClassName({
  padding = 'none',
  className,
}: {
  padding?: ContainerPadding;
  className?: string;
} = {}): string {
  return cn(
    'ui:mx-auto ui:max-w-[90rem] ui:px-5 ui:md:px-8',
    padding === 'section' && 'ui:py-14 ui:md:py-20',
    padding === 'sectionCompact' && 'ui:py-10 ui:md:py-14',
    padding === 'sectionSoftTop' && 'ui:pt-10 ui:pb-14 ui:md:pb-20',
    padding === 'cta' && 'ui:py-10 ui:md:py-12',
    className
  );
}

export function Container({
  padding = 'none',
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  padding?: ContainerPadding;
}) {
  return (
    <div className={containerClassName({ padding, className })} {...props} />
  );
}
