import { Planned } from '@/components/planned';

export const metadata = { title: 'Webhooks' };

export default function WebhooksPage() {
  return (
    <Planned
      title="Webhooks"
      description="HTTP delivery of the event vocabulary. Not shipping in this release."
      ships={false}
      contract="When live: HTTPS POST, at-least-once, HMAC over the raw body, retry with backoff. Subscribers must be idempotent on event id. Until then, poll GraphQL. Do not implement signature verification against a URL we have not published."
      related={[
        { href: '/reference/events', label: 'Events' },
        { href: '/developers/errors', label: 'Errors' },
      ]}
    />
  );
}
