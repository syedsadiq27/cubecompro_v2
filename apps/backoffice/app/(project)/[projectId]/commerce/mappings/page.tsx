import { CommercePlaceholder } from '@/components/commerce/commerce-placeholder';

export default async function MappingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <CommercePlaceholder
      projectId={projectId}
      title="Mappings"
      description="Map configuration state to commerce identity — the resolve path from options to SKU, price, and channel."
      href={`/${projectId}/settings/commerce`}
      linkLabel="Open channel settings"
    />
  );
}
