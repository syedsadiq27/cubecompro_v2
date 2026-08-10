import type { ColorwayGroup, ColorwayVariant } from './types';

function groupLabelFromCode(code: string): string {
  const cleaned = code.trim();
  if (!cleaned) return 'All';
  const match = cleaned.match(/^([A-Za-z]+)/);
  if (match?.[1]) {
    const token = match[1];
    if (/solid/i.test(token)) return 'Solid';
    if (/camo/i.test(token)) return 'Camo';
    if (/pattern/i.test(token)) return 'Pattern';
    return token.charAt(0).toUpperCase() + token.slice(1);
  }
  return 'All';
}

export function groupColorways(variants: ColorwayVariant[]): ColorwayGroup[] {
  const groups = new Map<string, ColorwayVariant[]>();

  for (const variant of variants) {
    const label = groupLabelFromCode(variant.varientCode || variant.varientName || '');
    const existing = groups.get(label) ?? [];
    existing.push(variant);
    groups.set(label, existing);
  }

  if (groups.size <= 1) {
    return [
      {
        id: 'all',
        label: 'Colorways',
        variants: [...variants],
      },
    ];
  }

  return Array.from(groups.entries()).map(([label, items]) => ({
    id: label.toLowerCase(),
    label,
    variants: items,
  }));
}

export function getVariantThumbnailUrl(
  variant: ColorwayVariant,
  imageBaseUrl: string
): string | null {
  const media = Array.isArray(variant.media)
    ? variant.media[0]
    : variant.media;
  const path = media?.Image_URL;
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = imageBaseUrl.endsWith('/') ? imageBaseUrl : `${imageBaseUrl}/`;
  return `${base}${path.replace(/^\//, '')}`;
}
