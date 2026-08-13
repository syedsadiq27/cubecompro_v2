import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Security' };

export default function SecurityPage() {
  return (
    <>
      <PageHeader
        title="Security"
        description="HS256 JWTs, org/project membership, bearer on documents."
      />
      <Section title="Current controls">
        <Prose>
          <p>
            Login issues a 7-day HS256 token. Resolvers check organization
            and project membership. Document routes require the same bearer.
            CORS is configured for the apps you deploy.
          </p>
        </Prose>
        <Callout>
          Rotate JWT_SECRET on a cadence. Do not put the token in a public
          storefront bundle without a storefront-scoped credential design —
          that is not shipped.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/developers/authentication', label: 'Authentication' },
            { href: '/operations/environments', label: 'Environments' },
          ]}
        />
      </Section>
    </>
  );
}
