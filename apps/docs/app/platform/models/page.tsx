import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Models' };

export default function ModelsPage() {
  return (
    <>
      <PageHeader
        title="Models"
        description="A ProductModel is the 3D attachment on a graph version. The GLB itself is a library object."
      />
      <Section title="Attachment">
        <Prose>
          <p>
            Upload once to the library. Attach the object id as the product
            model. Studio binds options to mesh targets on that model.
            Multiple products can share one library object.
          </p>
        </Prose>
        <Callout>
          Parse metadata (nodes, meshes) is stored on the object. Re-upload
          to refresh it. Bindings that point at missing nodes fail at resolve
          as missing effects, not as a crash.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/start/model', label: 'Upload a 3D model' },
            { href: '/platform/assets', label: 'Assets' },
            { href: '/experiences/3d', label: '3D' },
          ]}
        />
      </Section>
    </>
  );
}
