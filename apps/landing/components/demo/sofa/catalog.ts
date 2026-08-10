import type {
  ConfigurationState,
  FabricId,
  FrameId,
  LegsId,
  OptionDef,
} from './types';

export const BASE_PRICE = 2199;

export const DEFAULT_CONFIGURATION: ConfigurationState = {
  frame: 'walnut',
  fabric: 'beige',
  legs: 'brass',
};

export const FRAMES: OptionDef<FrameId>[] = [
  {
    id: 'oak',
    label: 'Oak',
    skuCode: 'OAK',
    swatch: '#C4A574',
    material: { color: '#C4A574', roughness: 0.55, metalness: 0.05 },
    priceDelta: 0,
  },
  {
    id: 'walnut',
    label: 'Walnut',
    skuCode: 'WAL',
    swatch: '#5C3A21',
    material: { color: '#5C3A21', roughness: 0.5, metalness: 0.08 },
    priceDelta: 120,
  },
  {
    id: 'black',
    label: 'Black',
    skuCode: 'BLK',
    swatch: '#1A1A1A',
    material: { color: '#1A1A1A', roughness: 0.4, metalness: 0.15 },
    priceDelta: 80,
  },
];

export const FABRICS: OptionDef<FabricId>[] = [
  {
    id: 'beige',
    label: 'Beige',
    skuCode: 'BEI',
    swatch: '#D4C4A8',
    material: { color: '#D4C4A8', roughness: 0.85, metalness: 0 },
    priceDelta: 0,
  },
  {
    id: 'charcoal',
    label: 'Charcoal',
    skuCode: 'CHA',
    swatch: '#3D3F44',
    material: { color: '#3D3F44', roughness: 0.8, metalness: 0 },
    priceDelta: 60,
  },
  {
    id: 'forest',
    label: 'Forest',
    skuCode: 'FOR',
    swatch: '#2F4F3E',
    material: { color: '#2F4F3E', roughness: 0.82, metalness: 0 },
    priceDelta: 90,
  },
  {
    id: 'leather',
    label: 'Leather',
    skuCode: 'LEA',
    swatch: '#6B3E2E',
    material: { color: '#6B3E2E', roughness: 0.45, metalness: 0.05 },
    priceDelta: 280,
  },
];

export const LEGS: OptionDef<LegsId>[] = [
  {
    id: 'brass',
    label: 'Brass',
    skuCode: 'BRA',
    swatch: '#B08D57',
    material: { color: '#B08D57', roughness: 0.25, metalness: 0.9 },
    priceDelta: 80,
  },
  {
    id: 'black-steel',
    label: 'Black Steel',
    skuCode: 'BST',
    swatch: '#2A2A2A',
    material: { color: '#2A2A2A', roughness: 0.3, metalness: 0.85 },
    priceDelta: 40,
  },
  {
    id: 'oak',
    label: 'Oak',
    skuCode: 'OAK',
    swatch: '#C4A574',
    material: { color: '#C4A574', roughness: 0.55, metalness: 0.05 },
    priceDelta: 0,
  },
];

export const INVENTORY_BY_SKU: Record<string, number> = {
  'SOFA-WAL-BEI-BRA': 4,
  'SOFA-WAL-BEI-BST': 7,
  'SOFA-WAL-BEI-OAK': 3,
  'SOFA-WAL-CHA-BRA': 2,
  'SOFA-WAL-CHA-BST': 5,
  'SOFA-WAL-CHA-OAK': 1,
  'SOFA-WAL-FOR-BRA': 0,
  'SOFA-WAL-FOR-BST': 2,
  'SOFA-WAL-FOR-OAK': 4,
  'SOFA-WAL-LEA-BRA': 3,
  'SOFA-WAL-LEA-BST': 6,
  'SOFA-WAL-LEA-OAK': 2,
  'SOFA-OAK-BEI-BRA': 8,
  'SOFA-OAK-BEI-BST': 5,
  'SOFA-OAK-BEI-OAK': 9,
  'SOFA-OAK-CHA-BRA': 4,
  'SOFA-OAK-CHA-BST': 6,
  'SOFA-OAK-CHA-OAK': 3,
  'SOFA-OAK-FOR-BRA': 2,
  'SOFA-OAK-FOR-BST': 1,
  'SOFA-OAK-FOR-OAK': 5,
  'SOFA-OAK-LEA-BRA': 4,
  'SOFA-OAK-LEA-BST': 3,
  'SOFA-OAK-LEA-OAK': 2,
  'SOFA-BLK-BEI-BST': 6,
  'SOFA-BLK-BEI-OAK': 4,
  'SOFA-BLK-CHA-BST': 8,
  'SOFA-BLK-CHA-OAK': 3,
  'SOFA-BLK-LEA-BST': 5,
  'SOFA-BLK-LEA-OAK': 2,
};

export function getFrame(id: FrameId) {
  return FRAMES.find((item) => item.id === id)!;
}

export function getFabric(id: FabricId) {
  return FABRICS.find((item) => item.id === id)!;
}

export function getLegs(id: LegsId) {
  return LEGS.find((item) => item.id === id)!;
}
