import { Compare, Section } from '@repo/ui';

export function SolutionCompare({
  without,
  withItems,
  title = 'Without CubeCom vs with CubeCom',
  withoutLabel = 'Without CubeCom',
  withLabel = 'With CubeCom',
}: {
  without: string[];
  withItems: string[];
  title?: string;
  withoutLabel?: string;
  withLabel?: string;
}) {
  return (
    <Section tone="canvas" spacing="default">
      <Section.Header title={title} />

      <Section.Body gap="none" className="mt-8 md:mt-12">
        <Compare
          left={{ label: withoutLabel, items: without }}
          right={{ label: withLabel, items: withItems }}
        />
      </Section.Body>
    </Section>
  );
}
