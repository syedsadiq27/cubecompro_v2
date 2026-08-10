import type {
  ColorConfigAsset,
  ColorConfigMaterials,
  ColorPart,
  ColorSwatchOption,
} from './types';

function normalizeHex(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('#')) return trimmed.toLowerCase();
  if (trimmed.startsWith('0x')) return `#${trimmed.slice(2).toLowerCase()}`;
  return `#${trimmed.toLowerCase()}`;
}

function uniqueHexes(values: unknown[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    if (typeof value !== 'string' || !value.trim()) continue;
    const hex = normalizeHex(value);
    if (seen.has(hex)) continue;
    seen.add(hex);
    result.push(hex);
  }
  return result;
}

function labelFromAsset(
  asset: ColorConfigAsset,
  materials: ColorConfigMaterials
): string {
  const rule = materials.rules[asset.id];
  const display =
    (typeof rule?.__displayName === 'string' && rule.__displayName) ||
    (typeof rule?.__editableName === 'string' && rule.__editableName) ||
    asset.code ||
    asset.id;
  return String(display)
    .replace(/^u\d+$/i, asset.code || asset.id)
    .replace(/_/g, ' ');
}

export function buildColorSwatches(
  materials: ColorConfigMaterials
): ColorSwatchOption[] {
  return Object.entries(materials.colors).map(([hex, meta]) => {
    const normalized = normalizeHex(hex);
    const label =
      meta &&
      typeof meta === 'object' &&
      'name' in meta &&
      typeof meta.name === 'string' &&
      meta.name
        ? meta.name
        : normalized.toUpperCase();
    return { hex: normalized, label };
  });
}

export function buildColorParts(
  assets: ColorConfigAsset[],
  materials: ColorConfigMaterials
): ColorPart[] {
  const palette = buildColorSwatches(materials).map((entry) => entry.hex);
  const parts: ColorPart[] = [];

  for (const asset of assets) {
    if (asset.included === false) continue;
    const rule = materials.rules[asset.id];
    if (!rule) continue;

    const childEntries = Object.entries(rule.children ?? {});
    const meshNames = childEntries
      .filter(([, child]) => Boolean(child?.material?.[0]))
      .map(([name]) => name);

    if (!meshNames.length) continue;

    const ruleSwatches = uniqueHexes([
      ...(Array.isArray(rule.color) ? rule.color : []),
      ...childEntries.flatMap(([, child]) =>
        Array.isArray(child?.color) ? child.color : []
      ),
      ...childEntries.flatMap(([, child]) => {
        const materialId = child?.material?.[0];
        const material = materialId ? materials.materials[materialId] : null;
        return Array.isArray(material?.colors) ? material.colors : [];
      }),
    ]);

    parts.push({
      id: asset.id,
      label: `${labelFromAsset(asset, materials)} Color`,
      meshNames,
      swatches: ruleSwatches.length > 0 ? ruleSwatches : palette,
    });
  }

  return parts;
}
