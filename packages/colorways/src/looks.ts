import type { ColorwayVariant } from './types';

function parseVariantConfiguration(
  configuration: string | Record<string, { color?: string }>
): Record<string, { color?: string }> {
  if (configuration && typeof configuration === 'object') {
    return configuration;
  }
  if (typeof configuration !== 'string' || !configuration.trim()) {
    return {};
  }
  try {
    const parsed = JSON.parse(configuration) as Record<
      string,
      { color?: string }
    >;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function normalizeHex(color?: string | null): string | null {
  if (!color) return null;
  const normalized = color.trim().replace(/^0x/i, '#');
  if (/^#[0-9a-fA-F]{6}$/.test(normalized)) return normalized.toLowerCase();
  if (/^[0-9a-fA-F]{6}$/.test(normalized)) return `#${normalized.toLowerCase()}`;
  return null;
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join(' ');
}

export type ColorwayLook = {
  id: string;
  title: string;
  descriptor: string;
  accents: string[];
  partSummary: string;
  thumbnailUrl?: string | null;
  commerceVariantId?: number;
  commerceVariantCode?: string;
  source: ColorwayVariant;
};

export function buildColorwayLook(
  variant: ColorwayVariant,
  options?: {
    thumbnailUrl?: string | null;
    displayName?: string | null;
  }
): ColorwayLook {
  const display =
    options?.displayName?.trim() ||
    titleCase(
      (variant.varientName || variant.varientCode || 'Colorway')
        .replace(/[_]+/g, ' / ')
        .replace(/\s*\/\s*/g, ' / ')
    );

  const parts = display.split(' / ').map((part) => part.trim()).filter(Boolean);
  const uniqueParts = [...new Set(parts.map((part) => part.toLowerCase()))];

  let title = display;
  let descriptor = 'Signature look';

  if (uniqueParts.length === 1) {
    title = parts[0] === 'Black' ? 'All Black' : `${parts[0]}`;
    descriptor =
      parts[0]?.toLowerCase() === 'black'
        ? 'Clean monochrome'
        : 'Solid colorway';
  } else if (parts.length >= 2) {
    title = `${parts[0]} Contrast`;
    descriptor = `${parts[0]} · ${parts.slice(1).join(' · ')}`;
  }

  const config = parseVariantConfiguration(variant.configuration);
  const accents = Object.values(config)
    .map((entry) => normalizeHex(entry.color))
    .filter((hex): hex is string => Boolean(hex));
  const uniqueAccents = [...new Set(accents)].slice(0, 3);

  const partLabels = Object.keys(config)
    .map((name) =>
      name
        .replace(/_/g, ' ')
        .replace(/color$/i, '')
        .trim()
    )
    .filter(Boolean)
    .slice(0, 3);

  const partSummary =
    partLabels.length > 0
      ? partLabels.map(titleCase).join(' · ')
      : parts.join(' · ');

  return {
    id: String(variant.id),
    title,
    descriptor,
    accents: uniqueAccents,
    partSummary,
    thumbnailUrl: options?.thumbnailUrl ?? null,
    commerceVariantId: variant.id,
    commerceVariantCode: variant.varientCode,
    source: variant,
  };
}

export function selectSignatureLooks(
  variants: ColorwayVariant[],
  options?: {
    limit?: number;
    getThumbnailUrl?: (variant: ColorwayVariant) => string | null;
    getDisplayName?: (variant: ColorwayVariant) => string | null | undefined;
  }
): ColorwayLook[] {
  const limit = options?.limit ?? 4;
  return variants.slice(0, limit).map((variant) =>
    buildColorwayLook(variant, {
      thumbnailUrl: options?.getThumbnailUrl?.(variant) ?? null,
      displayName: options?.getDisplayName?.(variant),
    })
  );
}

export function extractLookAccents(variant: ColorwayVariant): string[] {
  return buildColorwayLook(variant).accents;
}
