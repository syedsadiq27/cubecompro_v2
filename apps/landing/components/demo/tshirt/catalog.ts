import type {
  ColorId,
  ConfigurationState,
  FitId,
  OptionDef,
  SizeId,
} from './types';

export const BASE_PRICE = 32;

export const DEFAULT_CONFIGURATION: ConfigurationState = {
  color: 'navy',
  fit: 'regular',
  size: 'm',
};

export const COLORS: OptionDef<ColorId>[] = [
  {
    id: 'white',
    label: 'White',
    skuCode: 'WHT',
    swatch: '#F4F1EA',
    material: { color: '#F4F1EA', roughness: 0.94, metalness: 0 },
    priceDelta: 0,
  },
  {
    id: 'black',
    label: 'Black',
    skuCode: 'BLK',
    swatch: '#2A2A2A',
    material: { color: '#2A2A2A', roughness: 0.92, metalness: 0 },
    priceDelta: 0,
  },
  {
    id: 'navy',
    label: 'Navy',
    skuCode: 'NAV',
    swatch: '#3A5F9A',
    material: { color: '#3A5F9A', roughness: 0.93, metalness: 0 },
    priceDelta: 0,
  },
  {
    id: 'heather',
    label: 'Heather',
    skuCode: 'HTH',
    swatch: '#9A9A96',
    material: { color: '#9A9A96', roughness: 0.95, metalness: 0 },
    priceDelta: 2,
  },
  {
    id: 'forest',
    label: 'Forest',
    skuCode: 'FOR',
    swatch: '#3F6B4E',
    material: { color: '#3F6B4E', roughness: 0.93, metalness: 0 },
    priceDelta: 2,
  },
  {
    id: 'red',
    label: 'Red',
    skuCode: 'RED',
    swatch: '#C62828',
    material: { color: '#C62828', roughness: 0.92, metalness: 0 },
    priceDelta: 2,
  },
];

export const FITS: OptionDef<FitId>[] = [
  {
    id: 'regular',
    label: 'Regular',
    skuCode: 'REG',
    swatch: '#D8D0C4',
    material: { color: '#D8D0C4', roughness: 0.94, metalness: 0 },
    priceDelta: 0,
  },
  {
    id: 'oversized',
    label: 'Oversized',
    skuCode: 'OVR',
    swatch: '#C4B8A8',
    material: { color: '#C4B8A8', roughness: 0.94, metalness: 0 },
    priceDelta: 4,
  },
];

export const SIZES: OptionDef<SizeId>[] = [
  {
    id: 's',
    label: 'S',
    skuCode: 'S',
    swatch: '#E8E2D8',
    material: { color: '#E8E2D8', roughness: 1, metalness: 0 },
    priceDelta: 0,
  },
  {
    id: 'm',
    label: 'M',
    skuCode: 'M',
    swatch: '#E8E2D8',
    material: { color: '#E8E2D8', roughness: 1, metalness: 0 },
    priceDelta: 0,
  },
  {
    id: 'l',
    label: 'L',
    skuCode: 'L',
    swatch: '#E8E2D8',
    material: { color: '#E8E2D8', roughness: 1, metalness: 0 },
    priceDelta: 0,
  },
  {
    id: 'xl',
    label: 'XL',
    skuCode: 'XL',
    swatch: '#E8E2D8',
    material: { color: '#E8E2D8', roughness: 1, metalness: 0 },
    priceDelta: 2,
  },
];

export const INVENTORY_BY_SKU: Record<string, number> = {
  'TEE-NAV-REG-M': 42,
  'TEE-NAV-REG-S': 28,
  'TEE-NAV-REG-L': 35,
  'TEE-NAV-REG-XL': 18,
  'TEE-NAV-OVR-M': 16,
  'TEE-NAV-OVR-L': 12,
  'TEE-NAV-OVR-XL': 9,
  'TEE-WHT-REG-M': 50,
  'TEE-WHT-REG-S': 40,
  'TEE-WHT-REG-L': 38,
  'TEE-WHT-REG-XL': 22,
  'TEE-WHT-OVR-M': 14,
  'TEE-BLK-REG-M': 45,
  'TEE-BLK-REG-S': 30,
  'TEE-BLK-REG-L': 33,
  'TEE-BLK-REG-XL': 20,
  'TEE-BLK-OVR-M': 11,
  'TEE-HTH-REG-M': 24,
  'TEE-HTH-REG-L': 19,
  'TEE-HTH-OVR-M': 8,
  'TEE-FOR-REG-M': 15,
  'TEE-FOR-REG-L': 12,
  'TEE-FOR-OVR-L': 6,
  'TEE-RED-REG-M': 20,
  'TEE-RED-REG-S': 14,
  'TEE-RED-REG-L': 17,
  'TEE-RED-OVR-M': 0,
};

export function getColor(id: ColorId) {
  return COLORS.find((item) => item.id === id)!;
}

export function getFit(id: FitId) {
  return FITS.find((item) => item.id === id)!;
}

export function getSize(id: SizeId) {
  return SIZES.find((item) => item.id === id)!;
}
