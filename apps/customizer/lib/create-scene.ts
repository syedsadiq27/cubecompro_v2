import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { ENVIRONMENT_MAP_URL } from './constants';

export type SceneContext = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  ground: THREE.Mesh;
  dispose: () => void;
};

function createGroundShadow(): THREE.Mesh {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.08,
      size / 2,
      size / 2,
      size * 0.48
    );
    gradient.addColorStop(0, 'rgba(40, 36, 30, 0.28)');
    gradient.addColorStop(0.45, 'rgba(40, 36, 30, 0.12)');
    gradient.addColorStop(1, 'rgba(40, 36, 30, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.02;
  mesh.name = 'ground-shadow';
  return mesh;
}

export function createScene(container: HTMLElement): SceneContext {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2f2d2a);

  const width = container.clientWidth || 1;
  const height = container.clientHeight || 1;

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
  camera.position.set(0.13, 1.2, 10);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 0, 0);
  controls.minDistance = 1;
  controls.maxDistance = 40;
  controls.update();

  const hemi = new THREE.HemisphereLight(0xffffff, 0xb8b0a4, 0.35);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 0.55);
  key.position.set(2.5, 4, 3);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.2);
  fill.position.set(-2, 1, -1);
  scene.add(fill);

  const ground = createGroundShadow();
  scene.add(ground);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  let environmentMap: THREE.Texture | null = null;
  let pmremDisposed = false;

  const disposePmrem = () => {
    if (pmremDisposed) return;
    pmremDisposed = true;
    pmremGenerator.dispose();
  };

  new RGBELoader().load(
    ENVIRONMENT_MAP_URL,
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      environmentMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = environmentMap;
      texture.dispose();
      disposePmrem();
    },
    undefined,
    () => {
      disposePmrem();
    }
  );

  let frameId = 0;
  const animate = () => {
    frameId = window.requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  const dispose = () => {
    window.cancelAnimationFrame(frameId);
    controls.dispose();
    camera.clearViewOffset();
    ground.geometry.dispose();
    (ground.material as THREE.Material).dispose();
    const map = (ground.material as THREE.MeshBasicMaterial).map;
    map?.dispose();
    scene.environment = null;
    environmentMap?.dispose();
    environmentMap = null;
    disposePmrem();
    renderer.dispose();
    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }
  };

  return { scene, camera, renderer, controls, ground, dispose };
}

export function resizeScene(
  context: SceneContext,
  container: HTMLElement
): void {
  const width = container.clientWidth || 1;
  const height = container.clientHeight || 1;
  context.camera.aspect = width / height;
  context.renderer.setSize(width, height);
  applyCompositionOffset(context.camera, width, height);
}

export function applyCompositionOffset(
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number
): void {
  const desktop = width >= 768;

  if (!desktop) {
    camera.clearViewOffset();
    camera.updateProjectionMatrix();
    return;
  }

  const rightPanel = 390 + 40;
  const topReserve = 64;
  const offsetX = rightPanel * 0.52;
  const topOffset = height * 0.04 + topReserve * 0.2;
  const offsetY = -topOffset;

  if (Math.abs(offsetX) > 1 || Math.abs(offsetY) > 1) {
    camera.setViewOffset(width, height, offsetX, offsetY, width, height);
  } else {
    camera.clearViewOffset();
  }
  camera.updateProjectionMatrix();
}
