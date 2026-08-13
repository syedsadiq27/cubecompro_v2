import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Scene state' };

export default function SceneStatePage() {
  return (
    <>
      <PageHeader
        title="Scene state"
        description="How the model should look for this resolved selection: materials, visibility, and later transforms. Derived from VisualEffect rows on the published graph."
      />
      <Section title="Projection">
        <CodeBlock>{`threeD.modelId
threeD.effects[]
  targetKey / targetType / nodePath
  operation          SET_MATERIAL | SET_VISIBILITY
  valueJson          materialAssetId | boolean
  documentUrl        library material document`}</CodeBlock>
        <Prose>
          <p>
            The viewer applies effects in order. It must not apply a library
            material that resolve did not return. Asset bytes are fetched from
            <code>/documents/…</code> with the same bearer token.
          </p>
        </Prose>
        <Callout>
          Scene state is not authored in the customizer. It is a projection of
          the graph + selection, same as commerce state.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/resolved-selection', label: 'Resolved selection' },
            { href: '/experiences/3d', label: '3D experience' },
            { href: '/platform/models', label: 'Models' },
          ]}
        />
      </Section>
    </>
  );
}
