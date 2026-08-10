import Link from 'next/link';
import { PageHeader, Panel } from '../../../../../components/ui';

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
        description="Full product creation with media upload lands with the multipart GraphQL client. Use metadata editing on existing products for now."
      />
      <Panel className="space-y-4">
        <p className="text-sm text-[var(--bo-muted)]">
          Create-with-upload requires the GraphQL multipart boundary (files /
          textures). That integration is staged after the typed JSON client
          and will attach to this route.
        </p>
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
