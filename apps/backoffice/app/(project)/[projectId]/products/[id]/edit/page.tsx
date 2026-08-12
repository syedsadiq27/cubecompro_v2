import { redirect } from 'next/navigation';

export default async function ProductGraphEditorRedirectPage({
  params,
}: {
  params: Promise<{ projectId: string; id: string }>;
}) {
  const { projectId, id } = await params;
  redirect(`/${projectId}/products/${id}?tab=options`);
}
