'use client';

import { useTexture } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useLayoutEffect, useMemo } from 'react';
import {
  CanvasTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

export type CorduroyTextures = {
  albedo: Texture;
  normal: Texture;
  roughness: Texture;
};

function configureMap(
  texture: Texture,
  repeat: number,
  colorSpace: typeof SRGBColorSpace | typeof NoColorSpace
) {
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.anisotropy = 8;
  texture.colorSpace = colorSpace;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function toLuminanceAlbedo(source: Texture): CanvasTexture {
  const image = source.image as
    | HTMLImageElement
    | HTMLCanvasElement
    | ImageBitmap;

  const width =
    'naturalWidth' in image
      ? image.naturalWidth || image.width
      : image.width;
  const height =
    'naturalHeight' in image
      ? image.naturalHeight || image.height
      : image.height;

  const canvas = document.createElement('canvas');
  canvas.width = width || 1024;
  canvas.height = height || 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return source as CanvasTexture;
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = frame.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    const luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const lifted = Math.min(255, luminance * 1.35 + 28);
    data[i] = lifted;
    data[i + 1] = lifted;
    data[i + 2] = lifted;
  }

  ctx.putImageData(frame, 0, 0);
  const albedo = new CanvasTexture(canvas);
  albedo.flipY = source.flipY;
  return albedo;
}

export function useFabricTextures(repeat = 2.1): CorduroyTextures {
  const [diffuse] = useTexture(['/textures/ribbed_corduroy_diff_1k.jpg']);
  const normal = useLoader(
    EXRLoader,
    '/textures/ribbed_corduroy_nor_gl_1k.exr'
  );
  const roughness = useLoader(
    EXRLoader,
    '/textures/ribbed_corduroy_rough_1k.exr'
  );

  const albedo = useMemo(() => toLuminanceAlbedo(diffuse!), [diffuse]);

  useLayoutEffect(() => {
    configureMap(albedo, repeat, SRGBColorSpace);
    configureMap(normal, repeat, NoColorSpace);
    configureMap(roughness, repeat, NoColorSpace);
  }, [albedo, normal, roughness, repeat]);

  return { albedo, normal, roughness };
}
