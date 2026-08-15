import { redirect } from 'next/navigation';

export default async function CommerceSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/${projectId}/integrations/shopify`);
}
