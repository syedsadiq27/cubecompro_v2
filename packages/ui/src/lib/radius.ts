export type RadiusToken = 'control' | 'panel' | 'card';

export type CardRadius = 'sm' | 'md' | 'lg';

export function radiusClass(radius: RadiusToken): string {
  if (radius === 'control') return 'ui:rounded-[7px]';
  if (radius === 'panel') return 'ui:rounded-[10px]';
  return 'ui:rounded-2xl';
}

export function cardRadiusClass(radius: CardRadius): string {
  if (radius === 'sm') return radiusClass('control');
  if (radius === 'md') return radiusClass('panel');
  return radiusClass('card');
}
