'use client';

import {
  ChoiceButton,
  OptionCard,
  SwatchButton,
} from '@/components/demo/shared/OptionControls';
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
    <div className="space-y-3">
      <OptionCard
        label="Color"
        value={COLORS.find((color) => color.id === state.color)?.label ?? ''}
        open
      >
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
      </OptionCard>

      <OptionCard
        label="Fit"
        value={FITS.find((fit) => fit.id === state.fit)?.label ?? ''}
      >
        {FITS.map((fit) => (
          <ChoiceButton
            key={fit.id}
            label={fit.label}
            selected={state.fit === fit.id}
            disabled={isFitDisabled(fit.id)}
            onClick={() => onFit(fit.id)}
          />
        ))}
      </OptionCard>

      <OptionCard
        label="Size"
        value={SIZES.find((size) => size.id === state.size)?.label ?? ''}
      >
        {SIZES.map((size) => (
          <ChoiceButton
            key={size.id}
            label={size.label}
            selected={state.size === size.id}
            disabled={isSizeDisabled(size.id)}
            onClick={() => onSize(size.id)}
          />
        ))}
      </OptionCard>
    </div>
  );
}
