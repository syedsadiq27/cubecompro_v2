import { ProductPlaceholder } from '@/components/product-placeholder';

export const metadata = { title: 'Logo Editor' };

export default function LogoEditorDocsPage() {
  return (
    <ProductPlaceholder
      title="Logo Editor"
      description="Place and manage logos and artwork on configurable products."
      bullets={[
        'Upload and artwork requirements',
        'Placement, scale, and constraints',
        'Regions and print-safe areas',
        'Export and handoff to commerce',
      ]}
    />
  );
}
