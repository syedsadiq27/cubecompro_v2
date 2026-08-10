import {
  DECORATION_REGIONS,
  REGION_BOUNDS,
  REGION_CAMERA_PRESETS,
  type DecorationAdapter,
  type DecorationRegion,
} from '../decoration';

export function createStubDecorationAdapter(): DecorationAdapter {
  return {
    regions: [...DECORATION_REGIONS],
    getCameraPreset(region: DecorationRegion) {
      return REGION_CAMERA_PRESETS[region];
    },
    getRegionBounds(region: DecorationRegion) {
      return REGION_BOUNDS[region];
    },
  };
}
