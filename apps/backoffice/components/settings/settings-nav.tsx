import Link from 'next/link';
import { Button } from '@repo/ui';

const tabs = [
  { href: 'cms', label: 'CMS' },
  { href: 'commerce', label: 'Commerce' },
  { href: 'microservice', label: 'Microservice' },
  { href: 'api', label: 'API' },
];

export function SettingsNav({
  projectId,
  active,
}: {
  projectId: string;
  active: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-1.5">
      {tabs.map((tab) => {
        const href = `/${projectId}/settings/${tab.href}`;
        const isActive = active === tab.href;
        return (
          <Button
            key={tab.href}
            as={Link}
            href={href}
            size="sm"
            variant={isActive ? 'primary' : 'secondary'}
            className="rounded-full"
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
