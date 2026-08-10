import Link from 'next/link';
import { GetProductDetailDocument } from '@repo/graphql/generated';
import { updateProductMetadataAction } from '../../../../../actions/products';
import {
  ErrorState,
  PageHeader,
  Panel,
} from '../../../../../components/ui';
import { createProjectClient } from '../../../../../lib/graphql';
import { getProjectSession } from '../../../../../lib/session-server';
import { ProductMetadataForm } from '../../../../../components/products/product-metadata-form';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; id: string }>;
}) {
  const { projectId, id } = await params;
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
      <div>
        <PageHeader
          title={product.Name || 'Product'}
          description="Update product metadata. Configuration and commerce live in the product workspace."
          actions={
            <Link
              href={`/${projectId}/products/${id}/edit`}
              className="rounded-lg border border-[var(--bo-line)] bg-white px-3.5 py-2 text-[13px] font-medium"
            >
              Open product
            </Link>
          }
        />
        <Panel>
          <ProductMetadataForm
            projectId={projectId}
            productId={id}
            defaults={{
              Name: product.Name ?? '',
              Description: product.Description ?? '',
              code: product.code ?? '',
              Department: product.Department ?? '',
              Manufacture: product.Manufacture ?? '',
              active: true,
            }}
            action={updateProductMetadataAction}
          />
        </Panel>
      </div>
    );
  } catch (error) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : 'Failed to load product.'
        }
      />
    );
  }
}
