import {
  MATERIAL_FACTORS,
  MATERIAL_PROPERTY_CATALOG,
  TEXTURE_SEMANTIC_SLOTS,
  TEXTURE_SLOT_PROPERTIES,
  TEXTURE_WRAP_MODES,
  extractTextureUsages,
  parseMaterialDocument,
} from './materials.js';

describe('material property catalog', () => {
  it('lists every supported PBR factor and texture slot once', () => {
    expect(MATERIAL_PROPERTY_CATALOG.shaderModel).toBe('PBR');
    expect(MATERIAL_FACTORS.map((factor) => factor.key)).toEqual([
      'baseColor',
      'emissive',
      'metallic',
      'roughness',
      'opacity',
      'doubleSided',
    ]);
    expect(TEXTURE_SEMANTIC_SLOTS).toEqual([
      'BASE_COLOR',
      'NORMAL',
      'METALLIC_ROUGHNESS',
      'OCCLUSION',
      'EMISSIVE',
    ]);
    expect(TEXTURE_WRAP_MODES).toEqual(['repeat', 'clamp', 'mirror']);
  });

  it('parses factors and legacy texture ids from the catalog', () => {
    const doc = parseMaterialDocument({
      shaderModel: 'PBR',
      baseColor: '#8A6040',
      metallic: 0.1,
      roughness: 0.4,
      opacity: 1,
      doubleSided: true,
      normalTextureId: 'tex-normal-1',
    });
    expect(doc.baseColor).toBe('#8A6040');
    expect(doc.doubleSided).toBe(true);
    expect(
      extractTextureUsages(doc).map((usage) => usage.slot)
    ).toEqual(['NORMAL']);
    expect(
      TEXTURE_SLOT_PROPERTIES.find((slot) => slot.slot === 'NORMAL')?.three
    ).toEqual(['normalMap']);
  });
});
