import type { DecorationPlacement, DecorationRegion } from './decoration';

export type ConfigStepId = 'product' | 'color' | 'decorate' | 'review';

export type ColorwaySelection = {
  id: string;
  displayName: string;
  commerceVariantId?: number;
  commerceVariantCode?: string;
};

export type PartColorSelection = {
  partId: string;
  label: string;
  hex: string;
};

export type ConfigurationState = {
  productId?: string;
  productName?: string;
  sku?: string;
  configurationId?: string;
  activeStep: ConfigStepId;
  completedSteps: ConfigStepId[];
  colorway?: ColorwaySelection | null;
  partColors: PartColorSelection[];
  activeDecorationRegion: DecorationRegion;
  decorations: DecorationPlacement[];
  quantity: number;
};

export function createInitialConfigurationState(
  partial?: Partial<ConfigurationState>
): ConfigurationState {
  return {
    activeStep: 'color',
    completedSteps: ['product'],
    partColors: [],
    activeDecorationRegion: 'front',
    decorations: [],
    quantity: 1,
    ...partial,
  };
}
