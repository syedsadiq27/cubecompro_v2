import type * as THREE from 'three';

export function cleanNodeName(name: string): string {
  if (!name) return 'Object';
  // Check if it's an auto-generated raw hash or UUID
  if (/^[0-9a-f]{16,}$/i.test(name)) {
    return 'Component';
  }
  // Replace long underscores or formatting
  let cleaned = name
    .replace(/^([a-z0-9]+)___+/i, '')
    .replace(/_+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();

  // Capitalize words nicely
  if (cleaned) {
    cleaned = cleaned
      .split(' ')
      .map((word) =>
        word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : ''
      )
      .join(' ');
  }
  return cleaned || name || 'Object';
}

export function nodeLabel(node: THREE.Object3D): string {
  if (typeof node.userData.name === 'string' && node.userData.name) {
    return cleanNodeName(node.userData.name);
  }
  return cleanNodeName(node.name);
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

export type SceneNodeKind = 'mesh' | 'group' | 'empty';

export type SceneTreeNode = {
  object: THREE.Object3D;
  label: string;
  kind: SceneNodeKind;
  depth: number;
  children: SceneTreeNode[];
};

export function sceneNodeKind(object: THREE.Object3D): SceneNodeKind {
  const mesh = object as THREE.Mesh;
  if (mesh.isMesh) return 'mesh';
  if (object.children.length > 0) return 'group';
  return 'empty';
}

function isRedundantWrapper(node: THREE.Object3D): boolean {
  if (node.children.length !== 1) return false;
  const name = (node.name || '').toLowerCase();
  return (
    name.includes('sketchfab') ||
    name === 'rootnode' ||
    name === 'model' ||
    name === 'scene' ||
    name === 'osg_scene' ||
    /^[0-9a-f]{16,}$/i.test(node.name)
  );
}

function unwrapNode(node: THREE.Object3D): THREE.Object3D {
  let current = node;
  while (isRedundantWrapper(current) && current.children[0]) {
    current = current.children[0]!;
  }
  return current;
}

export function buildSceneTree(
  root: THREE.Object3D,
  depth = 0
): SceneTreeNode[] {
  const unwrapped = unwrapNode(root);
  return unwrapped.children
    .filter((child) => child.name || child.children.length > 0)
    .map((rawChild) => {
      const child = unwrapNode(rawChild);
      return {
        object: child,
        label: nodeLabel(child),
        kind: sceneNodeKind(child),
        depth,
        children: buildSceneTree(child, depth + 1),
      };
    });
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
