import {
  getModelBySku,
  getProductDetail,
  getVariantsByModelId,
  resolveProductAssets,
  type ModelBySku,
  type ModelVariant,
  type ProductDetail,
  type ProductObjectAsset,
  type ProductTexture,
} from './api/model';
import { loginProject, type ProjectAuth } from './api/project';
import {
  parseModelMaterials,
  type ParsedModelMaterials,
} from './materials';

export type BootstrapModelResult = {
  auth: ProjectAuth;
  model: ModelBySku;
  product: ProductDetail;
  textures: ProductTexture[];
  assets: ProductObjectAsset[];
  materials: ParsedModelMaterials;
  variants: ModelVariant[];
};

export async function bootstrapModelFromParams({
  projectId,
  modelCode,
}: {
  projectId: string;
  modelCode: string;
}): Promise<BootstrapModelResult> {
  const auth = await loginProject(projectId);
  const model = await getModelBySku(projectId, modelCode, auth.token);
  const [{ product, textures }, variants] = await Promise.all([
    getProductDetail(projectId, model.ProductId, auth.token),
    getVariantsByModelId(projectId, model.id, auth.token),
  ]);
  const assets = resolveProductAssets(product, model.config);
  const materials = parseModelMaterials(model.config);

  if (!assets.length) {
    throw new Error(`No includable model assets found for ${modelCode}`);
  }

  return { auth, model, product, textures, assets, materials, variants };
}
