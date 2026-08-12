import { ComponentsGallery } from '@/components/components-gallery';
import { PageHeader } from '@/components/docs-ui';

export const metadata = { title: 'Components' };

export default function ComponentsPage() {
  return (
    <>
      <PageHeader
        title="Components"
        description="First-pass CubeCom primitives from @repo/ui. Validate brand consistency here before adopting in backoffice."
      />
      <ComponentsGallery />
    </>
  );
}
