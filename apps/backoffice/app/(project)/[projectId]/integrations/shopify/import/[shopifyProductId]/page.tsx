import {
  getShopifyImportPreviewAction,
} from '@/actions/shopify';
import { ShopifyImportReviewScreen } from '@/components/integrations/shopify-import-review-screen';

export default async function ShopifyImportReviewPage({
  params,
}: {
  params: Promise<{ projectId: string; shopifyProductId: string }>;
}) {
  const { projectId, shopifyProductId } = await params;
  const { preview, error } = await getShopifyImportPreviewAction(
    projectId,
    shopifyProductId
  );

  return (
    <ShopifyImportReviewScreen
      projectId={projectId}
      shopifyProductId={shopifyProductId}
      preview={preview}
      errorMessage={error}
    />
  );
}
