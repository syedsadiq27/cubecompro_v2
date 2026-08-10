import {
  getModelById,
  getProductDetail,
  resolveProductAssets,
  type ModelById,
  type ProductCamera,
  type ProductDetail,
  type ProductObjectAsset,
  type ProductTexture,
} from './api/model';
import { loginProject, type ProjectAuth } from './api/project';
import {
  parseModelMaterials,
  type ParsedModelMaterials,
} from './materials';

export type BootstrapEditorResult = {
  auth: ProjectAuth;
  product: ProductDetail;
  model: ModelById | null;
  assets: ProductObjectAsset[];
  textures: ProductTexture[];
  materials: ParsedModelMaterials;
  camera: ProductCamera;
};

export async function bootstrapEditorProduct({
  projectId,
  productId,
  modelId,
}: {
  projectId: string;
  productId: string;
  modelId?: string;
}): Promise<BootstrapEditorResult> {
  const auth = await loginProject(projectId);
  const [bundle, model] = await Promise.all([
    getProductDetail(projectId, productId, auth.token),
    modelId ? getModelById(projectId, modelId, auth.token) : Promise.resolve(null),
  ]);

  const { product, textures } = bundle;
  const config = model?.config ?? {};
  const assets = resolveProductAssets(product, config);
  const materials = parseModelMaterials(config);

  if (!assets.length) {
    throw new Error(
      `No model assets found for product ${productId}${
        modelId ? ` / model ${modelId}` : ''
      }`
    );
  }

  return {
    auth,
    product,
    model,
    assets,
    textures,
    materials,
    camera: product.camera ?? null,
  };
}
