import { redirect } from 'next/navigation';

export default async function SettingsIndexPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/${projectId}/settings/cms`);
}
