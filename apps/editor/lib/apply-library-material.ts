import * as THREE from 'three';
import {
  MATERIAL_FACTORS,
  type MaterialDocument,
  type MaterialFactorProperty,
} from '@repo/product-graph';
import { findNodeByPath } from './scene-tree';

export function createStandardMaterialFromDocument(
  document: MaterialDocument,
  name?: string
): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial();
  if (name) material.name = name;
  for (const factor of MATERIAL_FACTORS) {
    applyMaterialFactor(material, factor, document[factor.key]);
  }
  return material;
}

export function applyMaterialDocumentToObject(
  object: THREE.Object3D,
  document: MaterialDocument,
  materialName?: string
): void {
  const next = createStandardMaterialFromDocument(document, materialName);
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const previous = mesh.material;
    mesh.material = next.clone();
    if (Array.isArray(previous)) {
      previous.forEach((entry) => entry.dispose());
    } else if (previous) {
      previous.dispose();
    }
  });
}

export function applyMaterialDocumentToNode(
  root: THREE.Object3D,
  nodePath: string,
  document: MaterialDocument,
  materialName?: string
): void {
  const node = findNodeByPath(root, nodePath);
  if (!node) return;
  applyMaterialDocumentToObject(node, document, materialName);
}

function applyMaterialFactor(
  material: THREE.MeshStandardMaterial,
  factor: MaterialFactorProperty,
  value: unknown
): void {
  if (value === undefined || value === null) return;

  if (factor.type === 'color' && typeof value === 'string') {
    const color = new THREE.Color(value);
    if (factor.three === 'color') material.color = color;
    if (factor.three === 'emissive') material.emissive = color;
    return;
  }

  if (factor.type === 'number' && typeof value === 'number') {
    if (factor.three === 'roughness') material.roughness = value;
    if (factor.three === 'metalness') material.metalness = value;
    if (factor.three === 'opacity') {
      material.opacity = value;
      if (
        typeof factor.transparentBelow === 'number' &&
        value < factor.transparentBelow
      ) {
        material.transparent = true;
      }
    }
    return;
  }

  if (
    factor.type === 'boolean' &&
    typeof value === 'boolean' &&
    factor.three === 'side'
  ) {
    material.side = value ? THREE.DoubleSide : THREE.FrontSide;
  }
}
