import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Configure dependent options' };

export default function DependentOptionsPage() {
  return (
    <>
      <PageHeader
        title="Configure dependent options"
        description="Hide or disable values by asking resolve, not by cloning rules into the client."
      />
      <Section title="Pattern">
        <Prose>
          <p>
            When the shopper changes Material, rebuild Color’s enabled set:
            for each color value, resolve the tentative selection. If valid
            is false, disable that swatch. Rules stay on the server.
          </p>
        </Prose>
        <Callout>
          Optimistic UI is fine. The cart CTA must still branch on a fresh
          resolve, not on the last optimistic paint.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/rules', label: 'Rules & constraints' },
            { href: '/start/rules', label: 'Add configuration rules' },
            { href: '/guides/custom-ui', label: 'Build custom UI' },
          ]}
        />
      </Section>
    </>
  );
}
