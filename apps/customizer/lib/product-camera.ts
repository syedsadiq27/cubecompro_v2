import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export type ProductCameraConfig = {
  x?: number;
  y?: number;
  z?: number;
  fov?: number;
  near?: number;
  far?: number;
  uniqueName?: string;
} | null;

export const HEADWEAR_CAMERA_POSITIONS = {
  front: new THREE.Vector3(0.12772396703751588, 1.2046138166500373, 9.98921565760859),
  right: new THREE.Vector3(-9.759244166223146, 0.5575519067043104, -2.167572888300824),
  left: new THREE.Vector3(9.936591630778636, 0.5575519067043104, -1.0878524688950457),
  back: new THREE.Vector3(0.05070109699264769, 0.48567321000318037, -9.994930118207632),
} as const;

export function applyProductCamera(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  cameraData?: ProductCameraConfig,
  options?: {
    fallback?: keyof typeof HEADWEAR_CAMERA_POSITIONS;
    pullBack?: number;
  }
): void {
  const fallbackKey = options?.fallback ?? 'front';
  const fallback = HEADWEAR_CAMERA_POSITIONS[fallbackKey];

  if (cameraData?.fov) camera.fov = cameraData.fov;
  if (cameraData?.far) camera.far = cameraData.far;
  if (cameraData?.near) camera.near = cameraData.near;

  const hasPosition =
    typeof cameraData?.x === 'number' &&
    typeof cameraData?.y === 'number' &&
    typeof cameraData?.z === 'number';

  if (hasPosition) {
    camera.position.set(cameraData.x!, cameraData.y!, cameraData.z!);
  } else {
    camera.position.copy(fallback);
    if (!cameraData?.fov) camera.fov = 40;
  }

  if (cameraData?.uniqueName) {
    camera.name = cameraData.uniqueName;
  }

  controls.target.set(0, 0, 0);

  const pullBack = options?.pullBack ?? 1.14;
  const offset = camera.position.clone().sub(controls.target).multiplyScalar(pullBack);
  camera.position.copy(controls.target).add(offset);

  controls.update();
}

export function placeGroundUnderObject(
  object: THREE.Object3D,
  ground: THREE.Mesh
): void {
  const box = new THREE.Box3().setFromObject(object);
  if (box.isEmpty()) return;
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = Math.max(size.x, size.z) * 2.2 || 1.6;
  ground.scale.set(scale, scale, 1);
  ground.position.set(center.x, box.min.y - 0.01, center.z);
}
