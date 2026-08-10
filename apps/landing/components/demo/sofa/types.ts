export type FrameId = 'oak' | 'walnut' | 'black';
export type FabricId = 'beige' | 'charcoal' | 'forest' | 'leather';
export type LegsId = 'brass' | 'black-steel' | 'oak';

export type OptionGroupId = 'frame' | 'fabric' | 'legs';

export type ConfigurationState = {
  frame: FrameId;
  fabric: FabricId;
  legs: LegsId;
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
  frame: MaterialParams;
  fabric: MaterialParams;
  legs: MaterialParams;
};

export type BlockedOptions = {
  frame: FrameId[];
  fabric: FabricId[];
  legs: LegsId[];
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
    frame: string;
    fabric: string;
    legs: string;
  };
};
