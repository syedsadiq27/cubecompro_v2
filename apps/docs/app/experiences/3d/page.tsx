import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';
import { docsMeta } from '@/lib/site';

export const metadata = docsMeta(
  '3D Scene API',
  '/experiences/3d',
  'CubeCom Pro 3D experience — GLB viewer driven by ResolvedSelection.threeD from the product graph.'
);

export default function Experience3dPage() {
  return (
    <>
      <PageHeader
        title="3D"
        description="The shipped experience: a GLB viewer driven by ResolvedSelection.threeD."
      />
      <Section title="Runtime">
        <Prose>
          <p>
            Load the model from the library document URL. Apply effects in
            order: SET_MATERIAL swaps a library material onto a node;
            SET_VISIBILITY toggles meshes. The customizer app is the
            reference implementation.
          </p>
        </Prose>
        <Callout>
          Do not apply a material the graph did not return. Scene state is
          the only authorized look for that selection.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/scene-state', label: 'Scene state' },
            { href: '/platform/models', label: 'Models' },
            { href: '/start/embed', label: 'Embed the configurator' },
          ]}
        />
      </Section>
    </>
  );
}
