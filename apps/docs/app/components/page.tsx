import { ComponentsGallery } from '@/components/components-gallery';
import { PageHeader } from '@/components/docs-ui';

export const metadata = { title: 'Components' };

export default function ComponentsPage() {
  return (
    <>
      <PageHeader
        title="Components"
        description="Shared primitives from @repo/ui used by Backoffice and docs."
      />
      <ComponentsGallery />
    </>
  );
}
