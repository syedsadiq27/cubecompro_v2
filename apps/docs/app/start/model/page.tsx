import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Upload a 3D model' };

export default function StartModelPage() {
  return (
    <>
      <PageHeader
        title="Upload a 3D model"
        description="GLBs live in the project library, not on the product row. The product attaches a library object as its primary model."
      />
      <Section title="Flow">
        <Prose>
          <p>
            Library → Objects → upload GLB. Parse runs synchronously: mesh
            count, node tree, metadata JSON. Then on the product 3D tab,
            attach that object and open Studio to bind options.
          </p>
        </Prose>
        <Callout>
          Viewers fetch bytes from <code>GET /documents/objects/{'{id}'}</code>
          with a bearer token. Do not hotlink a private bucket.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/platform/models', label: 'Models' },
            { href: '/platform/assets', label: 'Assets' },
            { href: '/experiences/3d', label: '3D experience' },
          ]}
        />
      </Section>
    </>
  );
}
