import type * as THREE from 'three';

function parseHex(color: string): number {
  const normalized = color.trim().replace('#', '').replace(/^0x/i, '');
  return Number.parseInt(normalized, 16);
}

function isMesh(node: THREE.Object3D): node is THREE.Mesh {
  return Boolean((node as THREE.Mesh).isMesh);
}

export function applyPartColor(
  root: THREE.Object3D,
  partId: string,
  hex: string,
  materialCache?: Map<string, THREE.Material>
): boolean {
  const target = root.getObjectByName(partId);
  if (!target) return false;

  const colorValue = parseHex(hex);
  if (!Number.isFinite(colorValue)) return false;

  let applied = false;

  target.traverse((node) => {
    if (!isMesh(node)) return;
    const materialId =
      typeof node.userData.material === 'string'
        ? node.userData.material
        : undefined;

    let material = node.material as THREE.Material;
    if (materialId && materialCache?.get(materialId)) {
      material = materialCache.get(materialId)!;
      node.material = material;
    } else if (Array.isArray(node.material)) {
      node.material = node.material.map((entry) => entry.clone());
      material = node.material[0]!;
    } else {
      material = node.material.clone();
      node.material = material;
    }

    const colored = material as THREE.MeshStandardMaterial;
    if (!('color' in colored) || !colored.color) return;
    colored.color.setHex(colorValue);
    colored.needsUpdate = true;
    applied = true;
  });

  return applied;
}
