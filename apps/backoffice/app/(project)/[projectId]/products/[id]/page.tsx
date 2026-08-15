import { ProductWorkspace } from '@/components/products/workspace/product-workspace';
import { EmptyState } from '@/components/bo';
import {
  MATERIAL_ASSETS_QUERY,
  OBJECT_ASSETS_QUERY,
  PRODUCT_GRAPH_VERSION_DETAIL_QUERY,
  PRODUCT_GRAPH_VERSIONS_QUERY,
  PRODUCT_QUERY,
  graphRequest,
  pickGraphVersionId,
} from '@repo/product-graph';
import {
  parseWorkspaceTab,
  type GraphDetail,
} from '@/lib/product-workspace';
import { getProjectSession } from '@/lib/session-server';

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string; id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { projectId, id } = await params;
  const { tab } = await searchParams;
  const project = await getProjectSession();
  if (!project) return null;

  try {
    const [productData, versionsData, objectsData, materialsData] =
      await Promise.all([
      graphRequest<{
        product: {
          id: string;
          name: string;
          key: string;
          description?: string | null;
          status: string;
        };
      }>(PRODUCT_QUERY, { id }, project.projectToken),
      graphRequest<{
        productRevisions: Array<{
          id: string;
          version: number;
          status: string;
          publishedAt?: string | null;
        }>;
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
          status?: string | null;
          meshCount?: number | null;
          format?: string | null;
        }>;
      }>(OBJECT_ASSETS_QUERY, { projectId }, project.projectToken).catch(() => ({
        objectAssets: [],
      })),
      graphRequest<{
        materialAssets: Array<{
          id: string;
          name: string;
          code?: string | null;
        }>;
      }>(MATERIAL_ASSETS_QUERY, { projectId }, project.projectToken).catch(
        () => ({ materialAssets: [] })
      ),
    ]);

    const versions = versionsData.productRevisions;
    const publishedVersions = versions
      .filter(
        (version) =>
          version.status === 'PUBLISHED' || version.status === 'ARCHIVED'
      )
      .sort((a, b) => b.version - a.version)
      .map((version) => ({
        id: version.id,
        versionNumber: version.version,
        publishedAt: version.publishedAt ?? new Date().toISOString(),
      }));

    let detail: GraphDetail | null = null;
    if (versions.length > 0) {
      const selectedId = pickGraphVersionId(versions);
      const detailData = await graphRequest<{
        productRevisionDetail: GraphDetail;
      }>(
        PRODUCT_GRAPH_VERSION_DETAIL_QUERY,
        { id: selectedId },
        project.projectToken
      );
      detail = detailData.productRevisionDetail;
    }

    return (
      <ProductWorkspace
        projectId={projectId}
        productId={id}
        product={productData.product}
        detail={detail}
        objectAssets={objectsData.objectAssets}
        materialAssets={materialsData.materialAssets}
        publishedVersions={publishedVersions}
        initialTab={parseWorkspaceTab(tab)}
      />
    );
  } catch (error) {
    return (
      <div data-fill-page className="flex min-h-0 flex-1 flex-col p-6">
        <EmptyState
          variant="error"
          title="Product failed to load"
          description={
            error instanceof Error ? error.message : 'Failed to load product.'
          }
        />
      </div>
    );
  }
}
