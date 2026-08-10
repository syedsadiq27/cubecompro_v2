export type ColorwayVariantMedia = {
  id?: number;
  Image_URL?: string | null;
};

export type ColorwayVariantConfigEntry = {
  materialUUID?: string;
  color?: string;
  materialUserData?: Record<string, unknown>;
};

export type ColorwayVariant = {
  id: number;
  varientCode: string;
  varientName?: string | null;
  configuration: string | Record<string, ColorwayVariantConfigEntry>;
  media?: ColorwayVariantMedia | ColorwayVariantMedia[] | null;
};

export type ColorwayGroup = {
  id: string;
  label: string;
  variants: ColorwayVariant[];
};

export type ColorwaysSceneApi = {
  applyVariant: (variant: ColorwayVariant) => boolean;
};
