import { graphqlRequest } from '@repo/graphql';
import { GetCustomizerProductDetailDocument } from '@repo/graphql/generated';
import { getImageBaseUrl } from '../env';
import { projectGraphqlEndpoint } from './project';

export type ModelConfig = {
  includedObjects?: string[];
  editableObjects?: string[];
  rules?: Record<string, ObjectRule | undefined> | string;
  colors?: unknown;
  textures?: unknown;
  materials?: unknown;
  metadata?: unknown;
  layers?: unknown;
};

export type ObjectRule = {
  __path?: string;
  children?: Record<string, unknown>;
  editableTransform?: { elements?: number[] };
  [key: string]: unknown;
};

export type ProductObjectAsset = {
  id: string;
  name: string;
  code: string | null;
  relativePath: string;
  url: string;
  included: boolean;
  visible: boolean;
};

export type ProductCamera = {
  x?: number;
  y?: number;
  z?: number;
  fov?: number;
  near?: number;
  far?: number;
  uniqueName?: string;
} | null;

export type ProductTexture = {
  id: number;
  name?: string | null;
  code?: string | null;
  description?: string | null;
  ProductMedium?: { Image_URL?: string | null } | null;
};

export type ProductDetail = {
  id: number;
  Name: string;
  code: string;
  camera?: ProductCamera;
  Properties?: Array<{
    id: number;
    name: string;
    PropertyValues?: Array<{
      id: number;
      name: string;
      objects?: Array<{
        id: number;
        name: string;
        code?: string | null;
        ProductMedium?: { Image_URL?: string | null } | null;
      }>;
    }>;
  }>;
};

export type ProductBundle = {
  product: ProductDetail;
  textures: ProductTexture[];
};

export type ModelById = {
  id: number;
  name: string;
  sku: string;
  config: ModelConfig;
};

function parseConfig(config: unknown): ModelConfig {
  if (!config) return {};
  if (typeof config === 'string') {
    try {
      return JSON.parse(config) as ModelConfig;
    } catch {
      return {};
    }
  }
  if (typeof config === 'object') {
    return config as ModelConfig;
  }
  return {};
}

function asNumber(value: string | number | null | undefined): number {
  if (typeof value === 'number') return value;
  return Number(value ?? 0);
}

function parseRules(
  rules: ModelConfig['rules']
): Record<string, ObjectRule | undefined> {
  if (!rules) return {};
  if (typeof rules === 'string') {
    try {
      return JSON.parse(rules) as Record<string, ObjectRule | undefined>;
    } catch {
      return {};
    }
  }
  return rules;
}

const GET_MODEL_BY_ID = `
  query GetModelById($id: ID!) {
    getModelById(id: $id) {
      id
      name
      sku
      config
    }
  }
`;

export async function getModelById(
  projectId: string,
  modelId: string,
  token: string
): Promise<ModelById | null> {
  try {
    const data = await graphqlRequest<{
      getModelById?: {
        id: string;
        name?: string | null;
        sku?: string | null;
        config?: unknown;
      } | null;
    }>(
      projectGraphqlEndpoint(projectId),
      GET_MODEL_BY_ID,
      { id: modelId },
      token
    );

    if (!data.getModelById) return null;

    return {
      id: asNumber(data.getModelById.id),
      name: data.getModelById.name ?? '',
      sku: data.getModelById.sku ?? '',
      config: parseConfig(data.getModelById.config),
    };
  } catch {
    return null;
  }
}

export async function getProductDetail(
  projectId: string,
  productId: number | string,
  token: string
): Promise<ProductBundle> {
  const data = await graphqlRequest(
    projectGraphqlEndpoint(projectId),
    GetCustomizerProductDetailDocument,
    { productId: String(productId) },
    token
  );

  if (!data.getProductDetail) {
    throw new Error(`Product not found for id ${productId}`);
  }

  const product = data.getProductDetail;
  const camera =
    product.camera && typeof product.camera === 'object'
      ? (product.camera as ProductCamera)
      : null;

  return {
    product: {
      id: asNumber(product.id),
      Name: product.Name ?? '',
      code: product.code ?? '',
      camera,
      Properties: (product.Properties ?? []).map((property) => ({
        id: asNumber(property.id),
        name: property.name ?? '',
        PropertyValues: (property.PropertyValues ?? []).map((value) => ({
          id: asNumber(value.id),
          name: value.name ?? '',
          objects: (value.objects ?? []).map((object) => ({
            id: asNumber(object.id),
            name: object.name ?? '',
            code: object.code ?? null,
            ProductMedium: object.ProductMedium
              ? { Image_URL: object.ProductMedium.Image_URL }
              : null,
          })),
        })),
      })),
    },
    textures: (data.getTextureByProductID ?? [])
      .filter((texture): texture is NonNullable<typeof texture> =>
        Boolean(texture?.id)
      )
      .map((texture) => ({
        id: asNumber(texture.id),
        name: texture.name,
        code: texture.code,
        description: texture.description,
        ProductMedium: texture.ProductMedium
          ? { Image_URL: texture.ProductMedium.Image_URL }
          : null,
      })),
  };
}

export function resolveProductAssets(
  product: ProductDetail,
  config: ModelConfig
): ProductObjectAsset[] {
  const included = new Set(config.includedObjects ?? []);
  const editable = new Set(config.editableObjects ?? []);
  const rules = parseRules(config.rules);
  const imageBase = getImageBaseUrl();
  const assets: ProductObjectAsset[] = [];
  const seen = new Set<string>();

  for (const property of product.Properties ?? []) {
    for (const value of property.PropertyValues ?? []) {
      for (const object of value.objects ?? []) {
        const id = `u${object.id}`;
        if (seen.has(id)) continue;

        const fromProduct = object.ProductMedium?.Image_URL ?? null;
        const fromRules = rules[id]?.__path ?? null;
        const relativePath = fromProduct || fromRules;
        if (!relativePath) continue;

        const includedFlag = included.size === 0 ? true : included.has(id);
        if (!includedFlag) continue;

        seen.add(id);
        assets.push({
          id,
          name: object.name || id,
          code: object.code ?? null,
          relativePath,
          url: relativePath.startsWith('http')
            ? relativePath
            : `${imageBase}${relativePath}`,
          included: includedFlag,
          visible: editable.size === 0 ? true : editable.has(id),
        });
      }
    }
  }

  return assets;
}
