import { Grid, ListItem, Section, Typography } from '@repo/ui';
import Link from 'next/link';
import type { SeoPageDef } from '@/lib/seo-pages';

export function SeoRelated({ page }: { page: SeoPageDef }) {
  return (
    <Section tone="soft" spacing="default">
      <Section.Header title="Related CubeCom pages" />
      <Section.Body gap="lg">
        <Grid as="ul" cols="md-3" gap="xl">
          {page.related.map((item) => (
            <ListItem
              key={item.href}
              className="border-t border-[var(--border-strong)] pt-5"
            >
              <Typography
                as={Link}
                href={item.href}
                variant="title"
                className="transition hover:text-[var(--text-secondary)]"
              >
                {item.label}
              </Typography>
              <Typography variant="support" className="mt-2">
                {item.blurb}
              </Typography>
            </ListItem>
          ))}
        </Grid>
      </Section.Body>
    </Section>
  );
}
