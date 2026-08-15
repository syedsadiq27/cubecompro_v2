export type ReplaceComponentValue = {
  linkedAssetKey: string;
  role: 'OBJECT';
};

export function isReplaceComponentValue(
  value: unknown
): value is ReplaceComponentValue {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const raw = value as {
    linkedAssetKey?: unknown;
    role?: unknown;
  };
  return (
    typeof raw.linkedAssetKey === 'string' &&
    raw.linkedAssetKey.trim().length > 0 &&
    raw.role === 'OBJECT'
  );
}

export function parseReplaceComponentValue(
  value: unknown
): ReplaceComponentValue {
  if (!isReplaceComponentValue(value)) {
    throw new Error(
      'REPLACE_COMPONENT value must be { linkedAssetKey: string, role: "OBJECT" }'
    );
  }
  return {
    linkedAssetKey: value.linkedAssetKey.trim(),
    role: 'OBJECT',
  };
}

export function replaceComponentValueJson(linkedAssetKey: string): string {
  return JSON.stringify({
    linkedAssetKey: linkedAssetKey.trim(),
    role: 'OBJECT',
  });
}
