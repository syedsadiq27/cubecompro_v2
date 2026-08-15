import { Section, Card, Typography } from '@repo/ui';
import { problemFlow } from '@/lib/content';

export function Why3d() {
  return (
    <Section id="why" tone="muted" spacing="default">
      <Section.Header
        title="Static product pages sell a snapshot. Configurable products need a live state."
        description="Photo PDPs and variant matrices fall apart as options multiply. Shoppers need a product that updates — and still resolves to something you can sell."
      />

      <Section.Body gap="spacious">
        <ol className="flex flex-col gap-0 md:flex-row md:flex-wrap md:items-center md:gap-2">
          {problemFlow.map((step, index) => (
            <li
              key={step}
              className="flex flex-col items-stretch md:flex-row md:items-center md:gap-2"
            >
              <Card padding="chip">
                <Typography variant="bodyStrong">{step}</Typography>
              </Card>
              {index < problemFlow.length - 1 ? (
                <span
                  className="py-1.5 text-center text-[var(--text-muted)] md:py-0"
                  aria-hidden
                >
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </Section.Body>
    </Section>
  );
}
