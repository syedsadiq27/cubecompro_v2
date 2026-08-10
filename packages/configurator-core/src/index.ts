export type {
  ThemeConfig,
} from './theme';
export { DEFAULT_THEME, resolveTheme } from './theme';

export type { PriceAdjustment, PriceState } from './pricing';
export {
  formatPrice,
  createUnresolvedPrice,
} from './pricing';

export type {
  CommerceSelection,
  AddToCartResult,
  CommerceAdapter,
} from './commerce';

export type {
  DecorationRegion,
  CameraPreset,
  RegionBounds,
  DecorationPlacement,
  DecorationAdapter,
} from './decoration';
export {
  DECORATION_REGIONS,
  REGION_CAMERA_PRESETS,
  REGION_BOUNDS,
} from './decoration';

export type {
  ConfigStepId,
  ColorwaySelection,
  PartColorSelection,
  ConfigurationState,
} from './configuration';
export { createInitialConfigurationState } from './configuration';

export type {
  ValidationSeverity,
  ValidationIssue,
  ValidationRule,
  ValidationResult,
} from './validation';
export {
  createValidationRegistry,
  defaultValidationRules,
} from './validation';

export type { PricingAdapter } from './adapters/pricing';
export {
  createStubPricingAdapter,
  createUnresolvedPricingAdapter,
} from './adapters/pricing';

export type { ThemeAdapter } from './adapters/theme';
export { createProjectThemeAdapter } from './adapters/theme';

export { createStubCommerceAdapter } from './adapters/commerce';
export { createStubDecorationAdapter } from './adapters/decoration';

export type { PopularColorway } from './colorways';
export {
  cleanColorwayDisplayName,
  selectPopularColorways,
} from './colorways';
