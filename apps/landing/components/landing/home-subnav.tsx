import Link from 'next/link';
import { homeSubnav } from '@/lib/navigation';

export function HomeSubnav() {
  return (
    <nav
      aria-label="On this page"
      className="sticky top-[3.65rem] z-40 border-b border-[var(--line)] bg-[var(--canvas)]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[90rem] gap-5 overflow-x-auto px-5 py-2.5 md:px-8">
        {homeSubnav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 text-sm text-[var(--text-secondary)] transition hover:text-[var(--ink)]"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
