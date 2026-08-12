export type ProductObjectAsset = {
  id: string;
  name: string;
  code: string | null;
  relativePath: string;
  url: string;
  included: boolean;
  visible: boolean;
};

export type ProductCamera = {
  x?: number;
  y?: number;
  z?: number;
  fov?: number;
  near?: number;
  far?: number;
  uniqueName?: string;
} | null;

export type ProductTexture = {
  id: number;
  name?: string | null;
  code?: string | null;
  description?: string | null;
  ProductMedium?: { Image_URL?: string | null } | null;
};

export type ModelConfig = {
  includedObjects?: string[];
  editableObjects?: string[];
  rules?: Record<string, unknown> | string;
  colors?: unknown;
  textures?: unknown;
  materials?: unknown;
  metadata?: unknown;
  layers?: unknown;
};
