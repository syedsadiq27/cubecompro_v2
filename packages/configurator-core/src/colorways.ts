export type PopularColorway = {
  id: string;
  displayName: string;
  thumbnailUrl?: string | null;
  commerceVariantId?: number;
  commerceVariantCode?: string;
  source: unknown;
};

export function cleanColorwayDisplayName(
  name?: string | null,
  code?: string | null
): string {
  const raw = (name || code || 'Colorway').trim();
  const withoutCodePrefix = raw.replace(/^[A-Z0-9]+[-_\s]+/i, '');
  const normalized = withoutCodePrefix
    .replace(/[_]+/g, ' / ')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return 'Colorway';

  return normalized
    .split(' / ')
    .map((part) =>
      part
        .split(' ')
        .map((token) =>
          token
            ? token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()
            : token
        )
        .join(' ')
    )
    .join(' / ');
}

export function selectPopularColorways<T extends {
  id: number | string;
  varientName?: string | null;
  varientCode?: string | null;
}>(
  variants: T[],
  options?: {
    limit?: number;
    getThumbnailUrl?: (variant: T) => string | null;
    getDisplayName?: (variant: T) => string | null | undefined;
  }
): PopularColorway[] {
  const limit = options?.limit ?? 8;
  return variants.slice(0, limit).map((variant) => {
    const configuredName = options?.getDisplayName?.(variant);
    return {
      id: String(variant.id),
      displayName:
        configuredName?.trim() ||
        cleanColorwayDisplayName(variant.varientName, variant.varientCode),
      thumbnailUrl: options?.getThumbnailUrl?.(variant) ?? null,
      commerceVariantId:
        typeof variant.id === 'number' ? variant.id : Number(variant.id) || undefined,
      commerceVariantCode: variant.varientCode ?? undefined,
      source: variant,
    };
  });
}
