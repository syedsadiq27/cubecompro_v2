import { Planned } from '@/components/planned';

export const metadata = { title: 'SDKs' };

export default function SdksPage() {
  return (
    <Planned
      title="SDKs"
      description="No first-party client SDK in this release. Generate from schema.gql."
      ships={false}
      contract="Until an official SDK ships, use any GraphQL client (fetch, urql, Apollo) against POST /graphql with a Bearer token. Typed operations should be generated from apps/api/src/schema.gql. Do not depend on an unpublished @cubecompro/sdk package name."
      related={[
        { href: '/developers/graphql', label: 'GraphQL API' },
        { href: '/reference/api', label: 'API reference' },
      ]}
    />
  );
}
