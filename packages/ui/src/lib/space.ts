export type Space = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export function spaceGapClass(space: Space): string {
  if (space === 'none') return 'ui:gap-0';
  if (space === 'xs') return 'ui:gap-2';
  if (space === 'sm') return 'ui:gap-3';
  if (space === 'md') return 'ui:gap-4';
  if (space === 'lg') return 'ui:gap-6';
  return 'ui:gap-8';
}

export function spaceBodyOffsetClass(space: Space): string {
  if (space === 'none') return 'ui:mt-0';
  if (space === 'xs') return 'ui:mt-4';
  if (space === 'sm') return 'ui:mt-6 ui:md:mt-8';
  if (space === 'md') return 'ui:mt-8 ui:md:mt-10';
  if (space === 'lg') return 'ui:mt-10';
  return 'ui:mt-12';
}
