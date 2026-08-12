import type * as THREE from 'three';

export function nodeLabel(node: THREE.Object3D): string {
  if (typeof node.userData.name === 'string' && node.userData.name) {
    return node.userData.name;
  }
  return node.name || 'Object';
}

export function buildNodePath(
  object: THREE.Object3D,
  root: THREE.Object3D
): string {
  const parts: string[] = [];
  let current: THREE.Object3D | null = object;
  while (current && current !== root.parent) {
    if (current.name) parts.unshift(current.name);
    if (current === root) break;
    current = current.parent;
  }
  return parts.join('/') || object.name || 'root';
}

export function findNodeByPath(
  root: THREE.Object3D,
  nodePath: string
): THREE.Object3D | null {
  if (!nodePath) return null;
  const parts = nodePath.split('/').filter(Boolean);
  let current: THREE.Object3D = root;
  for (const part of parts) {
    const next = current.children.find((child) => child.name === part);
    if (!next) {
      let found: THREE.Object3D | null = null;
      current.traverse((node) => {
        if (!found && node.name === part) found = node;
      });
      if (!found) return null;
      current = found;
      continue;
    }
    current = next;
  }
  return current;
}

export function semanticKeyFromName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export type SceneTreeNode = {
  object: THREE.Object3D;
  label: string;
  depth: number;
  children: SceneTreeNode[];
};

export function buildSceneTree(
  root: THREE.Object3D,
  depth = 0
): SceneTreeNode[] {
  return root.children
    .filter((child) => child.name || child.children.length > 0)
    .map((child) => ({
      object: child,
      label: nodeLabel(child),
      depth,
      children: buildSceneTree(child, depth + 1),
    }));
}

export function collectSceneMaterials(root: THREE.Object3D): string[] {
  const names = new Set<string>();
  root.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];
    for (const material of materials) {
      const name = material.name?.trim();
      if (name) names.add(name);
    }
  });
  return [...names].sort((a, b) => a.localeCompare(b));
}
