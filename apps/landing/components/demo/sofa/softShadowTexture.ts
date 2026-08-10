'use client';

import { CanvasTexture } from 'three';

let cachedShadow: CanvasTexture | null = null;

export function getSoftShadowTexture() {
  if (cachedShadow) {
    return cachedShadow;
  }

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size * 0.48
  );
  gradient.addColorStop(0, 'rgba(40, 32, 24, 0.45)');
  gradient.addColorStop(0.45, 'rgba(40, 32, 24, 0.18)');
  gradient.addColorStop(1, 'rgba(40, 32, 24, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  cachedShadow = new CanvasTexture(canvas);
  cachedShadow.needsUpdate = true;
  return cachedShadow;
}
