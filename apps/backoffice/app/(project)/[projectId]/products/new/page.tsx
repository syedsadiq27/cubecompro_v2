import Link from 'next/link';
import { createProductAction } from '@/actions/products';
import { Panel } from '@/components/ui';
import { PageChrome } from '@/components/ui/page-chrome';
import { CreateProductForm } from '@/components/products/create-product-form';

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <PageChrome
      title="Add product"
      description="Creates a product with an empty draft configuration graph."
    >
      <div className="mx-auto max-w-xl space-y-4">
        <Panel className="space-y-4">
          <CreateProductForm
            projectId={projectId}
            action={createProductAction}
          />
        </Panel>
        <Link
          href={`/${projectId}/products`}
          className="inline-flex rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-sm"
        >
          Back to products
        </Link>
      </div>
    </PageChrome>
  );
}
