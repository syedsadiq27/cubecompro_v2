import { CommercePlaceholder } from '@/components/commerce/commerce-placeholder';

export default async function RulesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <CommercePlaceholder
      projectId={projectId}
      title="Rules"
      description="Configuration validity, compatibility, and resolution rules that determine purchasable states."
    />
  );
}
