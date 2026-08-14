export type PcFabricId = 'beige' | 'walnut' | 'charcoal';
export type PcSizeId = 'two' | 'three' | 'chaise';
export type PcLegsId = 'brass' | 'black' | 'walnut';

export type PcState = {
  fabric: PcFabricId;
  size: PcSizeId;
  legs: PcLegsId;
};

export const PC_FABRICS: Array<{
  id: PcFabricId;
  label: string;
  code: string;
  swatch: string;
}> = [
  { id: 'beige', label: 'Beige', code: 'BEI', swatch: '#D4C4A8' },
  { id: 'walnut', label: 'Walnut leather', code: 'WAL', swatch: '#6B3E2E' },
  { id: 'charcoal', label: 'Charcoal', code: 'CHA', swatch: '#3D3F44' },
];

export const PC_SIZES: Array<{ id: PcSizeId; label: string; code: string }> = [
  { id: 'two', label: '2-seat', code: '2' },
  { id: 'three', label: '3-seat', code: '3' },
  { id: 'chaise', label: 'Chaise', code: 'CHS' },
];

export const PC_LEGS: Array<{
  id: PcLegsId;
  label: string;
  code: string;
  swatch: string;
}> = [
  { id: 'brass', label: 'Brass', code: 'BRS', swatch: '#B08D57' },
  { id: 'black', label: 'Black', code: 'BLK', swatch: '#2A2A2A' },
  { id: 'walnut', label: 'Walnut', code: 'WAL', swatch: '#C4A574' },
];

export const PC_DEFAULT: PcState = {
  fabric: 'beige',
  size: 'three',
  legs: 'brass',
};

export function isFabricBlocked(state: PcState, id: PcFabricId) {
  if (state.size === 'two' && id === 'walnut') return true;
  if (state.legs === 'brass' && id === 'charcoal') return true;
  return false;
}

export function isSizeBlocked(state: PcState, id: PcSizeId) {
  return state.fabric === 'walnut' && id === 'two';
}

export function isLegsBlocked(state: PcState, id: PcLegsId) {
  if (state.size === 'chaise' && id === 'brass') return true;
  if (state.fabric === 'walnut' && id === 'black') return true;
  return false;
}

export function describeBlock(state: PcState): string | null {
  if (state.legs === 'brass') {
    return 'Brass legs block Charcoal fabric';
  }
  if (state.size === 'chaise') {
    return 'Chaise blocks Brass legs';
  }
  if (state.fabric === 'walnut') {
    return 'Walnut leather blocks 2-seat and Black legs';
  }
  if (state.size === 'two') {
    return '2-seat blocks Walnut leather';
  }
  return null;
}

export function applyPcConstraints(next: PcState): {
  state: PcState;
  rewritten: string | null;
} {
  let state = { ...next };
  let rewritten: string | null = null;

  if (isFabricBlocked(state, state.fabric)) {
    rewritten = `Fabric reset · ${state.fabric} invalid with current legs/size`;
    state = { ...state, fabric: 'beige' };
  }
  if (isSizeBlocked(state, state.size)) {
    rewritten = 'Size reset · 2-seat invalid with walnut leather';
    state = { ...state, size: 'three' };
  }
  if (isLegsBlocked(state, state.legs)) {
    rewritten = 'Legs reset · selection invalid with current fabric/size';
    state = { ...state, legs: 'walnut' };
  }

  return { state, rewritten };
}

export function explainBlocked(
  state: PcState,
  group: 'fabric' | 'size' | 'legs',
  id: string
): string | null {
  if (group === 'fabric' && id === 'charcoal' && state.legs === 'brass') {
    return 'Blocked: Charcoal is incompatible with Brass legs';
  }
  if (group === 'fabric' && id === 'walnut' && state.size === 'two') {
    return 'Blocked: Walnut leather is incompatible with 2-seat';
  }
  if (group === 'size' && id === 'two' && state.fabric === 'walnut') {
    return 'Blocked: 2-seat is incompatible with Walnut leather';
  }
  if (group === 'legs' && id === 'brass' && state.size === 'chaise') {
    return 'Blocked: Brass legs are incompatible with Chaise';
  }
  if (group === 'legs' && id === 'black' && state.fabric === 'walnut') {
    return 'Blocked: Black legs are incompatible with Walnut leather';
  }
  return null;
}

export function resolvePc(state: PcState) {
  const fabric = PC_FABRICS.find((item) => item.id === state.fabric)!;
  const size = PC_SIZES.find((item) => item.id === state.size)!;
  const legs = PC_LEGS.find((item) => item.id === state.legs)!;
  const sku = `SF-${size.code}-${fabric.code}-${legs.code}`;
  const price =
    1899 +
    (state.size === 'three' ? 500 : state.size === 'chaise' ? 700 : 0) +
    (state.fabric === 'walnut' ? 280 : state.fabric === 'charcoal' ? 120 : 0) +
    (state.legs === 'brass' ? 80 : 0);
  const inventory =
    sku === 'SF-3-BEI-BRS' ? 4 : sku === 'SF-CHS-CHA-WAL' ? 0 : 11;

  return {
    sku,
    price,
    inventory,
    valid: true,
    labels: {
      fabric: fabric.label,
      size: size.label,
      legs: legs.label,
    },
    swatches: {
      fabric: fabric.swatch,
      legs: legs.swatch,
    },
  };
}
