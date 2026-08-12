import { FeaturePlaceholder } from '@/components/ui/feature-placeholder';

export default async function ApiSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <FeaturePlaceholder
      title="API"
      description="Project API credentials and client keys."
      detail="Legacy QA API client settings are retired. Backoffice talks to CubeCom GraphQL via NEXT_PUBLIC_PRODUCT_GRAPH_URL."
      href={`/${projectId}/dashboard`}
      linkLabel="Back to dashboard"
    />
  );
}
