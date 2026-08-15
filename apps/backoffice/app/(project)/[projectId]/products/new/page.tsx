import Link from 'next/link';
import { createProductAction } from '@/actions/products';
import { BackofficePageHeader, PageBody } from '@/components/bo';
import { Button } from '@repo/ui';
import { CreateProductForm } from '@/components/products/create-product-form';

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]">
      <BackofficePageHeader
        title="Add New Product"
        description="Configure core product identity, initial option blueprint, 3D assets, and commerce resolution."
        actions={
          <Button
            as={Link}
            href={`/${projectId}/products`}
            size="sm"
            variant="secondary"
            className="ui:text-[13px]"
          >
            Back to products
          </Button>
        }
      />

      <PageBody>
        <div className="max-w-7xl mx-auto pb-12">
          <CreateProductForm
            projectId={projectId}
            action={createProductAction}
          />
        </div>
      </PageBody>
    </div>
  );
}
