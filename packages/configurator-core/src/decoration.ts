export type DecorationRegion = 'front' | 'left' | 'right' | 'back';

export type CameraPreset = {
  position: [number, number, number];
  target: [number, number, number];
};

export type RegionBounds = {
  width: number;
  height: number;
};

export type DecorationPlacement = {
  id: string;
  region: DecorationRegion;
  logoName?: string;
  text?: string;
  size?: number;
};

export type DecorationAdapter = {
  regions: DecorationRegion[];
  getCameraPreset: (region: DecorationRegion) => CameraPreset;
  getRegionBounds: (region: DecorationRegion) => RegionBounds;
};

export const DECORATION_REGIONS: DecorationRegion[] = [
  'front',
  'left',
  'right',
  'back',
];

export const REGION_CAMERA_PRESETS: Record<DecorationRegion, CameraPreset> = {
  front: { position: [0, 0.4, 3.0], target: [0, 0.08, 0] },
  left: { position: [-2.6, 0.4, 0.6], target: [0, 0.08, 0] },
  right: { position: [2.6, 0.4, 0.6], target: [0, 0.08, 0] },
  back: { position: [0, 0.4, -3.0], target: [0, 0.08, 0] },
};

export const REGION_BOUNDS: Record<DecorationRegion, RegionBounds> = {
  front: { width: 0.45, height: 0.28 },
  left: { width: 0.22, height: 0.2 },
  right: { width: 0.22, height: 0.2 },
  back: { width: 0.35, height: 0.22 },
};
