import { FABRICS, FRAMES, LEGS } from '@/components/demo/sofa/catalog';
import type { ResolvedMaterials } from '@/components/demo/sofa/types';
import type { PcState } from './pc-logic';

export function materialsFromPcState(state: PcState): ResolvedMaterials {
  const fabric =
    state.fabric === 'walnut'
      ? FABRICS.find((item) => item.id === 'leather')!
      : state.fabric === 'charcoal'
        ? FABRICS.find((item) => item.id === 'charcoal')!
        : FABRICS.find((item) => item.id === 'beige')!;

  const legs =
    state.legs === 'brass'
      ? LEGS.find((item) => item.id === 'brass')!
      : state.legs === 'black'
        ? LEGS.find((item) => item.id === 'black-steel')!
        : LEGS.find((item) => item.id === 'oak')!;

  const frame =
    state.size === 'chaise'
      ? FRAMES.find((item) => item.id === 'oak')!
      : FRAMES.find((item) => item.id === 'walnut')!;

  return {
    frame: frame.material,
    fabric: fabric.material,
    legs: legs.material,
  };
}
