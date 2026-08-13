export type MaterialDocument = {
  shaderModel: 'PBR';
  baseColor?: string;
  roughness?: number;
  metallic?: number;
  opacity?: number;
  doubleSided?: boolean;
  baseColorTextureId?: string;
  normalTextureId?: string;
  roughnessTextureId?: string;
  metallicTextureId?: string;
  aoTextureId?: string;
  emissiveTextureId?: string;
  opacityTextureId?: string;
};

export type SetMaterialValue = {
  materialAssetId: string;
};

export function isSetMaterialValue(value: unknown): value is SetMaterialValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'materialAssetId' in value &&
    typeof (value as { materialAssetId: unknown }).materialAssetId === 'string' &&
    (value as { materialAssetId: string }).materialAssetId.length > 0
  );
}

export function parseSetMaterialValue(value: unknown): SetMaterialValue {
  if (!isSetMaterialValue(value)) {
    throw new Error('SET_MATERIAL value must be { materialAssetId: string }');
  }
  return { materialAssetId: value.materialAssetId };
}

export function setMaterialValueJson(materialAssetId: string): string {
  return JSON.stringify({ materialAssetId });
}

export function parseMaterialDocument(value: unknown): MaterialDocument {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Material document must be an object');
  }
  const raw = value as Record<string, unknown>;
  const shaderModel = raw.shaderModel === 'PBR' ? 'PBR' : 'PBR';
  const doc: MaterialDocument = { shaderModel };

  if (raw.baseColor !== undefined) {
    if (typeof raw.baseColor !== 'string') {
      throw new Error('baseColor must be a string');
    }
    doc.baseColor = raw.baseColor;
  }
  for (const key of [
    'roughness',
    'metallic',
    'opacity',
  ] as const) {
    if (raw[key] !== undefined) {
      if (typeof raw[key] !== 'number' || Number.isNaN(raw[key])) {
        throw new Error(`${key} must be a number`);
      }
      doc[key] = raw[key] as number;
    }
  }
  if (raw.doubleSided !== undefined) {
    if (typeof raw.doubleSided !== 'boolean') {
      throw new Error('doubleSided must be a boolean');
    }
    doc.doubleSided = raw.doubleSided;
  }
  for (const key of [
    'baseColorTextureId',
    'normalTextureId',
    'roughnessTextureId',
    'metallicTextureId',
    'aoTextureId',
    'emissiveTextureId',
    'opacityTextureId',
  ] as const) {
    if (raw[key] !== undefined) {
      if (typeof raw[key] !== 'string') {
        throw new Error(`${key} must be a string`);
      }
      doc[key] = raw[key] as string;
    }
  }

  return doc;
}

export function coerceMaterialDocument(value: unknown): MaterialDocument {
  try {
    return parseMaterialDocument(value);
  } catch {
    if (typeof value === 'object' && value !== null) {
      const raw = value as Record<string, unknown>;
      const color =
        typeof raw.baseColor === 'string'
          ? raw.baseColor
          : typeof raw.color === 'string'
            ? raw.color
            : undefined;
      return {
        shaderModel: 'PBR',
        ...(color ? { baseColor: color } : {}),
        ...(typeof raw.roughness === 'number' ? { roughness: raw.roughness } : {}),
        ...(typeof raw.metallic === 'number'
          ? { metallic: raw.metallic }
          : typeof raw.metalness === 'number'
            ? { metallic: raw.metalness }
            : {}),
        ...(typeof raw.opacity === 'number' ? { opacity: raw.opacity } : {}),
        ...(typeof raw.doubleSided === 'boolean'
          ? { doubleSided: raw.doubleSided }
          : {}),
      };
    }
    return { shaderModel: 'PBR' };
  }
}
