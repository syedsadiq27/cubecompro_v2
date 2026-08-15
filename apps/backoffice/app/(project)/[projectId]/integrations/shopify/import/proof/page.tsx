import {
  getShopifyImportProofAction,
} from '@/actions/shopify';
import { ShopifyImportProofScreen } from '@/components/integrations/shopify-import-proof-screen';

export default async function ShopifyImportProofPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ productId?: string }>;
}) {
  const { projectId } = await params;
  const { productId } = await searchParams;
  if (!productId) {
    return (
      <ShopifyImportProofScreen
        projectId={projectId}
        proof={null}
        errorMessage="Missing productId."
      />
    );
  }

  const { proof, error } = await getShopifyImportProofAction(
    projectId,
    productId
  );

  return (
    <ShopifyImportProofScreen
      projectId={projectId}
      proof={proof}
      errorMessage={error}
    />
  );
}
