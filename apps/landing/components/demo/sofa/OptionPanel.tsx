'use client';

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

function SwatchButton({
  label,
  swatch,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  swatch: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`group flex flex-col items-start gap-2 rounded-lg border px-3 py-2.5 text-left transition ${
        selected
          ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
          : 'border-[var(--border-strong)] bg-[var(--surface-pure)] text-[var(--ink)] hover:border-[var(--ink)]'
      } ${disabled ? 'cursor-not-allowed opacity-35' : ''}`}
    >
      <span
        className="h-5 w-5 rounded-full border border-black/10 shadow-inner"
        style={{ backgroundColor: swatch }}
      />
      <span className="text-xs font-medium tracking-wide">{label}</span>
    </button>
  );
}

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
    <div className="space-y-6">
      <section>
        <h3 className="type-nav-label mb-3">Frame</h3>
        <div className="grid grid-cols-3 gap-2">
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
        </div>
      </section>

      <section>
        <h3 className="type-nav-label mb-3">Fabric</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
        </div>
      </section>

      <section>
        <h3 className="type-nav-label mb-3">Legs</h3>
        <div className="grid grid-cols-3 gap-2">
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
        </div>
      </section>
    </div>
  );
}
