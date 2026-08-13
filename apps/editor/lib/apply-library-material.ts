import * as THREE from 'three';
import type { MaterialDocument } from '@repo/product-graph';
import { findNodeByPath } from './scene-tree';

export function createStandardMaterialFromDocument(
  document: MaterialDocument,
  name?: string
): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial();
  if (name) material.name = name;
  if (document.baseColor) {
    material.color = new THREE.Color(document.baseColor);
  }
  if (typeof document.roughness === 'number') {
    material.roughness = document.roughness;
  }
  if (typeof document.metallic === 'number') {
    material.metalness = document.metallic;
  }
  if (typeof document.opacity === 'number') {
    material.opacity = document.opacity;
    material.transparent = document.opacity < 1;
  }
  if (typeof document.doubleSided === 'boolean') {
    material.side = document.doubleSided ? THREE.DoubleSide : THREE.FrontSide;
  }
  return material;
}

export function applyMaterialDocumentToNode(
  root: THREE.Object3D,
  nodePath: string,
  document: MaterialDocument,
  materialName?: string
): void {
  const node = findNodeByPath(root, nodePath);
  if (!node) return;
  const next = createStandardMaterialFromDocument(document, materialName);
  node.traverse((child) => {
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
