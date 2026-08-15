import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { spaceGapClass, type Space } from '../lib/space';

export type StackDirection = 'col' | 'row';
export type StackGap = Space;
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around';

type StackOwnProps<T extends ElementType> = {
  as?: T;
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  className?: string;
  children?: ReactNode;
};

export type StackProps<T extends ElementType = 'div'> = StackOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof StackOwnProps<T>>;

export function Stack<T extends ElementType = 'div'>({
  as,
  direction = 'col',
  gap = 'md',
  align,
  justify,
  wrap = false,
  className,
  ...props
}: StackProps<T>) {
  const Comp = as ?? 'div';
  return (
    <Comp
      className={cn(
        'ui:flex',
        direction === 'col' && 'ui:flex-col',
        direction === 'row' && 'ui:flex-row',
        wrap && 'ui:flex-wrap',
        spaceGapClass(gap),
        align === 'start' && 'ui:items-start',
        align === 'center' && 'ui:items-center',
        align === 'end' && 'ui:items-end',
        align === 'stretch' && 'ui:items-stretch',
        align === 'baseline' && 'ui:items-baseline',
        justify === 'start' && 'ui:justify-start',
        justify === 'center' && 'ui:justify-center',
        justify === 'end' && 'ui:justify-end',
        justify === 'between' && 'ui:justify-between',
        justify === 'around' && 'ui:justify-around',
        className
      )}
      {...props}
    />
  );
}
