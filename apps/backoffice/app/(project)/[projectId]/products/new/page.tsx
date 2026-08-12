import Link from 'next/link';
import { createProductAction } from '@/actions/products';
import { PageHeader, Panel } from '@/components/ui';
import { CreateProductForm } from '@/components/products/create-product-form';

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div>
      <PageHeader
        title="Add product"
        description="Creates a product with an empty draft configuration graph."
      />
      <Panel className="space-y-4">
        <CreateProductForm projectId={projectId} action={createProductAction} />
        <Link
          href={`/${projectId}/products`}
          className="inline-flex rounded-xl border border-[var(--bo-line)] px-4 py-2 text-sm"
        >
          Back to products
        </Link>
      </Panel>
    </div>
  );
}
