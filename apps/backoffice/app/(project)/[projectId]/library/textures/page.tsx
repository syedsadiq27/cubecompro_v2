import { redirect } from 'next/navigation';

export default async function TexturesLibraryRedirect({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/${projectId}/library?type=texture`);
}
