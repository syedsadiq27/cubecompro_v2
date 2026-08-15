import { redirect } from 'next/navigation';
import {
  MATERIAL_ASSETS_QUERY,
  OBJECT_ASSETS_QUERY,
  PRODUCT_GRAPH_VERSION_DETAIL_QUERY,
  PRODUCT_GRAPH_VERSIONS_QUERY,
  PRODUCT_QUERY,
  graphRequest,
  pickGraphVersionId,
} from '@repo/product-graph';
import { Product3DStudio } from '@/components/products/studio/product-3d-studio';
import { getEditorStudioPath } from '@/lib/editor-embed';
import type { GraphDetail } from '@/lib/product-workspace';
import { getProjectSession } from '@/lib/session-server';

export default async function Product3DStudioPage({
  params,
}: {
  params: Promise<{ projectId: string; id: string }>;
}) {
  const { projectId, id } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  const [productData, versionsData, objectsData, materialsData] =
    await Promise.all([
      graphRequest<{
        product: { id: string; name: string; status: string };
      }>(PRODUCT_QUERY, { id }, project.projectToken),
      graphRequest<{
        productRevisions: Array<{ id: string; status: string }>;
      }>(
        PRODUCT_GRAPH_VERSIONS_QUERY,
        { productId: id },
        project.projectToken
      ),
      graphRequest<{
        objectAssets: Array<{
          id: string;
          name: string;
          code?: string | null;
          fileUrl?: string | null;
        }>;
      }>(OBJECT_ASSETS_QUERY, { projectId }, project.projectToken).catch(() => ({
        objectAssets: [],
      })),
      graphRequest<{
        materialAssets: Array<{ id: string; name: string }>;
      }>(MATERIAL_ASSETS_QUERY, { projectId }, project.projectToken).catch(
        () => ({ materialAssets: [] })
      ),
    ]);

  if (versionsData.productRevisions.length === 0) {
    redirect(`/${projectId}/products/${id}?tab=3d`);
  }

  const selectedId = pickGraphVersionId(versionsData.productRevisions);
  const detailData = await graphRequest<{
    productRevisionDetail: GraphDetail;
  }>(
    PRODUCT_GRAPH_VERSION_DETAIL_QUERY,
    { id: selectedId },
    project.projectToken
  );
  const detail = detailData.productRevisionDetail;
  const modelId = detail.models[0]?.id;
  if (modelId) {
    redirect(getEditorStudioPath(projectId, id, modelId));
  }

  const editable =
    productData.product.status !== 'ARCHIVED' &&
    detail.status !== 'ARCHIVED';

  return (
    <Product3DStudio
      projectId={projectId}
      productId={id}
      productName={productData.product.name}
      detail={detail}
      objectAssets={objectsData.objectAssets}
      materials={materialsData.materialAssets}
      editable={editable}
    />
  );
}
