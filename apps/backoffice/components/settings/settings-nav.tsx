import Link from 'next/link';

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
    <div className="mb-6 flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const href = `/${projectId}/settings/${tab.href}`;
        const isActive = active === tab.href;
        return (
          <Link
            key={tab.href}
            href={href}
            className={`rounded-full px-4 py-2 text-sm ${
              isActive
                ? 'bg-[var(--bo-ink)] text-white'
                : 'border border-[var(--bo-line)] bg-white'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
