import { FeaturePlaceholder } from '@/components/ui/feature-placeholder';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <FeaturePlaceholder
      title="Categories"
      description="Product taxonomy and category trees."
      detail="Categories are deferred in CubeCom v1. Products use project-scoped codes for now."
      href={`/${projectId}/products`}
      linkLabel="Back to products"
    />
  );
}
