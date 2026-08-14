export type ColorId =
  | 'white'
  | 'black'
  | 'navy'
  | 'heather'
  | 'forest'
  | 'red';
export type FitId = 'regular' | 'oversized';
export type SizeId = 's' | 'm' | 'l' | 'xl';

export type ConfigurationState = {
  color: ColorId;
  fit: FitId;
  size: SizeId;
};

export type MaterialParams = {
  color: string;
  roughness: number;
  metalness: number;
};

export type OptionDef<T extends string> = {
  id: T;
  label: string;
  skuCode: string;
  swatch: string;
  material: MaterialParams;
  priceDelta: number;
};

export type ResolvedMaterials = {
  body: MaterialParams;
};

export type BlockedOptions = {
  color: ColorId[];
  fit: FitId[];
  size: SizeId[];
};

export type ResolvedConfiguration = {
  state: ConfigurationState;
  sku: string;
  price: number;
  inventory: number;
  valid: boolean;
  blockedOptions: BlockedOptions;
  materials: ResolvedMaterials;
  labels: {
    color: string;
    fit: string;
    size: string;
  };
  fitScale: number;
};
