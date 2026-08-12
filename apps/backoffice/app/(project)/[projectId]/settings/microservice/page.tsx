import { FeaturePlaceholder } from '@/components/ui/feature-placeholder';

export default async function MicroserviceSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <FeaturePlaceholder
      title="Microservices"
      description="Service endpoints and feature flags."
      detail="Microservice settings are deferred. CubeCom runs as a single Nest API for now."
      href={`/${projectId}/dashboard`}
      linkLabel="Back to dashboard"
    />
  );
}
