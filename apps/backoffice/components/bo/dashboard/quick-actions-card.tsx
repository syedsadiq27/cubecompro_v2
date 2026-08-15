'use client';

import Link from 'next/link';
import {
  LinkIcon,
  PlusIcon,
  SettingsIcon,
  UploadIcon,
} from '@/components/bo/icons';

export function QuickActionsCard({
  projectId,
  title = 'Quick actions',
}: {
  projectId: string;
  title?: string;
}) {
  const actions = [
    {
      id: 'new_product',
      label: 'New product',
      href: `/${projectId}/products/new`,
      icon: (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--ink)] text-[var(--ink)]">
          <PlusIcon size={14} />
        </div>
      ),
    },
    {
      id: 'import_assets',
      label: 'Import assets',
      href: `/${projectId}/library`,
      icon: <UploadIcon size={18} className="text-[var(--ink)]" />,
    },
    {
      id: 'configure_product',
      label: 'Configure product',
      href: `/${projectId}/products`,
      icon: <SettingsIcon size={18} className="text-[var(--ink)]" />,
    },
    {
      id: 'map_commerce',
      label: 'Map commerce',
      href: `/${projectId}/commerce/mappings`,
      icon: <LinkIcon size={18} className="text-[var(--ink)]" />,
    },
  ];

  return (
    <div className="flex flex-col rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs">
      <h3 className="text-[14px] font-semibold text-[var(--ink)]">
        {title}
      </h3>

      <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 text-center transition-all duration-150 hover:bg-[var(--canvas)] hover:border-[var(--border-strong)] hover:shadow-xs no-underline group"
          >
            <span className="shrink-0 transition-transform duration-150 group-hover:scale-105">
              {action.icon}
            </span>
            <span className="text-[12px] font-medium text-[var(--ink)]">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
