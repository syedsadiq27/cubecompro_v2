import { redirect } from 'next/navigation';
import {
  PRODUCT_GRAPH_VERSION_DETAIL_QUERY,
  PRODUCT_GRAPH_VERSIONS_QUERY,
  graphRequest,
  pickGraphVersionId,
} from '@repo/product-graph';
import { getEditorStudioPath } from '@/lib/editor-embed';
import { getProjectSession } from '@/lib/session-server';

export default async function Product3DStudioRedirectPage({
  params,
}: {
  params: Promise<{ projectId: string; id: string }>;
}) {
  const { projectId, id } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  const versionsData = await graphRequest<{
    productRevisions: Array<{ id: string; status: string }>;
  }>(PRODUCT_GRAPH_VERSIONS_QUERY, { productId: id }, project.projectToken);

  if (versionsData.productRevisions.length === 0) {
    redirect(`/${projectId}/products/${id}?tab=3d`);
  }
  const selectedId = pickGraphVersionId(versionsData.productRevisions);

  const detailData = await graphRequest<{
    productRevisionDetail: {
      models: Array<{ id: string }>;
    };
  }>(
    PRODUCT_GRAPH_VERSION_DETAIL_QUERY,
    { id: selectedId },
    project.projectToken
  );
  const modelId = detailData.productRevisionDetail.models[0]?.id;
  if (!modelId) {
    redirect(`/${projectId}/products/${id}?tab=3d`);
  }

  redirect(getEditorStudioPath(projectId, id, modelId));
}
