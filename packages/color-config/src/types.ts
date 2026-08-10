export type ColorConfigAsset = {
  id: string;
  code?: string | null;
  included?: boolean;
  visible?: boolean;
};

export type ColorConfigChildRule = {
  material?: string[];
  color?: unknown[];
};

export type ColorConfigRule = {
  __displayName?: unknown;
  __editableName?: unknown;
  color?: unknown[];
  children?: Record<string, ColorConfigChildRule | undefined>;
};

export type ColorConfigMaterial = {
  colors?: unknown[];
};

export type ColorConfigMaterials = {
  colors: Record<string, { name?: string } | unknown>;
  rules: Record<string, ColorConfigRule | undefined>;
  materials: Record<string, ColorConfigMaterial | undefined>;
};

export type ColorPart = {
  id: string;
  label: string;
  meshNames: string[];
  swatches: string[];
};

export type ColorSwatchOption = {
  hex: string;
  label: string;
};

export type ColorConfigSceneApi = {
  applyPartColor: (partId: string, hex: string) => boolean;
};
