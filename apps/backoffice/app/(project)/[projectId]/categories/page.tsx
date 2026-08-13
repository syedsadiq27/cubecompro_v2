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
      description="Organize products into merchandising categories."
      href={`/${projectId}/products`}
      linkLabel="Back to products"
    />
  );
}
