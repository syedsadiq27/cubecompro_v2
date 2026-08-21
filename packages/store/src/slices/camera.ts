import type { CubeGet, CubeSet } from '../types.js';

export type CameraProjection = 'PERSPECTIVE' | 'ORTHOGRAPHIC';

export type CameraDefinition = {
  projection: CameraProjection;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  near: number;
  far: number;
};

export type OrbitDefinition = {
  enabled: boolean;
  enableRotate: boolean;
  enablePan: boolean;
  enableZoom: boolean;
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
};

export type CameraPreset = {
  id: string;
  name: string;
  isDefault?: boolean;
  sceneCount?: number;
  camera: CameraDefinition;
  controls: OrbitDefinition;
};

export const DEFAULT_CAMERA_CONFIG: CameraDefinition = {
  projection: 'PERSPECTIVE',
  position: [3.2, 2.1, 5.8],
  target: [0, 1.0, 0],
  fov: 45,
  near: 0.1,
  far: 1000,
};

export const DEFAULT_ORBIT_CONFIG: OrbitDefinition = {
  enabled: true,
  enableRotate: true,
  enablePan: true,
  enableZoom: true,
  minDistance: 0.05,
  maxDistance: 500,
  minPolarAngle: 0,
  maxPolarAngle: 180,
  autoRotate: false,
  autoRotateSpeed: 2.0,
};

export const INITIAL_CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'preset-default',
    name: 'Default View',
    isDefault: true,
    sceneCount: 3,
    camera: { ...DEFAULT_CAMERA_CONFIG },
    controls: { ...DEFAULT_ORBIT_CONFIG },
  },
  {
    id: 'preset-hero',
    name: 'Hero View',
    sceneCount: 2,
    camera: {
      projection: 'PERSPECTIVE',
      position: [4.5, 2.8, 4.2],
      target: [0, 0.8, 0],
      fov: 40,
      near: 0.1,
      far: 1000,
    },
    controls: { ...DEFAULT_ORBIT_CONFIG },
  },
  {
    id: 'preset-top',
    name: 'Top View',
    sceneCount: 1,
    camera: {
      projection: 'PERSPECTIVE',
      position: [0, 7.5, 0.01],
      target: [0, 0, 0],
      fov: 45,
      near: 0.1,
      far: 1000,
    },
    controls: { ...DEFAULT_ORBIT_CONFIG },
  },
  {
    id: 'preset-side',
    name: 'Side View',
    sceneCount: 1,
    camera: {
      projection: 'PERSPECTIVE',
      position: [6.8, 1.2, 0],
      target: [0, 1.0, 0],
      fov: 45,
      near: 0.1,
      far: 1000,
    },
    controls: { ...DEFAULT_ORBIT_CONFIG },
  },
  {
    id: 'preset-detail',
    name: 'Detail View',
    sceneCount: 1,
    camera: {
      projection: 'PERSPECTIVE',
      position: [2.1, 1.6, 2.4],
      target: [0.3, 1.1, 0.2],
      fov: 35,
      near: 0.1,
      far: 1000,
    },
    controls: { ...DEFAULT_ORBIT_CONFIG },
  },
];

export type CameraSlice = {
  cameraPresets: CameraPreset[];
  activeCameraPresetId: string;
  cameraConfig: CameraDefinition;
  orbitConfig: OrbitDefinition;
  setActiveCameraPreset: (id: string) => void;
  updateCameraConfig: (patch: Partial<CameraDefinition>) => void;
  updateOrbitConfig: (patch: Partial<OrbitDefinition>) => void;
  syncLiveCameraFromViewport: (patch: Partial<CameraDefinition>) => void;
  saveCurrentViewAsPreset: (name?: string) => void;
  saveActivePreset: () => void;
  addCameraPreset: (name: string) => void;
  renameCameraPreset: (id: string, name: string) => void;
  deleteCameraPreset: (id: string) => void;
};

export const createCameraSlice = <T extends CameraSlice>(
  set: CubeSet<T>,
  get: CubeGet<T>
): CameraSlice => ({
  cameraPresets: INITIAL_CAMERA_PRESETS,
  activeCameraPresetId: 'preset-default',
  cameraConfig: { ...DEFAULT_CAMERA_CONFIG },
  orbitConfig: { ...DEFAULT_ORBIT_CONFIG },

  setActiveCameraPreset: (id) => {
    const preset = get().cameraPresets.find((p) => p.id === id);
    if (!preset) return;
    set({
      activeCameraPresetId: id,
      cameraConfig: { ...preset.camera },
      orbitConfig: { ...preset.controls },
    } as Partial<T>);
  },

  updateCameraConfig: (patch) =>
    set(
      (state) =>
        ({
          cameraConfig: { ...state.cameraConfig, ...patch },
        }) as Partial<T>
    ),

  updateOrbitConfig: (patch) =>
    set(
      (state) =>
        ({
          orbitConfig: { ...state.orbitConfig, ...patch },
        }) as Partial<T>
    ),

  syncLiveCameraFromViewport: (patch) =>
    set(
      (state) =>
        ({
          cameraConfig: {
            ...state.cameraConfig,
            ...patch,
          },
        }) as Partial<T>
    ),

  saveCurrentViewAsPreset: (name) => {
    const state = get();
    const presetName = name || `View ${state.cameraPresets.length + 1}`;
    const newPreset: CameraPreset = {
      id: `preset-${Date.now()}`,
      name: presetName,
      sceneCount: 1,
      camera: { ...state.cameraConfig },
      controls: { ...state.orbitConfig },
    };
    set({
      cameraPresets: [...state.cameraPresets, newPreset],
      activeCameraPresetId: newPreset.id,
      cameraConfig: { ...newPreset.camera },
      orbitConfig: { ...newPreset.controls },
    } as Partial<T>);
  },

  saveActivePreset: () => {
    const state = get();
    set({
      cameraPresets: state.cameraPresets.map((p) =>
        p.id === state.activeCameraPresetId
          ? {
              ...p,
              camera: { ...state.cameraConfig },
              controls: { ...state.orbitConfig },
            }
          : p
      ),
    } as Partial<T>);
  },

  addCameraPreset: (name) => {
    get().saveCurrentViewAsPreset(name);
  },

  renameCameraPreset: (id, name) => {
    const nextName = name.trim();
    if (!nextName) return;
    set(
      (state) =>
        ({
          cameraPresets: state.cameraPresets.map((p) =>
            p.id === id ? { ...p, name: nextName } : p
          ),
        }) as Partial<T>
    );
  },

  deleteCameraPreset: (id) =>
    set(
      (state) =>
        ({
          cameraPresets: state.cameraPresets.filter((p) => p.id !== id),
        }) as Partial<T>
    ),
});
