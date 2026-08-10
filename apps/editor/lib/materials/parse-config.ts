import type { ModelConfig } from '../api/model';
import type {
  MaterialJson,
  ObjectRule,
  ParsedModelMaterials,
} from './types';

function parseMaybeJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

export function parseModelMaterials(config: ModelConfig): ParsedModelMaterials {
  const materials = parseMaybeJson<Record<string, MaterialJson>>(
    config.materials,
    {}
  );
  const rules = parseMaybeJson<Record<string, ObjectRule>>(config.rules, {});
  const colors = parseMaybeJson<Record<string, unknown>>(config.colors, {});
  const metadata = parseMaybeJson<{ version?: number }>(config.metadata, {});

  return {
    version: metadata.version,
    materials,
    rules,
    colors,
  };
}
