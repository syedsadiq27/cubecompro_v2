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
  const base = ctx.createLinearGradient(0, 0, size, size);
  base.addColorStop(0, '#cfc5b6');
  base.addColorStop(0.5, '#d8d0c2');
  base.addColorStop(1, '#c8bfb0');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 64) {
    ctx.fillStyle = y % 128 === 0 ? '#c3b9a9' : '#d2caba';
    ctx.fillRect(0, y, size, 64);
    ctx.strokeStyle = 'rgba(90, 72, 52, 0.08)';
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(size, y + 0.5);
    ctx.stroke();
  }

  for (let i = 0; i < 14000; i += 1) {
    const x = rand() * size;
    const y = rand() * size;
    const a = 0.015 + rand() * 0.04;
    ctx.fillStyle = `rgba(70, 55, 40, ${a})`;
    ctx.fillRect(x, y, 1, 1);
  }

  const sheen = ctx.createRadialGradient(
    size * 0.35,
    size * 0.3,
    size * 0.05,
    size * 0.5,
    size * 0.5,
    size * 0.65
  );
  sheen.addColorStop(0, 'rgba(255, 248, 235, 0.16)');
  sheen.addColorStop(1, 'rgba(255, 248, 235, 0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, size, size);

  floorTexture = new CanvasTexture(canvas);
  floorTexture.wrapS = RepeatWrapping;
  floorTexture.wrapT = RepeatWrapping;
  floorTexture.repeat.set(3.5, 3.5);
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
  gradient.addColorStop(0, '#f3eee6');
  gradient.addColorStop(0.45, '#ebe4d8');
  gradient.addColorStop(1, '#d9d0c2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const vignette = ctx.createRadialGradient(
    size * 0.5,
    size * 0.35,
    size * 0.1,
    size * 0.5,
    size * 0.5,
    size * 0.75
  );
  vignette.addColorStop(0, 'rgba(255,255,255,0)');
  vignette.addColorStop(1, 'rgba(120, 100, 80, 0.12)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, size, size);

  wallTexture = new CanvasTexture(canvas);
  wallTexture.colorSpace = SRGBColorSpace;
  wallTexture.needsUpdate = true;
  return wallTexture;
}
