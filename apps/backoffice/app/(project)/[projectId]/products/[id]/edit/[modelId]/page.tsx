import { EditorStudioEmbed } from '@/components/products/editor-studio-embed';
import { ErrorState } from '@/components/ui';
import {
  PRODUCT_GRAPH_VERSIONS_QUERY,
  PRODUCT_QUERY,
  getApiBaseUrl,
  graphRequest,
  pickGraphVersionId,
} from '@repo/product-graph';
import { getProjectSession, getSessionUser } from '@/lib/session-server';

export default async function ProductModelEditorPage({
  params,
}: {
  params: Promise<{ projectId: string; id: string; modelId: string }>;
}) {
  const { projectId, id, modelId } = await params;
  const [project, user] = await Promise.all([
    getProjectSession(),
    getSessionUser(),
  ]);
  if (!project) return null;

  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
    || user?.email
    || 'Studio User';

  try {
    const [productData, versionsData] = await Promise.all([
      graphRequest<{
        product: { id: string };
      }>(PRODUCT_QUERY, { id }, project.projectToken),
      graphRequest<{
        productRevisions: Array<{ id: string; status: string }>;
      }>(
        PRODUCT_GRAPH_VERSIONS_QUERY,
        { productId: id },
        project.projectToken
      ),
    ]);

    void productData;
    const productRevisionId = pickGraphVersionId(
      versionsData.productRevisions
    );

    return (
      <EditorStudioEmbed
        projectId={projectId}
        productId={id}
        modelId={modelId}
        returnTo={`/${projectId}/products/${id}?tab=3d`}
        accessToken={project.projectToken}
        apiUrl={getApiBaseUrl()}
        productRevisionId={productRevisionId}
        userName={userName}
      />
    );
  } catch (error) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : 'Failed to open editor.'
        }
      />
    );
  }
}
