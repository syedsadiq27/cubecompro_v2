import { ProductPlaceholder } from '../../components/product-placeholder';

export const metadata = { title: '3D Editor' };

export default function ThreeDEditorDocsPage() {
  return (
    <ProductPlaceholder
      title="3D Editor"
      description="Author and validate configurable 3D product experiences."
      bullets={[
        'Models, materials, and regions',
        'Camera and lighting setups',
        'Hotspots and interaction points',
        'Validation before publish',
      ]}
    />
  );
}
