'use client';

import { Badge, Button, Checkbox, EmptyState, Field, Input, Panel, Select, Spinner, Stage, StatusPill, Surface, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, Tooltip, Body, Display, Meta, PageTitle, TextSectionTitle } from '@repo/ui';
import { useState } from 'react';

import { Callout, Section } from './docs-ui';

function DemoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="type-meta">{label}</p>
      {children}
    </div>
  );
}

export function ComponentsGallery() {
  const [enabled, setEnabled] = useState(true);

  return (
    <>
      <Callout>
        Stage is the CubeCom brand surface. Surface and Panel are subordinate
        chrome for working UI — never treat Stage as a Surface variant.
      </Callout>

      <Section title="Stage vs Surface">
        <div className="grid gap-6 lg:grid-cols-2">
          <DemoBlock label="Stage (brand)">
            <Stage size="cover" product className="w-full rounded-[10px]" />
          </DemoBlock>
          <DemoBlock label="Surface / Panel (chrome)">
            <Panel
              title="Quiet panel"
              description="White chrome for forms, filters, and admin work."
              actions={<Button size="sm">Action</Button>}
            >
              <p className="text-[13px] text-[var(--text-secondary)]">
                No mineral field. No violet plane. Borders stay quiet.
              </p>
            </Panel>
            <Surface className="mt-4 p-4">
              <p className="text-[13px] text-[var(--text-secondary)]">
                Bare Surface — content container only.
              </p>
            </Surface>
          </DemoBlock>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <DemoBlock label="Stage full">
            <Stage size="full" product className="w-full rounded-[10px]" />
          </DemoBlock>
          <DemoBlock label="Stage thumb">
            <Stage size="thumb" product className="w-full" />
          </DemoBlock>
          <DemoBlock label="Stage plane off">
            <Stage size="thumb" plane={false} product className="w-full" />
          </DemoBlock>
        </div>
      </Section>

      <Section title="Typography">
        <div className="space-y-6">
          <Display className="!text-[40px] sm:!text-[56px]">Display</Display>
          <PageTitle>Page title</PageTitle>
          <TextSectionTitle>Section title</TextSectionTitle>
          <Body>
            Body text uses Inter at 14 / 1.55 with secondary color and a quiet
            measure for reading.
          </Body>
          <Meta>Meta · SKU CFG-1042 · supporting detail</Meta>
        </div>
      </Section>

      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="sm">Small</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="primary" size="lg">
            Landing primary
          </Button>
          <Button variant="secondary" size="lg">
            Landing secondary
          </Button>
          <Button variant="primary" size="nav">
            Nav CTA
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[10px] bg-[var(--ink)] p-4">
          <Button variant="inverse" size="lg">
            On ink
          </Button>
          <Button variant="inverseSecondary" size="lg">
            On ink secondary
          </Button>
        </div>
      </Section>

      <Section title="Field controls">
        <div className="grid max-w-md gap-5">
          <Field label="Product name" htmlFor="demo-name" hint="Shown in catalogs.">
            <Input id="demo-name" placeholder="Classic Cap" />
          </Field>
          <Field label="Notes" htmlFor="demo-notes">
            <Textarea id="demo-notes" placeholder="Optional production notes" />
          </Field>
          <Field label="Category" htmlFor="demo-category">
            <Select id="demo-category" defaultValue="caps">
              <option value="caps">Caps</option>
              <option value="bags">Bags</option>
              <option value="apparel">Apparel</option>
            </Select>
          </Field>
          <Field label="Name" htmlFor="demo-error" error="Name is required.">
            <Input id="demo-error" aria-invalid />
          </Field>
          <div className="flex flex-wrap items-center gap-6">
            <Checkbox id="demo-check" label="Publish when ready" defaultChecked />
            <div className="inline-flex items-center gap-2">
              <Switch
                checked={enabled}
                onCheckedChange={setEnabled}
                aria-label="Enable sync"
              />
              <span className="text-[13px] text-[var(--ink)]">
                Sync {enabled ? 'on' : 'off'}
              </span>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Badge & StatusPill">
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="info">Info</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusPill status="live">Live</StatusPill>
          <StatusPill status="draft">Draft</StatusPill>
          <StatusPill status="cancelled">Cancelled</StatusPill>
          <StatusPill status="warning">Needs review</StatusPill>
          <StatusPill status="info">Mapped</StatusPill>
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="overview" className="max-w-lg">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="commerce">Commerce</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Body>Quiet underline active state — black, not violet pills.</Body>
          </TabsContent>
          <TabsContent value="commerce">
            <Body>Pricing and channel mapping content lives here.</Body>
          </TabsContent>
          <TabsContent value="assets">
            <Body>3D, logos, and media references.</Body>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Tooltip">
        <Tooltip content="Configure this product">
          <Button variant="secondary" size="sm">
            Hover me
          </Button>
        </Tooltip>
      </Section>

      <Section title="EmptyState & Spinner">
        <div className="grid gap-6 lg:grid-cols-2">
          <EmptyState
            title="No products yet"
            description="Create a product to place it on the stage and start configuring."
            action={<Button size="sm">New product</Button>}
          />
          <EmptyState
            stage
            title="Empty stage"
            description="Onboarding and empty moments can sit on Stage."
            action={<Button size="sm">Add first product</Button>}
          />
        </div>
        <div className="mt-6 flex items-center gap-4">
          <Spinner />
          <Spinner size="sm" />
          <span className="type-meta">Loading indicators</span>
        </div>
      </Section>
    </>
  );
}
