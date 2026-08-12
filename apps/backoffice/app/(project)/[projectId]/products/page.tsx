import {
  ProductsCatalog,
  type CatalogProduct,
} from '@/components/products/products-catalog';
import { ErrorState } from '@/components/ui';
import { graphRequest } from '@repo/product-graph';
import { PRODUCTS_BY_PROJECT_QUERY } from '@repo/product-graph';
import { deriveCommerceSignals } from '@/lib/commerce-signals';
import { getProjectSession } from '@/lib/session-server';

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  let error: string | null = null;
  let products: CatalogProduct[] = [];

  try {
    const data = await graphRequest<{
      productsByProject: Array<{
        id: string;
        name: string;
        key: string;
        status: string;
        activeGraphVersionId?: string | null;
      }>;
    }>(
      PRODUCTS_BY_PROJECT_QUERY,
      { projectId },
      project.projectToken
    );

    products = data.productsByProject.map((product) => ({
      id: product.id,
      name: product.name.trim() || 'Untitled',
      code: product.key.trim() || '',
      statusName: product.status,
      imageUrl: null,
      categoryNames: [],
      brandLabel: null,
      modelCount: product.activeGraphVersionId ? 1 : 0,
      hasModels: Boolean(product.activeGraphVersionId),
      updatedLabel: null,
      signals: deriveCommerceSignals({
        statusName: product.status,
        modelCount: product.activeGraphVersionId ? 1 : 0,
        hasModels: Boolean(product.activeGraphVersionId),
        channelPlatform: null,
        priceMin: null,
        priceMax: null,
      }),
    }));
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load products.';
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return <ProductsCatalog projectId={projectId} products={products} />;
}
