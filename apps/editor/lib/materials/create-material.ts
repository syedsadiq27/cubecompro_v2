import * as THREE from 'three';
import { getImageBaseUrl } from '../env';
import type {
  MaterialJson,
  MaterialMapSource,
  TextureCatalogItem,
} from './types';
import {
  BOOLEAN_PROPERTIES,
  COLOR_MAP_PROPERTIES,
  MAP_COLOR_SPACES,
  NUMBER_PROPERTIES,
} from './types';

function resolveImageUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  return `${getImageBaseUrl()}${pathOrUrl.replace(/^\//, '')}`;
}

function parseColorHex(value: string | number): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    const normalized =
      hex.length === 3
        ? hex
            .split('')
            .map((char) => char + char)
            .join('')
        : hex;
    const parsed = Number.parseInt(normalized, 16);
    return Number.isFinite(parsed) ? parsed : null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function createMaterialByType(type?: string): THREE.Material {
  switch (type) {
    case 'MeshBasicMaterial':
      return new THREE.MeshBasicMaterial();
    case 'MeshLambertMaterial':
      return new THREE.MeshLambertMaterial();
    case 'MeshPhongMaterial':
      return new THREE.MeshPhongMaterial();
    case 'MeshPhysicalMaterial':
      return new THREE.MeshPhysicalMaterial();
    case 'MeshToonMaterial':
      return new THREE.MeshToonMaterial();
    case 'MeshMatcapMaterial':
      return new THREE.MeshMatcapMaterial();
    case 'MeshNormalMaterial':
      return new THREE.MeshNormalMaterial();
    case 'MeshDepthMaterial':
      return new THREE.MeshDepthMaterial();
    case 'ShadowMaterial':
      return new THREE.ShadowMaterial();
    case 'MeshStandardMaterial':
    default:
      return new THREE.MeshStandardMaterial();
  }
}

function resolveMapUrl(
  source: MaterialMapSource,
  texturesById: Map<number, TextureCatalogItem>
): string | null {
  if (source.id != null) {
    const item = texturesById.get(source.id);
    const fromCatalog = item?.ProductMedium?.Image_URL;
    if (fromCatalog) return resolveImageUrl(fromCatalog);
  }
  if (source.path) return resolveImageUrl(source.path);
  if (source.url) return resolveImageUrl(source.url);
  return null;
}

function loadTexture(
  url: string,
  colorSpace: THREE.ColorSpace,
  flipY?: boolean
): Promise<THREE.Texture> {
  const loader = new THREE.TextureLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = colorSpace;
        if (flipY !== undefined) texture.flipY = flipY;
        texture.needsUpdate = true;
        resolve(texture);
      },
      undefined,
      reject
    );
  });
}

export async function createMaterialFromJson(
  json: MaterialJson,
  options: {
    version?: number;
    texturesById: Map<number, TextureCatalogItem>;
    cache: Map<string, THREE.Material>;
  }
): Promise<THREE.Material> {
  const cached = options.cache.get(json.uuid);
  if (cached) return cached;

  const material = createMaterialByType(json.type) as THREE.MeshStandardMaterial &
    Record<string, unknown>;

  if (json.uuid) {
    Object.defineProperty(material, 'uuid', {
      value: json.uuid,
      writable: true,
      configurable: true,
    });
  }
  if (json.name) material.name = json.name;
  if (json.side !== undefined) {
    material.side = json.side as THREE.Side;
  }
  if (json.userData) material.userData = { ...json.userData };

  for (const property of COLOR_MAP_PROPERTIES) {
    const raw = json[property];
    if (raw == null || !(property in material)) continue;
    const hex = parseColorHex(raw as string | number);
    if (hex == null) continue;
    const color = material[property] as THREE.Color;
    color.setHex(hex);
    if (!options.version || options.version === 1.0) {
      color.convertSRGBToLinear();
    }
  }

  for (const property of BOOLEAN_PROPERTIES) {
    if (json[property] !== undefined && property in material) {
      material[property] = Boolean(json[property]);
    }
  }

  for (const property of NUMBER_PROPERTIES) {
    if (json[property] !== undefined && property in material) {
      material[property] = Number.parseFloat(String(json[property]));
    }
  }

  if (json.normalScale && 'normalScale' in material && material.normalScale) {
    material.normalScale = new THREE.Vector2(
      Number.parseFloat(String(json.normalScale[0])),
      Number.parseFloat(String(json.normalScale[1]))
    );
  }

  const mapping = json.userData?.map ?? {};
  const mapLoads: Promise<void>[] = [];

  for (const [property, source] of Object.entries(mapping)) {
    if (!source || !(property in material)) continue;
    const url = resolveMapUrl(source, options.texturesById);
    if (!url) continue;
    const colorSpace = MAP_COLOR_SPACES[property] ?? THREE.NoColorSpace;
    mapLoads.push(
      loadTexture(url, colorSpace, source.flipY).then((texture) => {
        const previous = material[property] as THREE.Texture | null | undefined;
        previous?.dispose?.();
        material[property] = texture;
      })
    );
  }

  await Promise.all(mapLoads);

  if (mapping.alphaMap && 'transparent' in material) {
    material.transparent = true;
    if (!material.alphaTest || material.alphaTest <= 0) {
      material.alphaTest = 0.5;
    }
  }

  material.needsUpdate = true;
  options.cache.set(json.uuid, material);
  return material;
}

export function ensureAoMapUvs(mesh: THREE.Mesh): void {
  const material = mesh.material;
  const materials = Array.isArray(material) ? material : [material];
  const needsUv2 = materials.some(
    (entry) => entry && 'aoMap' in entry && Boolean((entry as THREE.MeshStandardMaterial).aoMap)
  );
  if (!needsUv2) return;
  const geometry = mesh.geometry;
  if (geometry.getAttribute('uv') && !geometry.getAttribute('uv2')) {
    geometry.setAttribute('uv2', geometry.getAttribute('uv'));
  }
}
