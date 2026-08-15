import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { spaceGapClass, type Space } from '../lib/space';

export type GridCols =
  | 1
  | 2
  | 3
  | 4
  | 'md-2'
  | 'md-3'
  | 'lg-2'
  | 'lg-3'
  | 'sm-2-lg-3'
  | 'sm-2-lg-4'
  | 'sm-2-md-3'
  | 'md-2-lg-3';

export type GridGap = Space;

type GridOwnProps<T extends ElementType> = {
  as?: T;
  cols?: GridCols;
  gap?: GridGap;
  className?: string;
  children?: ReactNode;
};

export type GridProps<T extends ElementType = 'div'> = GridOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof GridOwnProps<T>>;

export function Grid<T extends ElementType = 'div'>({
  as,
  cols = 1,
  gap = 'md',
  className,
  ...props
}: GridProps<T>) {
  const Comp = as ?? 'div';
  return (
    <Comp
      className={cn(
        'ui:grid',
        cols === 1 && 'ui:grid-cols-1',
        cols === 2 && 'ui:grid-cols-2',
        cols === 3 && 'ui:grid-cols-3',
        cols === 4 && 'ui:grid-cols-4',
        cols === 'md-2' && 'ui:grid-cols-1 ui:md:grid-cols-2',
        cols === 'md-3' && 'ui:grid-cols-1 ui:md:grid-cols-3',
        cols === 'lg-2' && 'ui:grid-cols-1 ui:lg:grid-cols-2',
        cols === 'lg-3' && 'ui:grid-cols-1 ui:lg:grid-cols-3',
        cols === 'sm-2-lg-3' &&
          'ui:grid-cols-1 ui:sm:grid-cols-2 ui:lg:grid-cols-3',
        cols === 'sm-2-lg-4' &&
          'ui:grid-cols-1 ui:sm:grid-cols-2 ui:lg:grid-cols-4',
        cols === 'sm-2-md-3' &&
          'ui:grid-cols-1 ui:sm:grid-cols-2 ui:md:grid-cols-3',
        cols === 'md-2-lg-3' &&
          'ui:grid-cols-1 ui:md:grid-cols-2 ui:lg:grid-cols-3',
        spaceGapClass(gap),
        className
      )}
      {...props}
    />
  );
}
