'use client';

import { Container, List, ListItem, Typography, Wordmark } from '@repo/ui';
import Link from 'next/link';

import {
  footerCompany,
  footerDevelopers,
  footerIntegrations,
  footerLegal,
  footerProduct,
  type NavLink,
} from '@/lib/navigation';

function FooterLink({ item }: { item: NavLink }) {
  if (item.external) {
    return (
      <Typography
        as="a"
        href={item.href}
        variant="support"
        tone="inverse"
        className="hover:text-white"
        rel="noopener noreferrer"
      >
        {item.label}
      </Typography>
    );
  }
  return (
    <Typography
      as={Link}
      href={item.href}
      variant="support"
      tone="inverse"
      className="hover:text-white"
    >
      {item.label}
    </Typography>
  );
}

function FooterGroup({
  title,
  items,
}: {
  title: string;
  items: NavLink[];
}) {
  return (
    <details className="footer-nav-group group border-b border-white/10 md:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-[11px] font-medium tracking-[0.12em] text-white/40 uppercase md:pointer-events-none md:cursor-default md:py-0 [&::-webkit-details-marker]:hidden">
        <Typography as="span" variant="label" tone="inverse">
          {title}
        </Typography>
        <Typography
          as="span"
          variant="mono"
          tone="inverse"
          className="text-white/35 transition group-open:rotate-45 md:hidden"
          aria-hidden
        >
          +
        </Typography>
      </summary>
      <List
        gap="sm"
        className="pb-4 text-[15px] leading-snug text-white/65 md:mt-4 md:pb-0 md:text-sm"
      >
        {items.map((item) => (
          <ListItem key={`${item.href}-${item.label}`}>
            <FooterLink item={item} />
          </ListItem>
        ))}
      </List>
    </details>
  );
}

export function SiteFooter() {
  return (
    <footer
      data-surface-tone="ink"
      className="border-t border-[var(--ink)] bg-[var(--ink)]"
    >
      <Container padding="none" className="py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16">
          <div>
            <Wordmark size="lg" showPro tone="inverse" />
            <Typography variant="body" className="mt-4 max-w-xs md:text-sm">
              Product configuration infrastructure for visual commerce.
            </Typography>
          </div>

          <div className="md:grid md:grid-cols-4 md:items-start md:gap-8 lg:gap-10">
            <FooterGroup title="Solutions" items={footerProduct} />
            <FooterGroup title="Integrations" items={footerIntegrations} />
            <FooterGroup title="Developers" items={footerDevelopers} />
            <FooterGroup title="Company" items={footerCompany} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <Typography as="p" variant="meta" tone="inverse">
            © {new Date().getFullYear()} CubeCom Pro
          </Typography>
          <List direction="row" gap="md" wrap className="gap-x-5 gap-y-2">
            {footerLegal.map((item) => (
              <ListItem key={item.href}>
                <FooterLink item={item} />
              </ListItem>
            ))}
          </List>
        </div>
      </Container>
    </footer>
  );
}
