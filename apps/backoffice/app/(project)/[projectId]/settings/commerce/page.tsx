import { FeaturePlaceholder } from '@/components/ui/feature-placeholder';

export default async function CommerceSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <FeaturePlaceholder
      title="Commerce channels"
      description="Provider adapters and channel mapping."
      detail="Commerce adapters are deferred. Resolve configuration works without a live channel today."
      href={`/${projectId}/products`}
      linkLabel="Back to products"
    />
  );
}
