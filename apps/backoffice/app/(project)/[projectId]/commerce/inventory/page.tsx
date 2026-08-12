import { CommercePlaceholder } from '@/components/commerce/commerce-placeholder';

export default async function InventoryPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <CommercePlaceholder
      projectId={projectId}
      title="Inventory"
      description="Inventory availability for resolved SKUs across connected channels."
    />
  );
}
