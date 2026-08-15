import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  DescriptionList,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from '@repo/ui';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { SolutionBridge } from '@/components/solutions/solution-bridge';
import { SeoCta } from './seo-cta';
import { SeoDemoEmbed } from './seo-demo-embed';
import { SeoFaq } from './seo-faq';
import { SeoJsonLd } from './seo-json-ld';
import { SeoPageShell } from './seo-page-shell';
import { SeoRelated } from './seo-related';
import { SeoSection } from './seo-section';

export function SeoMarketingPage({
  path,
  visual,
  intro,
}: {
  path: string;
  visual?: ReactNode;
  intro?: ReactNode;
}) {
  const page = getSeoPage(path);
  const body = getSeoBody(path);
  const bridge = page.related[0];

  return (
    <>
      <SeoJsonLd page={page} faqs={body.faqs} />
      <SeoPageShell page={page} visual={visual}>
        {intro}
        {body.sections.map((section) => (
          <SeoSection
            key={section.title}
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            tone={section.tone}
          >
            {section.kind === 'bullets' ? (
              <Grid as="ul" cols="md-2" gap="md" className="max-w-4xl">
                {section.bullets.map((item) => (
                  <Card as="li" key={item} padding="md">
                    <Typography variant="body">{item}</Typography>
                  </Card>
                ))}
              </Grid>
            ) : null}

            {section.kind === 'columns' ? (
              <Grid
                cols={section.columns.length > 2 ? 'md-3' : 'md-2'}
                gap="md"
                className="max-w-5xl"
              >
                {section.columns.map((column) => (
                  <Card key={column.title} padding="md">
                    <Stack gap="md">
                      <Typography variant="title">{column.title}</Typography>
                      <List gap="sm">
                        {column.items.map((item) => (
                          <ListItem key={item}>
                            <Typography variant="body">{item}</Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  </Card>
                ))}
              </Grid>
            ) : null}

            {section.kind === 'links' ? (
              <List direction="row" gap="md" wrap>
                {section.links.map((item) => {
                  const external = item.href.startsWith('http');
                  return (
                    <ListItem key={item.href}>
                      {external ? (
                        <Button
                          as="a"
                          href={item.href}
                          variant="secondary"
                          size="md"
                          rel="noopener noreferrer"
                        >
                          {item.label}
                        </Button>
                      ) : (
                        <Button
                          as={Link}
                          href={item.href}
                          variant="secondary"
                          size="md"
                        >
                          {item.label}
                        </Button>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            ) : null}

            {section.kind === 'prose' ? (
              <Stack gap="md" className="max-w-3xl">
                {section.paragraphs.map((paragraph) => (
                  <Typography key={paragraph} variant="body">
                    {paragraph}
                  </Typography>
                ))}
              </Stack>
            ) : null}

            {section.kind === 'steps' ? (
              <Grid as="ol" cols="md-3" gap="md" className="max-w-4xl">
                {section.steps.map((step, index) => (
                  <Card as="li" key={step.title} padding="md">
                    <Stack gap="sm">
                      <Typography variant="code" tone="accent">
                        {String(index + 1).padStart(2, '0')}
                      </Typography>
                      <Typography variant="bodyStrong" as="h3">
                        {step.title}
                      </Typography>
                      <Typography variant="support">{step.body}</Typography>
                    </Stack>
                  </Card>
                ))}
              </Grid>
            ) : null}

            {section.kind === 'proof' ? (
              <Grid cols="md-2" gap="md" className="max-w-4xl">
                <Card padding="md">
                  <Stack gap="md">
                    <Typography variant="mono">
                      Configuration
                    </Typography>
                    <DescriptionList gap="none">
                      {section.configuration.map((row) => (
                        <div
                          key={row.label}
                          className="flex justify-between gap-3 border-b border-[var(--line)] py-2"
                        >
                          <Typography as="dt" variant="meta" tone="muted">
                            {row.label}
                          </Typography>
                          <Typography as="dd" variant="bodyStrong">
                            {row.value}
                          </Typography>
                        </div>
                      ))}
                    </DescriptionList>
                  </Stack>
                </Card>
                <Card tone="ink" padding="md">
                  <Stack gap="md">
                    <Typography variant="mono">
                      Sellable state
                    </Typography>
                    <DescriptionList gap="none">
                      {section.resolved.map((row) => (
                        <div
                          key={row.label}
                          className="flex justify-between gap-3 border-b border-white/15 py-2"
                        >
                          <Typography as="dt" variant="meta" tone="inverse">
                            {row.label}
                          </Typography>
                          <Typography
                            as="dd"
                            variant="code"
                            tone="inverse"
                            className="text-right normal-case tracking-normal"
                          >
                            {row.value}
                          </Typography>
                        </div>
                      ))}
                    </DescriptionList>
                  </Stack>
                </Card>
                {section.note ? (
                  <Typography
                    variant="support"
                    tone="muted"
                    className="md:col-span-2"
                  >
                    {section.note}
                  </Typography>
                ) : null}
              </Grid>
            ) : null}

            {section.kind === 'math' ? (
              <Stack gap="lg" className="max-w-4xl">
                <Card
                  as="p"
                  padding="sm"
                  className="font-mono text-sm text-[var(--ink)] md:text-base"
                >
                  {section.equation}
                </Card>
                <Grid cols="md-2" gap="md">
                  {[section.left, section.right].map((column) => (
                    <Card key={column.title} padding="md">
                      <Stack gap="md">
                        <Typography variant="title">{column.title}</Typography>
                        <List gap="sm">
                          {column.items.map((item) => (
                            <ListItem key={item}>
                              <Typography variant="body">{item}</Typography>
                            </ListItem>
                          ))}
                        </List>
                      </Stack>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            ) : null}

            {section.kind === 'code' ? (
              <div
                className="max-w-4xl overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--ink)]"
                data-surface-tone="ink"
              >
                {section.caption ? (
                  <Typography
                    variant="mono"
                    className="border-b border-white/10 px-4 py-2 tracking-[0.06em]"
                  >
                    {section.caption}
                  </Typography>
                ) : null}
                <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed text-[var(--canvas)] md:text-[13px]">
                  <code>{section.code}</code>
                </pre>
              </div>
            ) : null}

            {section.kind === 'demo' ? (
              <SeoDemoEmbed product={section.product} />
            ) : null}
          </SeoSection>
        ))}

        {bridge ? (
          <SolutionBridge
            title={`${bridge.blurb}`}
            href={bridge.href}
            label={`See ${bridge.label}`}
            tone="soft"
          />
        ) : null}

        <SeoFaq
          items={body.faqs}
          title={body.faqTitle}
          description={body.faqDescription}
          compact
        />
        <SeoRelated page={page} />
        <SeoCta {...body.cta} />
      </SeoPageShell>
    </>
  );
}
