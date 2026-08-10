import { GetProductDetailDocument } from '@repo/graphql/generated';
import { EditorStudioEmbed } from '../../../../../../../components/products/editor-studio-embed';
import { ErrorState } from '../../../../../../../components/ui';
import { createProjectClient } from '../../../../../../../lib/graphql';
import { getProjectSession } from '../../../../../../../lib/session-server';

export default async function ProductModelEditorPage({
  params,
}: {
  params: Promise<{ projectId: string; id: string; modelId: string }>;
}) {
  const { projectId, id, modelId } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  try {
    const client = createProjectClient(projectId, project.projectToken);
    const data = await client.project(GetProductDetailDocument, {
      prodId: id,
    });
    const product = data.getProductDetail;
    if (!product) {
      return <ErrorState message="Product not found." />;
    }

    return (
      <EditorStudioEmbed
        projectId={projectId}
        productId={id}
        modelId={modelId}
        returnTo={`/${projectId}/products/${id}`}
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
