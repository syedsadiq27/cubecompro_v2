'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const COMMANDS = [
    { category: 'NAVIGATION', label: 'Organizations & Tenants', href: '/organizations', shortcut: 'G O' },
    { category: 'NAVIGATION', label: 'Users & Identity Directory', href: '/users', shortcut: 'G U' },
    { category: 'NAVIGATION', label: 'Commercial Plans', href: '/plans', shortcut: 'G P' },
    { category: 'NAVIGATION', label: 'Entitlements Matrix', href: '/entitlements', shortcut: 'G E' },
    { category: 'NAVIGATION', label: 'Resource Usage Telemetry', href: '/usage', shortcut: 'G R' },
    { category: 'NAVIGATION', label: 'Async Processing Jobs', href: '/jobs', shortcut: 'G J' },
    { category: 'NAVIGATION', label: 'Platform Audit Log', href: '/audit', shortcut: 'G A' },
    { category: 'QUICK ACTIONS', label: 'Provision New Organization', href: '/organizations/new', shortcut: '+ N' },
    { category: 'QUICK ACTIONS', label: 'Platform Settings & Security', href: '/settings', shortcut: 'G S' },
  ];

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 p-4 select-none animate-in fade-in duration-100">
      <div className="w-full max-w-lg rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-[var(--line)] px-4 py-3">
          <span className="text-[13px] text-[var(--text-muted)]">🔍</span>
          <input
            type="text"
            autoFocus
            placeholder="Type a command, organization, or jump to page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[13px] text-[var(--ink)] placeholder-[var(--text-muted)] outline-none"
          />
          <kbd className="rounded border border-[var(--line)] bg-[var(--canvas)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.label}
                onClick={() => navigateTo(item.href)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-[12px] text-[var(--ink)] hover:bg-[var(--canvas)] cursor-pointer transition-colors"
              >
                <span>{item.label}</span>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">{item.shortcut}</span>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-[12px] text-[var(--text-muted)]">
              No matching commands or resources found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
