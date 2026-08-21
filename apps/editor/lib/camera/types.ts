export type {
  CameraDefinition,
  CameraPreset,
  CameraProjection,
  OrbitDefinition,
} from '@repo/store';

export {
  DEFAULT_CAMERA_CONFIG,
  DEFAULT_ORBIT_CONFIG,
  INITIAL_CAMERA_PRESETS,
} from '@repo/store';

export type CameraAnimationEasing =
  | 'ease-in-out'
  | 'linear'
  | 'ease-in'
  | 'ease-out';

export type CameraAnimation = {
  id: string;
  name: string;
  enabled: boolean;
  durationMs: number;
  easing: CameraAnimationEasing;
  from: {
    position: [number, number, number];
    target: [number, number, number];
    fov?: number;
  };
  to: {
    position: [number, number, number];
    target: [number, number, number];
    fov?: number;
  };
};

export const INITIAL_CAMERA_ANIMATIONS: CameraAnimation[] = [
  {
    id: 'anim-intro',
    name: 'Intro Animation',
    enabled: true,
    durationMs: 1500,
    easing: 'ease-in-out',
    from: {
      position: [6.0, 4.0, 8.0],
      target: [0, 0.5, 0],
      fov: 50,
    },
    to: {
      position: [3.2, 2.1, 5.8],
      target: [0, 1.0, 0],
      fov: 45,
    },
  },
  {
    id: 'anim-rotate',
    name: 'Rotate Table',
    enabled: true,
    durationMs: 4000,
    easing: 'linear',
    from: {
      position: [3.2, 2.1, 5.8],
      target: [0, 1.0, 0],
      fov: 45,
    },
    to: {
      position: [-3.2, 2.1, -5.8],
      target: [0, 1.0, 0],
      fov: 45,
    },
  },
];
