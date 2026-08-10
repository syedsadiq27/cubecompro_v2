import { CommercePlaceholder } from '../../../../../components/commerce/commerce-placeholder';

export default async function PricingPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <CommercePlaceholder
      projectId={projectId}
      title="Pricing"
      description="Resolve configuration pricing rules and publishable price ranges for mapped commerce identities."
    />
  );
}
