'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MAX_ACTIVE_PREVIEWS = 4;
const HIDE_TEARDOWN_MS = 400;
let activePreviewCount = 0;

function frameObject(
  object: THREE.Object3D,
  camera: THREE.PerspectiveCamera,
  controls?: OrbitControls | null
) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const distance = maxDim * 1.85;
  camera.near = Math.max(distance / 200, 0.01);
  camera.far = Math.max(distance * 40, 100);
  camera.position.set(
    center.x + distance * 0.85,
    center.y + distance * 0.55,
    center.z + distance * 0.95
  );
  camera.lookAt(center);
  camera.updateProjectionMatrix();
  if (controls) {
    controls.target.copy(center);
    controls.update();
  }
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];
    for (const material of materials) {
      material?.dispose?.();
    }
  });
}

function disposeRenderer(renderer: THREE.WebGLRenderer) {
  const canvas = renderer.domElement;
  try {
    renderer.forceContextLoss();
  } catch {
    /* ignore */
  }
  renderer.dispose();
  canvas.remove();
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  const lose = gl?.getExtension('WEBGL_lose_context');
  lose?.loseContext();
}

export function ModelGlbPreview({
  assetId,
  className = '',
  interactive = false,
  priority = false,
}: {
  assetId: string;
  className?: string;
  interactive?: boolean;
  priority?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(interactive || priority);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'idle'>(
    interactive || priority ? 'loading' : 'idle'
  );

  useEffect(() => {
    if (interactive || priority) {
      setActive(true);
      return;
    }
    const root = rootRef.current;
    if (!root) return;

    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = Boolean(entry?.isIntersecting);
        if (intersecting) {
          if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
          }
          setActive(true);
          return;
        }
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          setActive(false);
          hideTimer = null;
        }, HIDE_TEARDOWN_MS);
      },
      { rootMargin: '40px', threshold: 0.1 }
    );
    observer.observe(root);
    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      observer.disconnect();
    };
  }, [interactive, priority]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !active) return;

    const reserved = interactive || priority;
    if (!reserved && activePreviewCount >= MAX_ACTIVE_PREVIEWS) {
      setStatus('idle');
      return;
    }

    let disposed = false;
    let frame = 0;
    let root: THREE.Object3D | null = null;
    let controls: OrbitControls | null = null;
    let objectUrl: string | null = null;
    activePreviewCount += 1;
    setStatus('loading');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    if (!interactive) {
      renderer.domElement.style.pointerEvents = 'none';
    }
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xb8b2a8, 1.05));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(2.5, 4, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(-2, 1, -1.5);
    scene.add(fill);

    if (interactive) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
    }

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const tick = () => {
      if (disposed) return;
      frame = requestAnimationFrame(tick);
      if (root && !interactive) {
        root.rotation.y += 0.008;
      }
      controls?.update();
      renderer.render(scene, camera);
    };
    tick();

    (async () => {
      try {
        const response = await fetch(`/api/documents/objects/${assetId}`, {
          cache: 'force-cache',
        });
        if (!response.ok) throw new Error('Failed to load model');
        const blob = await response.blob();
        if (disposed) return;
        objectUrl = URL.createObjectURL(blob);
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(objectUrl);
        if (disposed) {
          disposeObject(gltf.scene);
          return;
        }
        root = gltf.scene;
        scene.add(root);
        frameObject(root, camera, controls);
        setStatus('ready');
      } catch {
        if (!disposed) setStatus('error');
      }
    })();

    return () => {
      disposed = true;
      activePreviewCount = Math.max(0, activePreviewCount - 1);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      controls?.dispose();
      if (root) {
        scene.remove(root);
        disposeObject(root);
      }
      disposeRenderer(renderer);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [assetId, interactive, active, priority]);

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#f7f4ef,transparent_55%),linear-gradient(160deg,#e8e4de,#d5d0c8)] ${className}`}
    >
      <div ref={mountRef} className="absolute inset-0" />
      {status === 'loading' || status === 'idle' ? (
        <p className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 text-center text-[11px] text-[var(--text-secondary)]">
          {status === 'idle' ? '3D' : 'Loading 3D…'}
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="pointer-events-none absolute inset-x-2 top-1/2 z-10 -translate-y-1/2 text-center text-[11px] text-[var(--danger)]">
          Preview unavailable
        </p>
      ) : null}
    </div>
  );
}
