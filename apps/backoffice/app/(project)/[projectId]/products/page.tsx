import {
  GetCommerceConfigDocument,
  GetProductsDocument,
} from '@repo/graphql/generated';
import {
  ProductsCatalog,
  type CatalogProduct,
} from '../../../../components/products/products-catalog';
import { ErrorState } from '../../../../components/ui';
import { deriveCommerceSignals } from '../../../../lib/commerce-signals';
import { resolveImageUrl } from '../../../../lib/env';
import { createProjectClient } from '../../../../lib/graphql';
import { PRODUCT_LIST_STATUSES } from '../../../../lib/product-status';
import { getProjectSession } from '../../../../lib/session-server';

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
    const client = createProjectClient(projectId, project.projectToken);
    const [productData, commerceData] = await Promise.all([
      client.project(GetProductsDocument, {
        status: PRODUCT_LIST_STATUSES,
      }),
      client.project(GetCommerceConfigDocument, { projectId }).catch(() => null),
    ]);

    const channelPlatform =
      commerceData?.getcommerceconfigByPID?.[0]?.platform ?? null;

    products = (productData.getProductDetails ?? []).map((product) => {
      const models = product.models ?? [];
      const categoryNames = (product.Categories ?? [])
        .map((category) => category.name)
        .filter((name): name is string => Boolean(name));

      return {
        id: String(product.id),
        name: product.Name?.trim() || 'Untitled',
        code: product.code?.trim() || '',
        statusName: product.ProductStatus?.Status_Name ?? null,
        imageUrl: resolveImageUrl(product.ProductMedia?.[0]?.Image_URL),
        categoryNames,
        brandLabel: categoryNames[0] ?? null,
        modelCount: models.length,
        hasModels: models.length > 0,
        updatedLabel: null,
        signals: deriveCommerceSignals({
          statusName: product.ProductStatus?.Status_Name,
          modelCount: models.length,
          hasModels: models.length > 0,
          channelPlatform,
          priceMin: null,
          priceMax: null,
        }),
      };
    });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load products.';
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return <ProductsCatalog projectId={projectId} products={products} />;
}
