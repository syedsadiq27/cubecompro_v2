import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Configuration' };

export default function ConfigurationPage() {
  return (
    <>
      <PageHeader
        title="Configuration state"
        description="A ConfigurationState is the shopper’s (or preview’s) current choices. It is input to resolve. It is not a SKU, not a cart line, and not a scene."
      />

      <Section title="Contract">
        <CodeBlock>{`{
  "productId": "clxyz…",
  "graphVersionId": "optional-draft-or-specific-version",
  "selections": {
    "color": "black",
    "size": "xl",
    "frame": "walnut"
  }
}`}</CodeBlock>
        <Prose>
          <p>
            Keys are attribute keys. Values are attribute value keys (or
            arrays for MULTI_SELECT, booleans/numbers/text for other types).
            GraphQL wraps this as <code>selectionsJson</code> on
            <code>ConfigurationStateInput</code>.
          </p>
        </Prose>
      </Section>

      <Section title="Normalization">
        <Prose>
          <p>
            Resolve normalizes unknown keys, missing required attributes, and
            illegal values into <code>violations[]</code>. A state can be
            syntactically complete and still invalid after rules.
          </p>
        </Prose>
        <Callout>
          Do not invent SKUs client-side from concatenated keys. Ask resolve.
          The same selection can map to different commerce identities after
          a publish.
        </Callout>
      </Section>

      <Section title="Resolved selection">
        <Prose>
          <p>
            Output is <code>ResolvedConfiguration</code>: the normalized
            selections, <code>valid</code>, <code>violations</code>, plus two
            projections from the same walk:
          </p>
        </Prose>
        <CodeBlock>{`threeD.effects[]     operation + target + material/visibility payload
commerce             provider, sku, external ids, cartPayload`}</CodeBlock>
        <Prose>
          <p>
            Scene state (materials, visibility) and commerce state (SKU,
            references) are siblings. If <code>valid</code> is false,
            commerce action must not proceed — even if a SKU string happens
            to be present.
          </p>
        </Prose>
      </Section>

      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/resolved-selection', label: 'Resolved selection' },
            { href: '/concepts/scene-state', label: 'Scene state' },
            { href: '/concepts/commerce', label: 'Commerce references' },
          ]}
        />
      </Section>
    </>
  );
}
