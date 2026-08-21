import catalogJson from './material-properties.json' with { type: 'json' };

export type TextureSemanticSlot =
  | 'BASE_COLOR'
  | 'NORMAL'
  | 'METALLIC_ROUGHNESS'
  | 'OCCLUSION'
  | 'EMISSIVE';

export type TextureWrapMode = 'repeat' | 'clamp' | 'mirror';

export type MaterialDefinition = {
  shaderModel: 'PBR';
  baseColor?: string;
  roughness?: number;
  metallic?: number;
  opacity?: number;
  emissive?: string;
  doubleSided?: boolean;
};

export type MaterialFactorKey = Exclude<keyof MaterialDefinition, 'shaderModel'>;

export type MaterialFactorType = 'color' | 'number' | 'boolean';

export type MaterialFactorProperty = {
  key: MaterialFactorKey;
  label: string;
  type: MaterialFactorType;
  three: string;
  default: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  omitIf?: string | number | boolean;
  transparentBelow?: number;
};

export type MaterialTextureSlotProperty = {
  slot: TextureSemanticSlot;
  label: string;
  three: string[];
  colorSpace: 'srgb' | 'linear';
  legacyIds: string[];
};

export type MaterialWrapModeProperty = {
  id: TextureWrapMode;
  label: string;
  three: string;
};

export type MaterialPropertyCatalog = {
  shaderModel: 'PBR';
  description: string;
  factors: MaterialFactorProperty[];
  textureSlots: MaterialTextureSlotProperty[];
  legacyTextureIdFields: string[];
  wrapModes: MaterialWrapModeProperty[];
  textureFiles: {
    extensions: string[];
    mimeTypes: string[];
  };
};

export const MATERIAL_PROPERTY_CATALOG =
  catalogJson as MaterialPropertyCatalog;

export const MATERIAL_FACTORS: MaterialFactorProperty[] =
  MATERIAL_PROPERTY_CATALOG.factors;

export const TEXTURE_SLOT_PROPERTIES: MaterialTextureSlotProperty[] =
  MATERIAL_PROPERTY_CATALOG.textureSlots;

export const TEXTURE_SEMANTIC_SLOTS: TextureSemanticSlot[] =
  TEXTURE_SLOT_PROPERTIES.map((entry) => entry.slot);

export const TEXTURE_SEMANTIC_SLOT_LABELS: Record<TextureSemanticSlot, string> =
  Object.fromEntries(
    TEXTURE_SLOT_PROPERTIES.map((entry) => [entry.slot, entry.label])
  ) as Record<TextureSemanticSlot, string>;

export const TEXTURE_WRAP_MODES: TextureWrapMode[] =
  MATERIAL_PROPERTY_CATALOG.wrapModes.map((entry) => entry.id);

export function textureFileAccept(): string {
  const { extensions, mimeTypes } = MATERIAL_PROPERTY_CATALOG.textureFiles;
  return [...extensions, ...mimeTypes].join(',');
}

export function materialFactorValuesFromDocument(
  doc: MaterialDocument | null | undefined
): Record<MaterialFactorKey, string | number | boolean> {
  const values = {} as Record<MaterialFactorKey, string | number | boolean>;
  for (const factor of MATERIAL_FACTORS) {
    const current = doc?.[factor.key];
    values[factor.key] = (current ?? factor.default) as
      | string
      | number
      | boolean;
  }
  return values;
}

export function materialDefinitionFromValues(
  values: Partial<Record<MaterialFactorKey, string | number | boolean>>
): MaterialDefinition {
  const next: MaterialDefinition = {
    shaderModel: MATERIAL_PROPERTY_CATALOG.shaderModel,
  };
  for (const factor of MATERIAL_FACTORS) {
    const value = values[factor.key];
    if (value === undefined) continue;
    if (factor.omitIf !== undefined && value === factor.omitIf) continue;
    (next as Record<string, unknown>)[factor.key] = value;
  }
  return next;
}

export type MaterialTextureSampler = {
  wrapS?: TextureWrapMode;
  wrapT?: TextureWrapMode;
};

export type MaterialTextureUsage = {
  slot: TextureSemanticSlot;
  textureAssetRevisionId: string;
  texCoord?: number;
  transform?: Record<string, unknown>;
  sampler?: MaterialTextureSampler;
};

/** Frozen material revision payload used by resolve / factory. */
export type MaterialRevisionDocument = MaterialDefinition & {
  textureUsages: MaterialTextureUsage[];
};

/**
 * Authoring/legacy tip document may still carry texture asset or revision ids
 * on *TextureId fields. Freeze path maps them into textureUsages.
 */
export type MaterialDocument = MaterialDefinition & {
  baseColorTextureId?: string;
  normalTextureId?: string;
  roughnessTextureId?: string;
  metallicTextureId?: string;
  aoTextureId?: string;
  emissiveTextureId?: string;
  opacityTextureId?: string;
  textureUsages?: MaterialTextureUsage[];
};

export function isTextureWrapMode(value: unknown): value is TextureWrapMode {
  return (
    typeof value === 'string' &&
    (TEXTURE_WRAP_MODES as string[]).includes(value)
  );
}

export function normalizeMaterialSampler(
  value: unknown
): MaterialTextureSampler | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }
  const raw = value as Record<string, unknown>;
  const sampler: MaterialTextureSampler = {};
  if (isTextureWrapMode(raw.wrapS)) sampler.wrapS = raw.wrapS;
  if (isTextureWrapMode(raw.wrapT)) sampler.wrapT = raw.wrapT;
  return sampler.wrapS || sampler.wrapT ? sampler : undefined;
}

export type SetMaterialValue = {
  materialAssetRevisionId: string;
};

export function isSetMaterialValue(value: unknown): value is SetMaterialValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'materialAssetRevisionId' in value &&
    typeof (value as { materialAssetRevisionId: unknown })
      .materialAssetRevisionId === 'string' &&
    (value as { materialAssetRevisionId: string }).materialAssetRevisionId
      .length > 0
  );
}

export function parseSetMaterialValue(value: unknown): SetMaterialValue {
  if (isSetMaterialValue(value)) {
    return {
      materialAssetRevisionId: value.materialAssetRevisionId.trim(),
    };
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    'materialAssetId' in value &&
    typeof (value as { materialAssetId: unknown }).materialAssetId ===
      'string' &&
    (value as { materialAssetId: string }).materialAssetId.length > 0
  ) {
    throw new Error(
      'SET_MATERIAL value must be { materialAssetRevisionId: string } (materialAssetId is no longer accepted)'
    );
  }
  throw new Error(
    'SET_MATERIAL value must be { materialAssetRevisionId: string }'
  );
}

export function setMaterialValueJson(materialAssetRevisionId: string): string {
  return JSON.stringify({
    materialAssetRevisionId: materialAssetRevisionId.trim(),
  });
}

export function isTextureSemanticSlot(
  value: unknown
): value is TextureSemanticSlot {
  return (
    typeof value === 'string' &&
    (TEXTURE_SEMANTIC_SLOTS as string[]).includes(value)
  );
}

export function stripTextureIdsFromDefinition(
  doc: MaterialDocument
): MaterialDefinition {
  const next: MaterialDefinition = {
    shaderModel: MATERIAL_PROPERTY_CATALOG.shaderModel,
  };
  for (const factor of MATERIAL_FACTORS) {
    const value = doc[factor.key];
    if (value !== undefined) {
      (next as Record<string, unknown>)[factor.key] = value;
    }
  }
  return next;
}

/**
 * Map legacy *TextureId fields + explicit textureUsages into slot usages.
 * Ids are treated as TextureAssetRevision ids after 4D (callers remap asset→revision).
 */
export function extractTextureUsages(
  doc: MaterialDocument
): MaterialTextureUsage[] {
  const bySlot = new Map<TextureSemanticSlot, MaterialTextureUsage>();

  if (Array.isArray(doc.textureUsages)) {
    for (const usage of doc.textureUsages) {
      if (!isTextureSemanticSlot(usage.slot)) continue;
      if (
        typeof usage.textureAssetRevisionId !== 'string' ||
        !usage.textureAssetRevisionId.trim()
      ) {
        continue;
      }
      const sampler = normalizeMaterialSampler(usage.sampler);
      bySlot.set(usage.slot, {
        slot: usage.slot,
        textureAssetRevisionId: usage.textureAssetRevisionId.trim(),
        ...(typeof usage.texCoord === 'number'
          ? { texCoord: usage.texCoord }
          : {}),
        ...(usage.transform ? { transform: usage.transform } : {}),
        ...(sampler ? { sampler } : {}),
      });
    }
  }

  const asRecord = doc as Record<string, unknown>;
  for (const slot of TEXTURE_SLOT_PROPERTIES) {
    if (bySlot.has(slot.slot)) continue;
    const id = slot.legacyIds
      .map((key) => asRecord[key])
      .find(
        (value): value is string =>
          typeof value === 'string' && value.trim().length > 0
      );
    if (!id) continue;
    bySlot.set(slot.slot, {
      slot: slot.slot,
      textureAssetRevisionId: id.trim(),
    });
  }

  return [...bySlot.values()];
}

export function parseMaterialDocument(value: unknown): MaterialDocument {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Material document must be an object');
  }
  const raw = value as Record<string, unknown>;
  const doc: MaterialDocument = {
    shaderModel: MATERIAL_PROPERTY_CATALOG.shaderModel,
  };

  for (const factor of MATERIAL_FACTORS) {
    const next = raw[factor.key];
    if (next === undefined) continue;
    if (factor.type === 'color') {
      if (typeof next !== 'string') {
        throw new Error(`${factor.key} must be a string`);
      }
      (doc as Record<string, unknown>)[factor.key] = next;
      continue;
    }
    if (factor.type === 'number') {
      if (typeof next !== 'number' || Number.isNaN(next)) {
        throw new Error(`${factor.key} must be a number`);
      }
      (doc as Record<string, unknown>)[factor.key] = next;
      continue;
    }
    if (typeof next !== 'boolean') {
      throw new Error(`${factor.key} must be a boolean`);
    }
    (doc as Record<string, unknown>)[factor.key] = next;
  }

  const legacyTextureKeys = [
    ...TEXTURE_SLOT_PROPERTIES.flatMap((slot) => slot.legacyIds),
    ...MATERIAL_PROPERTY_CATALOG.legacyTextureIdFields,
  ];
  for (const key of legacyTextureKeys) {
    if (raw[key] === undefined) continue;
    if (typeof raw[key] !== 'string') {
      throw new Error(`${key} must be a string`);
    }
    (doc as Record<string, unknown>)[key] = raw[key];
  }

  if (raw.textureUsages !== undefined) {
    if (!Array.isArray(raw.textureUsages)) {
      throw new Error('textureUsages must be an array');
    }
    doc.textureUsages = extractTextureUsages({
      shaderModel: 'PBR',
      textureUsages: raw.textureUsages as MaterialTextureUsage[],
    });
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

export function mergeMaterialRevisionDocument(
  definition: MaterialDefinition,
  textureUsages: MaterialTextureUsage[]
): MaterialRevisionDocument {
  return {
    ...definition,
    textureUsages,
  };
}
