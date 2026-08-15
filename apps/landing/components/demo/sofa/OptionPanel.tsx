'use client';

import {
  OptionCard,
  SwatchButton,
} from '@/components/demo/shared/OptionControls';
import { FABRICS, FRAMES, LEGS } from './catalog';
import type {
  ConfigurationState,
  FabricId,
  FrameId,
  LegsId,
} from './types';

type OptionPanelProps = {
  state: ConfigurationState;
  onFrame: (id: FrameId) => void;
  onFabric: (id: FabricId) => void;
  onLegs: (id: LegsId) => void;
  isFrameDisabled: (id: FrameId) => boolean;
  isFabricDisabled: (id: FabricId) => boolean;
  isLegsDisabled: (id: LegsId) => boolean;
};

export function OptionPanel({
  state,
  onFrame,
  onFabric,
  onLegs,
  isFrameDisabled,
  isFabricDisabled,
  isLegsDisabled,
}: OptionPanelProps) {
  return (
    <div className="space-y-3">
      <OptionCard
        label="Frame"
        value={FRAMES.find((frame) => frame.id === state.frame)?.label ?? ''}
        open
      >
        {FRAMES.map((frame) => (
          <SwatchButton
            key={frame.id}
            label={frame.label}
            swatch={frame.swatch}
            selected={state.frame === frame.id}
            disabled={isFrameDisabled(frame.id)}
            onClick={() => onFrame(frame.id)}
          />
        ))}
      </OptionCard>

      <OptionCard
        label="Fabric"
        value={FABRICS.find((fabric) => fabric.id === state.fabric)?.label ?? ''}
      >
        {FABRICS.map((fabric) => (
          <SwatchButton
            key={fabric.id}
            label={fabric.label}
            swatch={fabric.swatch}
            selected={state.fabric === fabric.id}
            disabled={isFabricDisabled(fabric.id)}
            onClick={() => onFabric(fabric.id)}
          />
        ))}
      </OptionCard>

      <OptionCard
        label="Legs"
        value={LEGS.find((leg) => leg.id === state.legs)?.label ?? ''}
      >
        {LEGS.map((leg) => (
          <SwatchButton
            key={leg.id}
            label={leg.label}
            swatch={leg.swatch}
            selected={state.legs === leg.id}
            disabled={isLegsDisabled(leg.id)}
            onClick={() => onLegs(leg.id)}
          />
        ))}
      </OptionCard>
    </div>
  );
}
