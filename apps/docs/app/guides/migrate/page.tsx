import { Planned } from '@/components/planned';

export const metadata = { title: 'Migrate an existing configurator' };

export default function MigratePage() {
  return (
    <Planned
      title="Migrate an existing configurator"
      description="Move options, constraints, and SKU maps onto a CubeCom Pro graph. Leave price and cart where they are."
      ships={false}
      contract="Import sequence: product identity → options/values with stable keys → rules as IF/THEN → GLB + visual bindings → variant maps (externalId/sku). Cut over the storefront to resolveConfiguration. Do not migrate cached prices into the graph. No bulk importer ships yet — use GraphQL authoring mutations or Backoffice."
      related={[
        { href: '/guides/configurator', label: 'Build a product configurator' },
        { href: '/concepts/product-graph', label: 'Product graph' },
      ]}
    />
  );
}
