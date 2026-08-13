import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export function Planned({
  title,
  description,
  ships,
  contract,
  related = [],
}: {
  title: string;
  description: string;
  ships: boolean;
  contract: string;
  related?: Array<{ href: string; label: string }>;
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <Section title={ships ? 'In this release' : 'Contract'}>
        <Prose>
          <p>{contract}</p>
        </Prose>
        {!ships ? (
          <Callout>
            Not shipped as a productized API yet. The contract above is stable
            enough to design against; do not build verify/HMAC or client SDKs
            until the corresponding Developer page says otherwise.
          </Callout>
        ) : null}
      </Section>
      {related.length > 0 ? (
        <Section title="Related">
          <Related links={related} />
        </Section>
      ) : null}
    </>
  );
}
