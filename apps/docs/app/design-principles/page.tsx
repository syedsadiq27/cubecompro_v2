import { CubeStage } from '../../components/brand';
import {
  Callout,
  PageHeader,
  Prose,
  Section,
  SpecTable,
} from '../../components/docs-ui';

export const metadata = { title: 'Design principles' };

export default function DesignPrinciplesPage() {
  return (
    <>
      <PageHeader
        title="Design principles"
        description="CubeCom Pro is the Digital Product Stage. Recognizable from mineral white, a physical product as hero, soft violet spatial light, and large tight black typography."
      />

      <div className="relative -mx-10 mb-16">
        <CubeStage product className="h-[280px] w-full" />
      </div>

      <Section title="Four signature elements">
        <ol className="space-y-8">
          {[
            [
              'Mineral-white digital stage',
              'Cinematic mineral field. Soft violet atmosphere — not a purple rectangle.',
            ],
            [
              'Physical product as hero',
              'Large, centered, aspirational. The stage supports the object; copy sits below.',
            ],
            [
              'Violet spatial light',
              'Transformation atmosphere on stage, soft active bleed in nav, light spill on surfaces.',
            ],
            [
              'Very large, tight black typography',
              'Editorial scale. Mono only for genuine technical IDs.',
            ],
          ].map(([title, body], index) => (
            <li key={title} className="flex gap-5">
              <span className="type-num w-7 shrink-0 pt-0.5">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="max-w-lg">
                <p className="type-item">{title}</p>
                <p className="type-desc mt-1.5">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="System, not just hero">
        <Prose>
          <p>
            Stage, sidebar active state, and content surfaces share one spatial
            light language — atmosphere and light spill, not decorative color
            blocks.
          </p>
        </Prose>
      </Section>

      <Section title="What we removed">
        <Callout>
          Literal violet planes, text sitting on the stage, rounded hero cards,
          split purple/gray card decoration, and developer-tool motifs.
        </Callout>
      </Section>

      <Section title="Typography">
        <SpecTable
          rows={[
            { label: 'Display face', value: 'Inter Tight' },
            { label: 'UI face', value: 'Inter' },
            { label: 'Hero / H1', value: '56 / 0.96 / 700 · 32 / 1.05 / 650' },
            { label: 'H2 / card', value: '21 / 600 · 16 / 600' },
            { label: 'Body', value: '14 / 1.55 / 400 · #555 · max ~34rem' },
            { label: 'Desc / meta', value: '13.5 / 400 · 12 / 450' },
            { label: 'Nav / labels', value: '13 / 450 · 10 / 600 / +0.08em' },
            {
              label: 'Rule',
              value: 'Tight display only for major statements',
            },
          ]}
        />
        <div className="mt-8">
          <Callout>
            Stop changing fonts. Refine surfaces and spacing. Cards use quiet
            borders, generous padding, and subtle directional light — not
            decorative purple blocks.
          </Callout>
        </div>
      </Section>
    </>
  );
}
