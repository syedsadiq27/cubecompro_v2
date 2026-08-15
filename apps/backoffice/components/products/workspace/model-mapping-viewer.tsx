'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Button } from '@repo/ui';
import { createGltfLoader } from '@/lib/create-gltf-loader';
import type { SceneNodeInfo } from '@/lib/product-workspace';

function buildNodePath(object: THREE.Object3D, root: THREE.Object3D): string {
  const parts: string[] = [];
  let current: THREE.Object3D | null = object;
  while (current && current !== root.parent) {
    if (current.name) parts.unshift(current.name);
    if (current === root) break;
    current = current.parent;
  }
  return parts.join('/') || object.name || 'root';
}

function buildHierarchy(root: THREE.Object3D): SceneNodeInfo {
  const walk = (object: THREE.Object3D): SceneNodeInfo => {
    const isMesh = (object as THREE.Mesh).isMesh === true;
    return {
      name: object.name || (isMesh ? 'Mesh' : 'Group'),
      nodePath: buildNodePath(object, root),
      nodeType: isMesh ? 'mesh' : 'group',
      children: object.children.map(walk),
    };
  };
  return walk(root);
}

export function ModelMappingViewer({
  modelUrl,
  selectedPath,
  onSelectPath,
  onHierarchy,
}: {
  modelUrl: string | null;
  selectedPath: string | null;
  onSelectPath: (path: string) => void;
  onHierarchy: (tree: SceneNodeInfo | null) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<THREE.Object3D | null>(null);
  const materialsRef = useRef(
    new Map<string, THREE.Material | THREE.Material[]>()
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const onSelectPathRef = useRef(onSelectPath);
  const onHierarchyRef = useRef(onHierarchy);
  onSelectPathRef.current = onSelectPath;
  onHierarchyRef.current = onHierarchy;

  const applyHighlight = useCallback((path: string | null) => {
    const root = rootRef.current;
    if (!root) return;
    root.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      const keyPath = buildNodePath(mesh, root);
      if (!materialsRef.current.has(mesh.uuid)) {
        materialsRef.current.set(mesh.uuid, mesh.material);
      }
      const base = materialsRef.current.get(mesh.uuid)!;
      if (path && keyPath === path) {
        mesh.material = new THREE.MeshStandardMaterial({
          color: '#2f6fed',
          emissive: '#1d4ed8',
          emissiveIntensity: 0.25,
          metalness: 0.1,
          roughness: 0.55,
        });
      } else {
        mesh.material = base;
      }
    });
  }, []);

  useEffect(() => {
    applyHighlight(selectedPath);
  }, [selectedPath, applyHighlight]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !modelUrl) {
      onHierarchyRef.current(null);
      return;
    }

    let disposed = false;
    setLoading(true);
    setError(null);
    materialsRef.current.clear();
    rootRef.current = null;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f4f3ef');
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(2.4, 1.8, 2.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.HemisphereLight(0xffffff, 0xb0b0b0, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(3, 5, 2);
    scene.add(key);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const resize = () => {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const onPointer = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(root, true);
      const hit = hits.find((entry) => (entry.object as THREE.Mesh).isMesh);
      if (!hit) return;
      const path = buildNodePath(hit.object, root);
      onSelectPathRef.current(path);
      applyHighlight(path);
    };
    renderer.domElement.addEventListener('pointerdown', onPointer);

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    const loader = createGltfLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return;
        rootRef.current = gltf.scene;
        scene.add(gltf.scene);
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3()).length() || 1;
        const center = box.getCenter(new THREE.Vector3());
        controls.target.copy(center);
        camera.position.copy(
          center.clone().add(new THREE.Vector3(size, size * 0.7, size))
        );
        camera.near = size / 100;
        camera.far = size * 10;
        camera.updateProjectionMatrix();
        onHierarchyRef.current(buildHierarchy(gltf.scene));
        setLoading(false);
      },
      undefined,
      () => {
        if (disposed) return;
        setError('Could not load 3D model. Upload a GLB object asset.');
        setLoading(false);
        onHierarchyRef.current(null);
      }
    );

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointer);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement);
      }
      rootRef.current = null;
      onHierarchyRef.current(null);
    };
  }, [modelUrl, applyHighlight]);

  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-[12px] border border-[var(--line)] bg-[var(--canvas)]">
      <div ref={hostRef} className="absolute inset-0" />
      {loading ? (
        <p className="absolute inset-x-0 top-3 text-center text-[12px] text-[var(--text-secondary)]">
          Loading model…
        </p>
      ) : null}
      {error ? (
        <p className="absolute inset-x-4 bottom-3 text-center text-[12px] text-[var(--danger)]">
          {error}
        </p>
      ) : null}
      {!modelUrl ? (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <p className="text-[13px] text-[var(--text-secondary)]">
            Attach a library object to preview and pick parts.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function ModelPartsTree({
  tree,
  selectedPath,
  onSelectPath,
}: {
  tree: SceneNodeInfo | null;
  selectedPath: string | null;
  onSelectPath: (path: string) => void;
}) {
  if (!tree) {
    return (
      <p className="text-[13px] text-[var(--text-secondary)]">
        Model parts appear after the GLB loads.
      </p>
    );
  }

  return (
    <ul className="space-y-0.5 text-[13px]">
      <TreeNode
        node={tree}
        depth={0}
        selectedPath={selectedPath}
        onSelectPath={onSelectPath}
      />
    </ul>
  );
}

function TreeNode({
  node,
  depth,
  selectedPath,
  onSelectPath,
}: {
  node: SceneNodeInfo;
  depth: number;
  selectedPath: string | null;
  onSelectPath: (path: string) => void;
}) {
  const active = selectedPath === node.nodePath;
  return (
    <li>
      <Button
        type="button"
        size="sm"
        variant={active ? 'primary' : 'ghost'}
        onClick={() => onSelectPath(node.nodePath)}
        className="w-full justify-start rounded-md px-2 py-1.5"
        style={{ paddingLeft: 8 + depth * 12 }}
      >
        <span className="truncate">{node.name}</span>
        <span
          className={`ml-auto pl-2 text-[10px] uppercase tracking-wide ${
            active ? 'opacity-70' : 'text-[var(--text-secondary)]'
          }`}
        >
          {node.nodeType}
        </span>
      </Button>
      {node.children.length > 0 ? (
        <ul>
          {node.children.map((child) => (
            <TreeNode
              key={child.nodePath}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelectPath={onSelectPath}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
