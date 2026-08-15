import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { spaceGapClass, type Space } from '../lib/space';

export type ListGap = Space;
export type ListDirection = 'col' | 'row';

type ListOwnProps<T extends ElementType> = {
  as?: T;
  direction?: ListDirection;
  gap?: ListGap;
  wrap?: boolean;
  className?: string;
  children?: ReactNode;
};

export type ListProps<T extends ElementType = 'ul'> = ListOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ListOwnProps<T>>;

export function List<T extends ElementType = 'ul'>({
  as,
  direction = 'col',
  gap = 'sm',
  wrap = false,
  className,
  ...props
}: ListProps<T>) {
  const Comp = as ?? 'ul';
  return (
    <Comp
      className={cn(
        'ui:m-0 ui:list-none ui:p-0',
        direction === 'col' && 'ui:flex ui:flex-col',
        direction === 'row' && 'ui:flex ui:flex-row',
        wrap && 'ui:flex-wrap',
        spaceGapClass(gap),
        className
      )}
      {...props}
    />
  );
}

type ListItemOwnProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
};

export type ListItemProps<T extends ElementType = 'li'> = ListItemOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ListItemOwnProps<T>>;

export function ListItem<T extends ElementType = 'li'>({
  as,
  className,
  ...props
}: ListItemProps<T>) {
  const Comp = as ?? 'li';
  return <Comp className={cn(className)} {...props} />;
}
