import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Build custom UI' };

export default function CustomUiPage() {
  return (
    <>
      <PageHeader
        title="Build custom UI"
        description="Replace the customizer chrome. Keep resolve as the engine."
      />
      <Section title="Allowed">
        <Prose>
          <p>
            Your option pickers, your layout, your 3D viewer. You must:
            submit ConfigurationState, apply only returned threeD.effects,
            and refuse cart when valid is false. You must not invent SKUs
            or materials.
          </p>
        </Prose>
        <Callout>
          Studio remains the merchant authoring surface. A custom UI is a
          storefront concern.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/start/embed', label: 'Embed the configurator' },
            { href: '/experiences/3d', label: '3D' },
            { href: '/developers/graphql', label: 'GraphQL API' },
          ]}
        />
      </Section>
    </>
  );
}
