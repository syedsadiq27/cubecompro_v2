import { DEFAULT_CONFIGURATION } from './catalog';
import { applyConstraints } from './rules';
import type { ConfigurationState, FabricId, FrameId, LegsId } from './types';

const FRAME_CODES: Record<FrameId, string> = {
  oak: 'o',
  walnut: 'w',
  black: 'b',
};

const FABRIC_CODES: Record<FabricId, string> = {
  beige: 'be',
  charcoal: 'ch',
  forest: 'fo',
  leather: 'le',
};

const LEGS_CODES: Record<LegsId, string> = {
  brass: 'br',
  'black-steel': 'bs',
  oak: 'ok',
};

const FRAME_FROM: Record<string, FrameId> = {
  o: 'oak',
  w: 'walnut',
  b: 'black',
};

const FABRIC_FROM: Record<string, FabricId> = {
  be: 'beige',
  ch: 'charcoal',
  fo: 'forest',
  le: 'leather',
};

const LEGS_FROM: Record<string, LegsId> = {
  br: 'brass',
  bs: 'black-steel',
  ok: 'oak',
};

export function encodeConfiguration(state: ConfigurationState): string {
  const constrained = applyConstraints(state);
  const payload = [
    FRAME_CODES[constrained.frame],
    FABRIC_CODES[constrained.fabric],
    LEGS_CODES[constrained.legs],
  ].join('');
  return payload;
}

export function decodeConfiguration(id: string): ConfigurationState | null {
  const normalized = id.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const frameCode = normalized.charAt(0);
  const fabricCode = normalized.slice(1, 3);
  const legsCode = normalized.slice(3, 5);

  if (!frameCode || !fabricCode || !legsCode) {
    return null;
  }

  const frame = FRAME_FROM[frameCode];
  const fabric = FABRIC_FROM[fabricCode];
  const legs = LEGS_FROM[legsCode];

  if (!frame || !fabric || !legs) {
    return null;
  }

  return applyConstraints({ frame, fabric, legs });
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
