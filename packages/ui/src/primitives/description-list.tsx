import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { spaceGapClass, type Space } from '../lib/space';

type DescriptionListOwnProps<T extends ElementType> = {
  as?: T;
  gap?: Space;
  className?: string;
  children?: ReactNode;
};

export type DescriptionListProps<T extends ElementType = 'dl'> =
  DescriptionListOwnProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof DescriptionListOwnProps<T>>;

export function DescriptionList<T extends ElementType = 'dl'>({
  as,
  gap = 'md',
  className,
  ...props
}: DescriptionListProps<T>) {
  const Comp = as ?? 'dl';
  return (
    <Comp
      className={cn('ui:grid', spaceGapClass(gap), className)}
      {...props}
    />
  );
}

type DescriptionTermOwnProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
};

export type DescriptionTermProps<T extends ElementType = 'dt'> =
  DescriptionTermOwnProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof DescriptionTermOwnProps<T>>;

export function DescriptionTerm<T extends ElementType = 'dt'>({
  as,
  className,
  ...props
}: DescriptionTermProps<T>) {
  const Comp = as ?? 'dt';
  return <Comp className={cn(className)} {...props} />;
}

type DescriptionDetailsOwnProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
};

export type DescriptionDetailsProps<T extends ElementType = 'dd'> =
  DescriptionDetailsOwnProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof DescriptionDetailsOwnProps<T>>;

export function DescriptionDetails<T extends ElementType = 'dd'>({
  as,
  className,
  ...props
}: DescriptionDetailsProps<T>) {
  const Comp = as ?? 'dd';
  return <Comp className={cn(className)} {...props} />;
}
