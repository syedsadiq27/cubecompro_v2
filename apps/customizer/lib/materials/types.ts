import * as THREE from 'three';

export type MaterialMapSource = {
  id?: number;
  name?: string;
  path?: string;
  url?: string;
  type?: string;
  flipY?: boolean;
};

export type MaterialJson = {
  uuid: string;
  type?: string;
  name?: string;
  side?: number;
  color?: string | number;
  emissive?: string | number;
  transparent?: boolean;
  opacity?: number;
  metalness?: number | string;
  roughness?: number | string;
  envMapIntensity?: number | string;
  aoMapIntensity?: number | string;
  normalScale?: [number | string, number | string];
  wireframe?: boolean;
  visible?: boolean;
  vertexColors?: boolean;
  userData?: {
    map?: Record<string, MaterialMapSource | undefined>;
    [key: string]: unknown;
  };
  colors?: string[];
  textures?: unknown[];
  [key: string]: unknown;
};

export type ObjectChildRule = {
  name?: string;
  material?: string[];
  color?: unknown[];
  texture?: unknown[];
  editableTransform?: { elements?: number[] };
  [key: string]: unknown;
};

export type ObjectRule = {
  __path?: string;
  __editable?: boolean;
  children?: Record<string, ObjectChildRule | undefined>;
  editableTransform?: { elements?: number[] };
  color?: unknown[];
  texture?: unknown[];
  [key: string]: unknown;
};

export type ParsedModelMaterials = {
  version?: number;
  materials: Record<string, MaterialJson>;
  rules: Record<string, ObjectRule>;
  colors: Record<string, { name?: string } | unknown>;
};

export type TextureCatalogItem = {
  id: number;
  name?: string | null;
  ProductMedium?: { Image_URL?: string | null } | null;
};

export const COLOR_MAP_PROPERTIES = new Set([
  'color',
  'emissive',
  'attenuationColor',
  'sheenColor',
  'specular',
  'specularColor',
  'groundColor',
]);

export const NUMBER_PROPERTIES = [
  'opacity',
  'metalness',
  'roughness',
  'envMapIntensity',
  'aoMapIntensity',
  'bumpScale',
  'displacementScale',
  'displacementBias',
  'emissiveIntensity',
  'lightMapIntensity',
  'wireframeLinewidth',
  'refractionRatio',
  'clearcoat',
  'clearcoatRoughness',
  'sheen',
  'sheenRoughness',
  'transmission',
  'thickness',
  'ior',
] as const;

export const BOOLEAN_PROPERTIES = [
  'transparent',
  'wireframe',
  'visible',
  'vertexColors',
  'flatShading',
  'fog',
  'depthTest',
  'depthWrite',
] as const;

export const MAP_COLOR_SPACES: Record<string, THREE.ColorSpace> = {
  map: THREE.SRGBColorSpace,
  emissiveMap: THREE.SRGBColorSpace,
  sheenColorMap: THREE.SRGBColorSpace,
  specularColorMap: THREE.SRGBColorSpace,
  alphaMap: THREE.NoColorSpace,
  aoMap: THREE.NoColorSpace,
  bumpMap: THREE.NoColorSpace,
  displacementMap: THREE.NoColorSpace,
  lightMap: THREE.NoColorSpace,
  metalnessMap: THREE.NoColorSpace,
  normalMap: THREE.NoColorSpace,
  roughnessMap: THREE.NoColorSpace,
  clearcoatMap: THREE.NoColorSpace,
  clearcoatNormalMap: THREE.NoColorSpace,
  clearcoatRoughnessMap: THREE.NoColorSpace,
  sheenRoughnessMap: THREE.NoColorSpace,
  specularMap: THREE.NoColorSpace,
  specularIntensityMap: THREE.NoColorSpace,
  thicknessMap: THREE.NoColorSpace,
  transmissionMap: THREE.NoColorSpace,
};
