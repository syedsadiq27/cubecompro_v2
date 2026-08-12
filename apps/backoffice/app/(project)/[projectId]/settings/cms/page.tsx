import { FeaturePlaceholder } from '@/components/ui/feature-placeholder';

export default async function CmsSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <FeaturePlaceholder
      title="Integrations"
      description="CMS and content integrations for this project."
      detail="CMS adapters are deferred in CubeCom v1."
      href={`/${projectId}/dashboard`}
      linkLabel="Back to dashboard"
    />
  );
}
