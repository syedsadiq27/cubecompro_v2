import { CubeStage, CubeSurface } from '@/components/brand';
import { PageHeader, Section } from '@/components/docs-ui';

const PRODUCTS = [
  {
    href: '/backoffice',
    title: 'Backoffice',
    description: 'Catalog, commerce, workflow, and platform operations.',
  },
  {
    href: '/3d-editor',
    title: '3D Editor',
    description: 'Models, materials, regions, cameras, and validation.',
  },
  {
    href: '/logo-editor',
    title: 'Logo Editor',
    description: 'Logo placement, scaling, and artwork workflows.',
  },
  {
    href: '/customizer',
    title: 'Customizer',
    description: 'Shopper-facing configuration and commerce experience.',
  },
] as const;

export default function OverviewPage() {
  return (
    <>
      <div className="relative -mx-10 mb-10">
        <CubeStage product className="h-[420px] w-full" />
      </div>

      <div className="mb-16">
        <h1 className="type-hero">
          Configure anything.
          <br />
          Sell every valid state.
        </h1>
        <p className="type-body type-measure mt-6">
          Physical products on a digital stage — the CubeCom signature across
          marketing, studio, customizer, and docs.
        </p>
      </div>

      <PageHeader
        title="Documentation"
        description="Guides for customers and partners, plus the design principles that keep every CubeCom surface coherent."
      />

      <Section title="Start here">
        <CubeSurface href="/design-principles" className="px-7 py-8">
          <p className="type-meta">Brand</p>
          <p className="type-card mt-3">Design principles</p>
          <p className="type-body type-measure mt-4">
            The Digital Product Stage — mineral white, product as hero, violet
            spatial light, and controlled black typography.
          </p>
        </CubeSurface>
      </Section>

      <Section title="Products">
        <div className="grid items-start gap-4 sm:grid-cols-2">
          {PRODUCTS.map((product) => (
            <CubeSurface
              key={product.href}
              href={product.href}
              className="px-6 py-6"
            >
              <p className="type-card">{product.title}</p>
              <p className="type-desc mt-3">{product.description}</p>
            </CubeSurface>
          ))}
        </div>
      </Section>
    </>
  );
}
