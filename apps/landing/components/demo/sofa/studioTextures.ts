'use client';

import {
  CanvasTexture,
  LinearFilter,
  RepeatWrapping,
  SRGBColorSpace,
} from 'three';

let floorTexture: CanvasTexture | null = null;
let wallTexture: CanvasTexture | null = null;

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getStudioFloorTexture() {
  if (floorTexture) {
    return floorTexture;
  }

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  const rand = mulberry32(42);
  const base = ctx.createRadialGradient(
    size * 0.5,
    size * 0.45,
    size * 0.08,
    size * 0.5,
    size * 0.5,
    size * 0.72
  );
  base.addColorStop(0, '#ECE9E2');
  base.addColorStop(0.55, '#E2DDD4');
  base.addColorStop(1, '#D8D5CE');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 9000; i += 1) {
    const x = rand() * size;
    const y = rand() * size;
    const a = 0.01 + rand() * 0.028;
    ctx.fillStyle = `rgba(80, 70, 55, ${a})`;
    ctx.fillRect(x, y, 1, 1);
  }

  const sheen = ctx.createRadialGradient(
    size * 0.42,
    size * 0.38,
    size * 0.04,
    size * 0.5,
    size * 0.5,
    size * 0.55
  );
  sheen.addColorStop(0, 'rgba(255, 252, 246, 0.18)');
  sheen.addColorStop(1, 'rgba(255, 252, 246, 0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, size, size);

  floorTexture = new CanvasTexture(canvas);
  floorTexture.wrapS = RepeatWrapping;
  floorTexture.wrapT = RepeatWrapping;
  floorTexture.repeat.set(1.6, 1.6);
  floorTexture.colorSpace = SRGBColorSpace;
  floorTexture.minFilter = LinearFilter;
  floorTexture.magFilter = LinearFilter;
  floorTexture.needsUpdate = true;
  return floorTexture;
}

export function getStudioWallTexture() {
  if (wallTexture) {
    return wallTexture;
  }

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, '#F5F3EE');
  gradient.addColorStop(0.5, '#ECE9E2');
  gradient.addColorStop(1, '#E2DDD4');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const vignette = ctx.createRadialGradient(
    size * 0.5,
    size * 0.4,
    size * 0.12,
    size * 0.5,
    size * 0.5,
    size * 0.78
  );
  vignette.addColorStop(0, 'rgba(255,255,255,0)');
  vignette.addColorStop(1, 'rgba(90, 85, 75, 0.08)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, size, size);

  wallTexture = new CanvasTexture(canvas);
  wallTexture.colorSpace = SRGBColorSpace;
  wallTexture.needsUpdate = true;
  return wallTexture;
}
