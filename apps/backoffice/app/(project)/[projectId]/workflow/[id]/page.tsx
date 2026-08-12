import { FeaturePlaceholder } from '@/components/ui/feature-placeholder';

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; id: string }>;
}) {
  const { projectId } = await params;
  return (
    <FeaturePlaceholder
      title="Workflow detail"
      description="Individual workflow instance."
      detail="Workflow is deferred in CubeCom v1."
      href={`/${projectId}/workflow`}
      linkLabel="Back to workflow"
    />
  );
}
