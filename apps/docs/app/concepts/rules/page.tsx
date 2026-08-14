import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';
import { docsMeta } from '@/lib/site';

export const metadata = docsMeta(
  'Configuration Rules',
  '/concepts/rules',
  'Rules and constraints in CubeCom Pro — what makes a configuration legal before commerce resolve.'
);

export default function RulesConceptPage() {
  return (
    <>
      <PageHeader
        title="Rules & constraints"
        description="Rules are data on the graph version, evaluated at resolve time. They keep illegal combinations out of scene state and out of the cart."
      />

      <Section title="Shape">
        <CodeBlock>{`condition:  { attr: "material", eq: "leather" }
            { all: [ … ] } | { any: [ … ] }

effect:     { forbid: { attr: "color", eq: "white" } }
            { require: { attr: "frame", eq: "walnut" } }`}</CodeBlock>
        <Prose>
          <p>
            Stored as JSON on <code>ConfigurationRule</code>. Backoffice
            authors IF / THEN; the API stores condition + effect.
          </p>
        </Prose>
      </Section>

      <Section title="When they run">
        <Prose>
          <p>
            After selections are normalized against attributes, each rule on
            the active graph version is applied. Failures append to
            <code>violations</code> and set <code>valid: false</code>.
          </p>
        </Prose>
        <SpecTable
          rows={[
            {
              label: 'forbid',
              value: 'If the condition matches, that attribute must not equal the given value.',
            },
            {
              label: 'require',
              value: 'If the condition matches, that attribute must equal the given value.',
            },
          ]}
        />
        <Callout>
          Invalid configurations never resolve to a commerce action. The
          customizer must treat <code>valid: false</code> as a hard stop,
          not a warning toast over an Add to cart button.
        </Callout>
      </Section>

      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/configuration', label: 'Configuration' },
            { href: '/concepts/commerce', label: 'Commerce references' },
            { href: '/start/rules', label: 'Add configuration rules' },
          ]}
        />
      </Section>
    </>
  );
}
