import { FeaturePlaceholder } from '@/components/ui/feature-placeholder';

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <FeaturePlaceholder
      title="Workflow"
      description="Approval and publish workflows for products."
      detail="Workflow is deferred in CubeCom v1. Use product graph publish for now."
      href={`/${projectId}/products`}
      linkLabel="Back to products"
    />
  );
}
