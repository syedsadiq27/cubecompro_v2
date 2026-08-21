'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  coerceMaterialDocument,
  type MaterialDocument,
} from '@repo/product-graph';

function hexToColor(hex: string | undefined): THREE.Color {
  try {
    return new THREE.Color(hex || '#8A6040');
  } catch {
    return new THREE.Color('#8A6040');
  }
}

export function MaterialSpherePreview({
  document,
  className = '',
}: {
  document: MaterialDocument | null;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const width = host.clientWidth || 160;
    const height = host.clientHeight || 120;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 20);
    camera.position.set(0, 0.15, 2.35);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    host.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xffffff, 0xb0b0b0, 1.05);
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(2.2, 3.2, 2.4);
    const fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(-2, 0.5, -1);
    scene.add(hemi, key, fill);

    const doc = coerceMaterialDocument(document ?? {});
    const material = new THREE.MeshStandardMaterial({
      color: hexToColor(doc.baseColor),
      roughness: doc.roughness ?? 0.55,
      metalness: doc.metallic ?? 0,
      transparent: (doc.opacity ?? 1) < 1,
      opacity: doc.opacity ?? 1,
    });
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.72, 48, 48),
      material
    );
    scene.add(mesh);

    let frame = 0;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      mesh.rotation.y += 0.008;
      mesh.rotation.x = Math.sin(performance.now() / 2400) * 0.12;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      const w = host.clientWidth || 160;
      const h = host.clientHeight || 120;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(host);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [document]);

  return (
    <div
      ref={hostRef}
      className={`relative overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#f4f1ec,transparent_55%),linear-gradient(160deg,#e8e4de,#d5d0c8)] ${className}`}
    />
  );
}

const documentCache = new Map<string, MaterialDocument | null>();

export function clearMaterialDocumentCache(assetId?: string) {
  if (assetId) documentCache.delete(assetId);
  else documentCache.clear();
}

export function useMaterialDocument(
  assetId: string | null,
  enabled: boolean
) {
  const [document, setDocument] = useState<MaterialDocument | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !assetId) {
      setDocument(null);
      return;
    }
    if (documentCache.has(assetId)) {
      setDocument(documentCache.get(assetId) ?? null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const response = await fetch(`/api/documents/materials/${assetId}`, {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('load failed');
        const json = await response.json();
        const doc = coerceMaterialDocument(json);
        documentCache.set(assetId, doc);
        if (!cancelled) setDocument(doc);
      } catch {
        documentCache.set(assetId, null);
        if (!cancelled) setDocument(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [assetId, enabled]);

  return { document, loading };
}
