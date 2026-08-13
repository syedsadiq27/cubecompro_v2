import { redirect } from 'next/navigation';

export default async function ObjectsLibraryRedirect({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/${projectId}/library?type=model`);
}
