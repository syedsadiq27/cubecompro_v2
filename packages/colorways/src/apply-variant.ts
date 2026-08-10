import type * as THREE from 'three';
import type { ColorwayVariant, ColorwayVariantConfigEntry } from './types';

function parseVariantConfiguration(
  configuration: string | Record<string, ColorwayVariantConfigEntry>
): Record<string, ColorwayVariantConfigEntry> {
  if (configuration && typeof configuration === 'object') {
    return configuration;
  }
  if (typeof configuration !== 'string' || !configuration.trim()) {
    return {};
  }
  try {
    const parsed = JSON.parse(configuration) as Record<
      string,
      ColorwayVariantConfigEntry
    >;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function parseHex(color: string): number | null {
  const normalized = color.trim().replace('#', '').replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;
  const value = Number.parseInt(expanded, 16);
  return Number.isFinite(value) ? value : null;
}

function isMesh(node: THREE.Object3D): node is THREE.Mesh {
  return Boolean((node as THREE.Mesh).isMesh);
}

function isCachedMaterial(
  material: THREE.Material,
  materialCache?: Map<string, THREE.Material>
): boolean {
  if (!materialCache) return false;
  for (const cached of materialCache.values()) {
    if (cached === material) return true;
  }
  return false;
}

function resolveMaterial(
  node: THREE.Mesh,
  materialId: string | undefined,
  materialCache?: Map<string, THREE.Material>
): THREE.MeshStandardMaterial | null {
  const current = node.material;
  if (Array.isArray(current)) return null;

  const base =
    materialId && materialCache?.has(materialId)
      ? materialCache.get(materialId)!
      : current;

  if (!base) return null;

  const next = base.clone() as THREE.MeshStandardMaterial;
  if (base.uuid) {
    Object.defineProperty(next, 'uuid', {
      value: base.uuid,
      writable: true,
      configurable: true,
    });
  }

  if (current && current !== base && !isCachedMaterial(current, materialCache)) {
    current.dispose();
  }

  node.material = next;
  return next;
}

export function applyVariant(
  root: THREE.Object3D,
  variant: ColorwayVariant,
  materialCache?: Map<string, THREE.Material>
): boolean {
  const config = parseVariantConfiguration(variant.configuration);
  let applied = false;

  root.traverse((node) => {
    if (!isMesh(node)) return;
    if (node.userData?.isDecorationMesh) return;

    const entry = config[node.name];
    if (!entry || typeof entry !== 'object') return;

    const material = resolveMaterial(
      node,
      entry.materialUUID,
      materialCache
    );
    if (!material) return;

    if (entry.materialUserData) {
      material.userData = {
        ...material.userData,
        ...entry.materialUserData,
      };
    }

    if (entry.color && 'color' in material && material.color) {
      const hex = parseHex(String(entry.color));
      if (hex != null) {
        material.color.setHex(hex);
        applied = true;
      }
    }

    material.needsUpdate = true;
  });

  return applied;
}
