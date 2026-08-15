'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  Button,
  Field,
  Input,
  Panel,
  Select,
  Textarea,
  useToast,
} from '@repo/ui';
import { CheckIcon, CloseIcon } from '@/components/bo/icons';
import { StatusBadge } from '@/components/bo/states/operational-states';
import type { MutationResult } from '@/actions/products';

type BlueprintTemplate = 'furniture' | 'apparel' | 'swatch' | 'blank';

const TEMPLATES: Array<{
  id: BlueprintTemplate;
  label: string;
  description: string;
  options: string[];
  sampleStates: number;
}> = [
  {
    id: 'furniture',
    label: 'Modular Furniture Matrix',
    description:
      'Color swatch, dimension sizes, wood frame, and upholstery materials.',
    options: [
      'Color (2 swatches)',
      'Size (2 choices)',
      'Frame (2 woods)',
      'Material (2 choices)',
    ],
    sampleStates: 8,
  },
  {
    id: 'apparel',
    label: 'Apparel & Sizing',
    description: 'Garment sizes, colors, and premium fabrics.',
    options: ['Size (S, M, L, XL)', 'Color (4 choices)', 'Fabric (2 choices)'],
    sampleStates: 16,
  },
  {
    id: 'swatch',
    label: 'Colorway Swatch Only',
    description:
      'Simple visual swatches without geometry dimension branching.',
    options: ['Color (6 swatches)'],
    sampleStates: 6,
  },
  {
    id: 'blank',
    label: 'Blank / Custom Graph',
    description: 'Start with an empty canvas and author options from scratch.',
    options: ['No initial options'],
    sampleStates: 0,
  },
];

export function CreateProductForm({
  projectId,
  action,
}: {
  projectId: string;
  action: (
    projectId: string,
    formData: FormData
  ) => Promise<MutationResult>;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [name, setName] = useState('Studio Lounge Chair');
  const [key, setKey] = useState('CHAIR-02');
  const [description, setDescription] = useState(
    'Modern ergonomic lounge chair designed with modular upholstery and FSC-certified solid wood components.'
  );
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE'>('ACTIVE');
  const [category, setCategory] = useState('Seating > Lounge Chairs');
  const [brand, setBrand] = useState('CubeCom');
  const [tags, setTags] = useState<string[]>([
    'Contract-grade',
    'Bespoke',
    'FSC-wood',
  ]);
  const [tagInput, setTagInput] = useState('');
  const [template, setTemplate] = useState<BlueprintTemplate>('furniture');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1580481077197-28565a0db830?w=600&auto=format&fit=crop&q=80'
  );
  const [modelAttached, setModelAttached] = useState('demo-chair.glb');
  const [price, setPrice] = useState('349.00');
  const [skuPrefix, setSkuPrefix] = useState('SKU-CHAIR-02');

  const handleNameChange = (val: string) => {
    setName(val);
    if (!key || key.startsWith('CHAIR-') || key.startsWith('PROD-')) {
      const slug = val
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 16);
      if (slug) setKey(slug);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^,+|,+$/g, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const activeTemplate = TEMPLATES.find((t) => t.id === template)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) {
      setErrorMessage('Product name and key are required.');
      return;
    }

    const formData = new FormData();
    formData.append('Name', name.trim());
    formData.append('key', key.trim());

    startTransition(async () => {
      try {
        const result = await action(projectId, formData);
        if (result?.error) {
          setErrorMessage(result.error);
          toast.error(result.error);
        } else {
          toast.success('Product created successfully');
        }
      } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) {
          throw err;
        }
        setErrorMessage(
          err instanceof Error ? err.message : 'Could not create product'
        );
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12"
    >
      <div className="space-y-6 lg:col-span-8">
        {errorMessage ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-red-800">
            {errorMessage}
          </div>
        ) : null}

        <Panel
          title="1. Product Identity"
          description="Core naming, unique product key, and operational status."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Product Name *" htmlFor="product-name">
              <Input
                id="product-name"
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Studio Lounge Chair"
              />
            </Field>
            <Field label="Product Key / Code *" htmlFor="product-key">
              <Input
                id="product-key"
                type="text"
                required
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="e.g. CHAIR-02"
                className="ui:font-mono"
              />
            </Field>
          </div>

          <Field
            label="Editorial Description"
            htmlFor="product-description"
            className="ui:mt-4"
          >
            <Textarea
              id="product-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide customer-facing description..."
            />
          </Field>

          <Field
            label="Initial Lifecycle Status"
            htmlFor="product-status"
            className="ui:mt-4 ui:max-w-sm"
          >
            <Select
              id="product-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'ACTIVE')}
            >
              <option value="ACTIVE">Active (Storefront Ready)</option>
              <option value="DRAFT">Draft (Internal Only)</option>
            </Select>
          </Field>
        </Panel>

        <Panel
          title="2. Categorization & Organization"
          description="Organize into showroom taxonomy, brand portfolio, and discovery tags."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Category" htmlFor="product-category">
              <Select
                id="product-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Seating > Lounge Chairs">
                  Seating &gt; Lounge Chairs
                </option>
                <option value="Seating > Office Chairs">
                  Seating &gt; Office Chairs
                </option>
                <option value="Tables > Desks">Tables &gt; Desks</option>
                <option value="Storage > Modular">Storage &gt; Modular</option>
                <option value="Lighting > Floor">Lighting &gt; Floor</option>
              </Select>
            </Field>
            <Field label="Brand" htmlFor="product-brand">
              <Input
                id="product-brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Field>
          </div>

          <Field
            label="Tags (Press Enter to add)"
            htmlFor="product-tags"
            className="ui:mt-4"
          >
            <div className="flex flex-wrap items-center gap-1.5 rounded-[7px] border border-[var(--line)] bg-[var(--surface-pure)] p-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded border border-[var(--line)] bg-[var(--canvas)] px-2 py-1 text-[11px] font-medium text-[var(--ink)]"
                >
                  <span>{t}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTag(t)}
                    className="ui:h-auto ui:min-h-0 ui:p-0 ui:text-[var(--text-muted)] ui:hover:text-red-600"
                    aria-label={`Remove ${t}`}
                  >
                    <CloseIcon size={12} />
                  </Button>
                </span>
              ))}
              <Input
                id="product-tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag and press enter..."
                className="ui:min-w-[120px] ui:flex-1 ui:border-0 ui:bg-transparent ui:px-1 ui:shadow-none ui:focus:border-transparent"
              />
            </div>
          </Field>
        </Panel>

        <Panel
          title="3. Configuration Blueprint"
          description="Select an initial option structure. You can customize options and add rules later."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TEMPLATES.map((tmpl) => {
              const isSelected = template === tmpl.id;
              return (
                <label
                  key={tmpl.id}
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                    isSelected
                      ? 'border-[#665CFF] bg-[#665CFF]/[0.03] ring-1 ring-[#665CFF]'
                      : 'border-[var(--line)] bg-[var(--surface-pure)] hover:bg-[var(--canvas)]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-[13px] font-semibold text-[var(--ink)]">
                      {tmpl.label}
                    </h3>
                    <input
                      type="radio"
                      name="blueprint_template"
                      checked={isSelected}
                      onChange={() => setTemplate(tmpl.id)}
                      className="mt-0.5 accent-[#665CFF]"
                    />
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-[var(--text-secondary)]">
                    {tmpl.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {tmpl.options.map((opt, i) => (
                      <span
                        key={i}
                        className="rounded border border-[var(--line)] bg-[var(--canvas)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                </label>
              );
            })}
          </div>
        </Panel>

        <Panel
          title="4. 3D Model & Preview Image"
          description="Attach geometry and primary imagery for storefront 3D customizer."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Initial 3D Model Asset (GLB)" htmlFor="product-model">
              <Select
                id="product-model"
                value={modelAttached}
                onChange={(e) => setModelAttached(e.target.value)}
                className="ui:font-mono ui:text-[12px]"
              >
                <option value="demo-chair.glb">
                  demo-chair.glb (24.6 MB · 6 meshes)
                </option>
                <option value="lounge-frame.glb">
                  lounge-frame.glb (18.2 MB · 4 meshes)
                </option>
                <option value="none">— Attach later in 3D tab —</option>
              </Select>
            </Field>
            <Field label="Primary Preview Image URL" htmlFor="product-image">
              <Input
                id="product-image"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="ui:text-[12px]"
              />
            </Field>
          </div>
        </Panel>

        <Panel
          title="5. Commerce & Initial Pricing"
          description="Set base pricing and SKU naming rules before generating resolved configuration states."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Base Price ($ USD)" htmlFor="product-price">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--text-muted)]">
                  $
                </span>
                <Input
                  id="product-price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="ui:pl-7 ui:font-mono"
                />
              </div>
            </Field>
            <Field label="SKU Prefix Pattern" htmlFor="product-sku">
              <Input
                id="product-sku"
                type="text"
                value={skuPrefix}
                onChange={(e) => setSkuPrefix(e.target.value)}
                className="ui:font-mono"
              />
            </Field>
          </div>
        </Panel>
      </div>

      <div className="sticky top-6 space-y-4 lg:col-span-4">
        <aside className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs divide-y divide-[var(--line)]">
          <div className="flex items-start gap-3.5 p-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--line)] bg-[#F8F7F5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[15px] font-semibold text-[var(--ink)]">
                {name || 'Untitled Product'}
              </h3>
              <p className="font-mono text-[11px] text-[var(--text-muted)]">
                {key || 'NO-KEY'}
              </p>
              <div className="mt-1">
                <StatusBadge
                  role={status === 'ACTIVE' ? 'published' : 'draft'}
                  label={status}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 p-4 text-[12px]">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Configuration Blueprint
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Template</span>
                <span className="font-medium text-[var(--ink)]">
                  {activeTemplate.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Base Price</span>
                <span className="font-mono font-semibold text-[var(--ink)]">
                  ${price}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">
                  Initial Combinations
                </span>
                <span className="font-mono font-medium text-[var(--ink)]">
                  ~{activeTemplate.sampleStates} states
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">3D Geometry</span>
                <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                  {modelAttached === 'none' ? 'None attached' : modelAttached}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 p-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Creation Checklist
            </h4>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckIcon size={14} className="shrink-0 text-emerald-600" />
                <span>Product name &amp; key valid</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckIcon size={14} className="shrink-0 text-emerald-600" />
                <span>Initial option blueprint configured</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckIcon size={14} className="shrink-0 text-emerald-600" />
                <span>Commerce resolution prefix set</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <span className="font-mono text-[11px]">ⓘ</span>
                <span>3D targets ready for Studio handoff</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 p-4">
            <Button
              type="submit"
              size="md"
              disabled={pending}
              className="w-full ui:h-9 ui:bg-[var(--ink)] ui:text-[13px] ui:font-medium ui:text-white ui:hover:bg-black"
            >
              {pending ? 'Creating product…' : 'Create & Open Workspace →'}
            </Button>
            <Button
              as={Link}
              href={`/${projectId}/products`}
              variant="secondary"
              size="sm"
              className="w-full ui:h-8 ui:text-[12px]"
            >
              Cancel
            </Button>
          </div>
        </aside>
      </div>
    </form>
  );
}
