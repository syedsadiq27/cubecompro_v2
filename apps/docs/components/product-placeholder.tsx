import { Callout, PageHeader, Prose, Section } from './docs-ui';

export function ProductPlaceholder({
  title,
  description,
  bullets,
}: {
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Section title="Coming soon">
        <Prose>
          <p>
            This section will cover guides for customers, partners, and
            implementers.
          </p>
        </Prose>
        <ul className="mt-5 space-y-3">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="text-[15px] leading-[1.5] text-[var(--text-secondary)]"
            >
              {bullet}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Callout>
            Shared brand rules live under{' '}
            <a
              href="/design-principles"
              className="font-medium text-[var(--ink)] underline-offset-2 hover:underline"
            >
              Design principles
            </a>
            .
          </Callout>
        </div>
      </Section>
    </>
  );
}
