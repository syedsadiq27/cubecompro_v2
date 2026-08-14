import { DEFAULT_CONFIGURATION } from './catalog';
import { applyConstraints } from './rules';
import type {
  ColorId,
  ConfigurationState,
  FitId,
  SizeId,
} from './types';

const COLOR_CODES: Record<ColorId, string> = {
  white: 'w',
  black: 'b',
  navy: 'n',
  heather: 'h',
  forest: 'f',
  red: 'r',
};

const FIT_CODES: Record<FitId, string> = {
  regular: 'g',
  oversized: 'o',
};

const SIZE_CODES: Record<SizeId, string> = {
  s: 's',
  m: 'm',
  l: 'l',
  xl: 'x',
};

const COLOR_FROM: Record<string, ColorId> = {
  w: 'white',
  b: 'black',
  n: 'navy',
  h: 'heather',
  f: 'forest',
  r: 'red',
};

const FIT_FROM: Record<string, FitId> = {
  g: 'regular',
  o: 'oversized',
};

const SIZE_FROM: Record<string, SizeId> = {
  s: 's',
  m: 'm',
  l: 'l',
  x: 'xl',
};

export function encodeConfiguration(state: ConfigurationState): string {
  const constrained = applyConstraints(state);
  return [
    COLOR_CODES[constrained.color],
    FIT_CODES[constrained.fit],
    SIZE_CODES[constrained.size],
  ].join('');
}

export function decodeConfiguration(id: string): ConfigurationState | null {
  const normalized = id.trim().toLowerCase();
  if (normalized.length < 3) {
    return null;
  }

  const color = COLOR_FROM[normalized[0]!];
  const fit = FIT_FROM[normalized[1]!];
  const size = SIZE_FROM[normalized[2]!];

  if (!color || !fit || !size) {
    return null;
  }

  return applyConstraints({ color, fit, size });
}

export function configurationFromShareId(
  id: string | undefined
): { state: ConfigurationState; restored: boolean } {
  if (!id) {
    return { state: DEFAULT_CONFIGURATION, restored: false };
  }

  const decoded = decodeConfiguration(id);
  if (!decoded) {
    return { state: DEFAULT_CONFIGURATION, restored: false };
  }

  return { state: decoded, restored: true };
}
