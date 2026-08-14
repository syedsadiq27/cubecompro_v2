'use client';

import { COLORS, FITS, SIZES } from './catalog';
import type {
  ColorId,
  ConfigurationState,
  FitId,
  SizeId,
} from './types';

type OptionPanelProps = {
  state: ConfigurationState;
  onColor: (id: ColorId) => void;
  onFit: (id: FitId) => void;
  onSize: (id: SizeId) => void;
  isColorDisabled: (id: ColorId) => boolean;
  isFitDisabled: (id: FitId) => boolean;
  isSizeDisabled: (id: SizeId) => boolean;
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
  onColor,
  onFit,
  onSize,
  isColorDisabled,
  isFitDisabled,
  isSizeDisabled,
}: OptionPanelProps) {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="type-nav-label mb-3">Color</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {COLORS.map((color) => (
            <SwatchButton
              key={color.id}
              label={color.label}
              swatch={color.swatch}
              selected={state.color === color.id}
              disabled={isColorDisabled(color.id)}
              onClick={() => onColor(color.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="type-nav-label mb-3">Fit</h3>
        <div className="grid grid-cols-2 gap-2">
          {FITS.map((fit) => (
            <SwatchButton
              key={fit.id}
              label={fit.label}
              swatch={fit.swatch}
              selected={state.fit === fit.id}
              disabled={isFitDisabled(fit.id)}
              onClick={() => onFit(fit.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="type-nav-label mb-3">Size</h3>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => (
            <button
              key={size.id}
              type="button"
              disabled={isSizeDisabled(size.id)}
              onClick={() => onSize(size.id)}
              className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                state.size === size.id
                  ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
                  : 'border-[var(--border-strong)] bg-[var(--surface-pure)] text-[var(--ink)] hover:border-[var(--ink)]'
              } ${isSizeDisabled(size.id) ? 'cursor-not-allowed opacity-35' : ''}`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
