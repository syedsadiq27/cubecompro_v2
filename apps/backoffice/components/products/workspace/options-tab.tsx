'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  ConfirmDialog,
  DataTable,
  Field,
  Input,
  Select,
  useToast,
} from '@repo/ui';
import {
  ChevronRightIcon,
  CloseIcon,
  DragHandleIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
} from '@/components/bo/icons';
import { RowActionMenu } from '@/components/bo';
import {
  type GraphDetail,
  type MaterialAssetOption,
  useLiveProductData,
} from '@/lib/product-workspace';

type OptionValueItem = {
  id: string;
  key: string;
  label: string;
  colorHex?: string;
  status: string;
};

type OptionItem = {
  id: string;
  key: string;
  name: string;
  type: string;
  required: boolean;
  valuesSummary: string;
  valueCount: number;
  updatedDate: string;
  updatedTime: string;
  thumbnailType: 'color' | 'size' | 'wood' | 'leather';
  values: OptionValueItem[];
};

const DEFAULT_OPTIONS: OptionItem[] = [
  {
    id: 'opt_color',
    key: 'color',
    name: 'Color',
    type: 'Color',
    required: true,
    valuesSummary: 'Black, White',
    valueCount: 2,
    updatedDate: 'May 14, 2025',
    updatedTime: '10:24 AM',
    thumbnailType: 'color',
    values: [
      { id: 'val_black', key: 'BLACK', label: 'Black', colorHex: '#000000', status: 'Active' },
      { id: 'val_white', key: 'WHITE', label: 'White', colorHex: '#FFFFFF', status: 'Active' },
    ],
  },
  {
    id: 'opt_size',
    key: 'size',
    name: 'Size',
    type: 'Size',
    required: true,
    valuesSummary: 'L, XL',
    valueCount: 2,
    updatedDate: 'May 14, 2025',
    updatedTime: '10:24 AM',
    thumbnailType: 'size',
    values: [
      { id: 'val_l', key: 'L', label: 'L', status: 'Active' },
      { id: 'val_xl', key: 'XL', label: 'XL', status: 'Active' },
    ],
  },
  {
    id: 'opt_frame',
    key: 'frame',
    name: 'Frame',
    type: 'Material',
    required: true,
    valuesSummary: 'Walnut, Oak',
    valueCount: 2,
    updatedDate: 'May 14, 2025',
    updatedTime: '10:24 AM',
    thumbnailType: 'wood',
    values: [
      { id: 'val_walnut', key: 'WALNUT', label: 'Walnut', colorHex: '#5C3A21', status: 'Active' },
      { id: 'val_oak', key: 'OAK', label: 'Oak', colorHex: '#C29B62', status: 'Active' },
    ],
  },
  {
    id: 'opt_material',
    key: 'material',
    name: 'Material',
    type: 'Material',
    required: false,
    valuesSummary: 'Leather',
    valueCount: 1,
    updatedDate: 'May 14, 2025',
    updatedTime: '10:24 AM',
    thumbnailType: 'leather',
    values: [
      { id: 'val_leather', key: 'LEATHER', label: 'Leather', colorHex: '#8A5D3B', status: 'Active' },
    ],
  },
];

function optionsFromDetail(detail: GraphDetail | null): OptionItem[] {
  if (!detail?.choices.length) return [];
  return detail.choices.map((choice) => ({
    id: choice.id,
    key: choice.key,
    name: choice.name,
    type: choice.type || 'Choice',
    required: choice.required,
    valuesSummary: choice.values.map((value) => value.name).join(', '),
    valueCount: choice.values.length,
    updatedDate: '',
    updatedTime: '',
    thumbnailType: 'size' as const,
    values: choice.values.map((value) => ({
      id: value.id,
      key: value.key,
      label: value.name,
      status: 'Active',
    })),
  }));
}

export function OptionsTab({
  projectId,
  productId,
  detail,
  editable,
  materialAssets = [],
  shopifyCommerce,
}: {
  projectId: string;
  productId: string;
  detail: GraphDetail | null;
  editable: boolean;
  materialAssets?: MaterialAssetOption[];
  shopifyCommerce?: unknown;
}) {
  const toast = useToast();
  const live = useLiveProductData(detail, shopifyCommerce);
  const liveOptions = optionsFromDetail(detail);
  const seed = live && liveOptions.length > 0 ? liveOptions : DEFAULT_OPTIONS;
  const [options, setOptions] = useState<OptionItem[]>(seed);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    seed[0]?.id ?? null
  );

  useEffect(() => {
    const next = live && liveOptions.length > 0 ? liveOptions : DEFAULT_OPTIONS;
    setOptions(next);
    setSelectedOptionId((current) =>
      next.some((option) => option.id === current) ? current : (next[0]?.id ?? null)
    );
  }, [live, detail?.id, detail?.choices.length]);

  // Dialog states
  const [addOptionOpen, setAddOptionOpen] = useState(false);
  const [editOptionTarget, setEditOptionTarget] = useState<OptionItem | null>(null);
  const [addValueOptionId, setAddValueOptionId] = useState<string | null>(null);
  const [editValueTarget, setEditValueTarget] = useState<{
    optionId: string;
    value: OptionValueItem;
  } | null>(null);

  // Form input states for Add Option
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionKey, setNewOptionKey] = useState('');
  const [newOptionType, setNewOptionType] = useState('Color');
  const [newOptionRequired, setNewOptionRequired] = useState(true);

  // Form input states for Edit Option
  const [editName, setEditName] = useState('');
  const [editKey, setEditKey] = useState('');
  const [editRequired, setEditRequired] = useState(true);

  // Form input states for Add Value
  const [newValueLabel, setNewValueLabel] = useState('');
  const [newValueKey, setNewValueKey] = useState('');
  const [newValueColor, setNewValueColor] = useState('#4A5568');

  // Confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    body: string;
    onConfirm: () => void;
  }>({ open: false, title: '', body: '', onConfirm: () => {} });

  const selectedOption = options.find((o) => o.id === selectedOptionId) ?? null;

  // Handle Add Option Submit
  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionName.trim()) return;

    const optKey = newOptionKey.trim() || newOptionName.toLowerCase().replace(/\s+/g, '_');
    const newOpt: OptionItem = {
      id: `opt_${Date.now()}`,
      name: newOptionName.trim(),
      key: optKey,
      type: newOptionType,
      required: newOptionRequired,
      valuesSummary: 'None yet',
      valueCount: 0,
      updatedDate: 'Just now',
      updatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      thumbnailType: newOptionType.toLowerCase() === 'color' ? 'color' : 'size',
      values: [],
    };

    setOptions((prev) => [...prev, newOpt]);
    setSelectedOptionId(newOpt.id);
    setAddOptionOpen(false);
    setNewOptionName('');
    setNewOptionKey('');
    toast.success(`Option “${newOpt.name}” created`);
  };

  // Handle Edit Option Submit
  const handleEditOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOptionTarget) return;

    setOptions((prev) =>
      prev.map((o) =>
        o.id === editOptionTarget.id
          ? {
              ...o,
              name: editName.trim() || o.name,
              key: editKey.trim() || o.key,
              required: editRequired,
              updatedDate: 'Just now',
              updatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : o
      )
    );
    setEditOptionTarget(null);
    toast.success('Option updated');
  };

  // Handle Add Value Submit
  const handleAddValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addValueOptionId || !newValueLabel.trim()) return;

    const valKey = newValueKey.trim() || newValueLabel.toUpperCase().replace(/\s+/g, '_');
    const newVal: OptionValueItem = {
      id: `val_${Date.now()}`,
      label: newValueLabel.trim(),
      key: valKey,
      colorHex: newValueColor,
      status: 'Active',
    };

    setOptions((prev) =>
      prev.map((o) => {
        if (o.id === addValueOptionId) {
          const nextVals = [...o.values, newVal];
          return {
            ...o,
            values: nextVals,
            valueCount: nextVals.length,
            valuesSummary: nextVals.map((v) => v.label).join(', '),
            updatedDate: 'Just now',
            updatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return o;
      })
    );

    setAddValueOptionId(null);
    setNewValueLabel('');
    setNewValueKey('');
    toast.success(`Value “${newVal.label}” added`);
  };

  // Handle Duplicate Option
  const handleDuplicateOption = (opt: OptionItem) => {
    const dup: OptionItem = {
      ...opt,
      id: `opt_${Date.now()}`,
      name: `${opt.name} (Copy)`,
      key: `${opt.key}_copy`,
      updatedDate: 'Just now',
      updatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      values: opt.values.map((v) => ({ ...v, id: `val_${Date.now()}_${v.key}` })),
    };
    setOptions((prev) => [...prev, dup]);
    setSelectedOptionId(dup.id);
    toast.success(`Duplicated “${opt.name}”`);
  };

  // Handle Delete Option
  const handleDeleteOption = (opt: OptionItem) => {
    setConfirmDialog({
      open: true,
      title: `Delete option “${opt.name}”?`,
      body: `This removes the “${opt.name}” option and its ${opt.valueCount} values from this product configuration.`,
      onConfirm: () => {
        setOptions((prev) => prev.filter((o) => o.id !== opt.id));
        if (selectedOptionId === opt.id) {
          setSelectedOptionId(null);
        }
        setConfirmDialog((d) => ({ ...d, open: false }));
        toast.success(`Deleted “${opt.name}”`);
      },
    });
  };

  // Handle Delete Value
  const handleDeleteValue = (optionId: string, valueId: string, valLabel: string) => {
    setOptions((prev) =>
      prev.map((o) => {
        if (o.id === optionId) {
          const nextVals = o.values.filter((v) => v.id !== valueId);
          return {
            ...o,
            values: nextVals,
            valueCount: nextVals.length,
            valuesSummary: nextVals.length > 0 ? nextVals.map((v) => v.label).join(', ') : 'None',
          };
        }
        return o;
      })
    );
    toast.success(`Removed “${valLabel}”`);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
      {/* Left Main Options Table Area (~8 cols) */}
      <div className="space-y-4 lg:col-span-8">
        {/* Table Container Card */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[var(--line)]">
            <div>
              <h2 className="text-[15px] font-semibold text-[var(--ink)]">Options</h2>
              <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
                What shoppers can choose. Values drive 3D look and commerce identity.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => setAddOptionOpen(true)}
              className="ui:flex ui:items-center ui:gap-1.5 ui:h-8 ui:px-3 ui:rounded-lg ui:bg-[var(--ink)] ui:hover:bg-black ui:text-white ui:text-[12px] ui:font-medium ui:shadow-xs"
            >
              <PlusIcon size={14} />
              <span>Add option</span>
            </Button>
          </div>

          <DataTable variant="fill" minWidth={720}>
            <DataTable.Header className="bg-[var(--canvas)]/40 font-sans text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              <tr>
                <DataTable.HeaderCell className="w-8 pl-4 pr-1" />
                <DataTable.HeaderCell>Name</DataTable.HeaderCell>
                <DataTable.HeaderCell>Required</DataTable.HeaderCell>
                <DataTable.HeaderCell>Values</DataTable.HeaderCell>
                <DataTable.HeaderCell>Updated</DataTable.HeaderCell>
                <DataTable.HeaderCell align="right" className="pr-4 pl-2">
                  Actions
                </DataTable.HeaderCell>
              </tr>
            </DataTable.Header>
            <DataTable.Body>
              {options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <DataTable.Row
                    key={opt.id}
                    selected={isSelected}
                    onClick={() => setSelectedOptionId(opt.id)}
                  >
                    <DataTable.Cell className="w-8 pl-4 pr-1 text-center text-[var(--text-muted)] cursor-grab">
                      <DragHandleIcon size={14} />
                    </DataTable.Cell>

                    <DataTable.IdentityCell
                      title={opt.name}
                      subtitle={opt.key}
                      icon={
                        opt.thumbnailType === 'color' ? (
                          <span className="h-full w-full bg-black" />
                        ) : opt.thumbnailType === 'wood' ? (
                          <span className="h-full w-full bg-[#5C3A21]" />
                        ) : opt.thumbnailType === 'leather' ? (
                          <span className="h-full w-full bg-[#8A5D3B]" />
                        ) : (
                          <span className="text-[10px] font-mono font-medium text-[var(--text-muted)]">
                            L,XL
                          </span>
                        )
                      }
                    />

                    <DataTable.Cell className="text-[12px]">
                      {opt.required ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                          <span className="text-[13px]">✓</span> Required
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)]">— Optional</span>
                      )}
                    </DataTable.Cell>

                    <DataTable.Cell>
                      <div className="flex items-center gap-2">
                        {opt.thumbnailType === 'color' ? (
                          <div className="flex items-center gap-1">
                            <span className="h-3 w-3 rounded-full bg-black border border-black/20" />
                            <span className="h-3 w-3 rounded-full bg-white border border-gray-300" />
                          </div>
                        ) : null}
                        <span className="text-[12px] text-[var(--text-secondary)]">
                          {opt.valuesSummary}
                        </span>
                        <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)]">
                          {opt.valueCount} {opt.valueCount === 1 ? 'value' : 'values'}
                        </span>
                      </div>
                    </DataTable.Cell>

                    <DataTable.DateCell
                      date={opt.updatedDate}
                      time={opt.updatedTime}
                    />

                    <DataTable.ActionsCell className="pr-4 pl-2">
                      <RowActionMenu
                        label={`Actions for ${opt.name}`}
                        items={[
                          {
                            id: 'inspect',
                            label: isSelected ? 'Close inspector' : 'Inspect option',
                            onClick: () =>
                              setSelectedOptionId((curr) => (curr === opt.id ? null : opt.id)),
                          },
                          {
                            id: 'edit',
                            label: 'Edit option details',
                            onClick: () => {
                              setEditOptionTarget(opt);
                              setEditName(opt.name);
                              setEditKey(opt.key);
                              setEditRequired(opt.required);
                            },
                          },
                          {
                            id: 'add-val',
                            label: 'Add value choice',
                            onClick: () => setAddValueOptionId(opt.id),
                          },
                          {
                            id: 'duplicate',
                            label: 'Duplicate option',
                            onClick: () => handleDuplicateOption(opt),
                          },
                          {
                            id: 'delete',
                            label: 'Delete option',
                            danger: true,
                            separatorBefore: true,
                            onClick: () => handleDeleteOption(opt),
                          },
                        ]}
                      />
                    </DataTable.ActionsCell>
                  </DataTable.Row>
                );
              })}
            </DataTable.Body>
          </DataTable>
        </div>

        {/* Bottom Callout Info Banner */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--canvas)]/40 px-4 py-3 text-[12px] text-[var(--text-secondary)] flex items-center gap-2">
          <span className="text-[13px] text-[var(--text-muted)]">ⓘ</span>
          <span>Options determine the configurable variations of this product.</span>
        </div>
      </div>

      {/* Right Option Inspector Drawer (~4 cols / 340px) */}
      <div className="lg:col-span-4">
        {selectedOption ? (
          <aside className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden divide-y divide-[var(--line)]">
            {/* Drawer Header */}
            <div className="p-4 flex items-start gap-3.5">
              <div className="h-12 w-12 shrink-0 rounded-lg border border-[var(--line)] bg-black overflow-hidden flex items-center justify-center">
                {selectedOption.thumbnailType === 'wood' ? (
                  <div className="h-full w-full bg-[#5C3A21]" />
                ) : selectedOption.thumbnailType === 'leather' ? (
                  <div className="h-full w-full bg-[#8A5D3B]" />
                ) : selectedOption.thumbnailType === 'size' ? (
                  <span className="text-[11px] font-mono text-white font-semibold">L,XL</span>
                ) : (
                  <div className="h-full w-full bg-black" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1.5">
                  <h3 className="truncate text-[15px] font-semibold text-[var(--ink)]">
                    {selectedOption.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedOptionId(null)}
                    aria-label="Close option inspector"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
                  >
                    <CloseIcon size={14} />
                  </button>
                </div>
                <p className="text-[11px] font-mono text-[var(--text-muted)]">
                  Option ID: {selectedOption.id}
                </p>
              </div>
            </div>

            {/* Status & Edit Actions */}
            <div className="p-4 flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800 border border-emerald-200/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span>{selectedOption.required ? 'Required' : 'Optional'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="ui:h-8 ui:text-[12px] ui:font-medium"
                  onClick={() => {
                    setEditOptionTarget(selectedOption);
                    setEditName(selectedOption.name);
                    setEditKey(selectedOption.key);
                    setEditRequired(selectedOption.required);
                  }}
                >
                  <PencilIcon size={13} className="mr-1 inline" />
                  <span>Edit option</span>
                </Button>
                <button
                  type="button"
                  aria-label="More"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] text-[var(--ink)] hover:bg-[var(--canvas)]"
                  onClick={() => handleDuplicateOption(selectedOption)}
                >
                  <MoreHorizontalIcon size={15} />
                </button>
              </div>
            </div>

            {/* Summary Section */}
            <div className="p-4 space-y-2 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Summary
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Type</span>
                  <span className="font-medium text-[var(--ink)]">{selectedOption.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Values</span>
                  <span className="font-mono font-medium text-[var(--ink)]">{selectedOption.valueCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Used in</span>
                  <span className="font-medium text-[var(--ink)]">4 variants</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Updated</span>
                  <span className="text-right text-[var(--text-secondary)]">
                    {selectedOption.updatedDate} {selectedOption.updatedTime}
                    <br />
                    <span className="text-[11px] text-[var(--text-muted)]">by Demo Owner</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                  Values
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddValueOptionId(selectedOption.id)}
                  className="ui:h-auto ui:px-0 ui:text-[11px] ui:font-medium ui:text-[#665CFF] ui:hover:bg-transparent ui:hover:underline"
                >
                  + Add value
                </Button>
              </div>

              <div className="space-y-2">
                {selectedOption.values.length === 0 ? (
                  <p className="text-[12px] text-[var(--text-muted)] italic py-2">
                    No values added yet. Click &ldquo;+ Add value&rdquo; above.
                  </p>
                ) : (
                  selectedOption.values.map((val) => (
                    <div
                      key={val.id}
                      className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2 hover:bg-[var(--canvas)]/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[var(--text-muted)] cursor-grab">
                          <DragHandleIcon size={12} />
                        </span>
                        {val.colorHex ? (
                          <span
                            className="h-4 w-4 rounded border border-black/20 shrink-0"
                            style={{ backgroundColor: val.colorHex }}
                          />
                        ) : null}
                        <div>
                          <p className="text-[12px] font-medium text-[var(--ink)]">{val.label}</p>
                          <p className="text-[10px] font-mono text-[var(--text-muted)]">{val.key}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200/60">
                          {val.status}
                        </span>
                        <RowActionMenu
                          label={`Actions for ${val.label}`}
                          items={[
                            {
                              id: 'remove',
                              label: 'Delete value',
                              danger: true,
                              onClick: () =>
                                handleDeleteValue(selectedOption.id, val.id, val.label),
                            },
                          ]}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Usage Section */}
            <div className="p-4 space-y-2 text-[12px]">
              <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Usage
              </h4>
              <div className="space-y-1">
                <div
                  className="flex items-center justify-between py-1 text-[var(--ink)] hover:text-[#665CFF] cursor-pointer group"
                  onClick={() => toast.info('Navigating to linked variants')}
                >
                  <span className="text-[var(--text-secondary)]">Variants</span>
                  <span className="flex items-center gap-1 font-mono font-medium group-hover:underline">
                    4
                    <ChevronRightIcon size={12} className="text-[var(--text-muted)]" />
                  </span>
                </div>
                <div
                  className="flex items-center justify-between py-1 text-[var(--ink)] hover:text-[#665CFF] cursor-pointer group"
                  onClick={() => toast.info('Navigating to commerce channels')}
                >
                  <span className="text-[var(--text-secondary)]">Commerce channels</span>
                  <span className="flex items-center gap-1 font-mono font-medium group-hover:underline">
                    1
                    <ChevronRightIcon size={12} className="text-[var(--text-muted)]" />
                  </span>
                </div>
                <div
                  className="flex items-center justify-between py-1 text-[var(--ink)] hover:text-[#665CFF] cursor-pointer group"
                  onClick={() => toast.info('Navigating to 3D appearances')}
                >
                  <span className="text-[var(--text-secondary)]">3D appearances</span>
                  <span className="flex items-center gap-1 font-mono font-medium group-hover:underline">
                    2
                    <ChevronRightIcon size={12} className="text-[var(--text-muted)]" />
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                  Activity
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ui:h-auto ui:px-0 ui:text-[11px] ui:font-medium ui:text-[#665CFF] ui:hover:bg-transparent ui:hover:underline"
                  onClick={() => toast.info('Viewing full activity')}
                >
                  View all
                </Button>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <div className="text-[11px]">
                    <p className="font-medium text-[var(--ink)]">Option updated</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      May 14, 2025 10:24 AM by Demo Owner
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                  <div className="text-[11px]">
                    <p className="font-medium text-[var(--ink)]">Value &quot;White&quot; added</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Apr 28, 2025 9:11 AM by Demo Owner
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>

      {/* Add Option Modal */}
      {addOptionOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--ink)]">New Option</h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                  Add a configurable customer option to this product.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddOptionOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--ink)]"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleAddOption} className="mt-4 space-y-3.5">
              <Field label="Option Name" htmlFor="new-option-name">
                <Input
                  id="new-option-name"
                  type="text"
                  required
                  placeholder="e.g. Fabric Grade"
                  value={newOptionName}
                  onChange={(e) => {
                    setNewOptionName(e.target.value);
                    if (!newOptionKey) {
                      setNewOptionKey(e.target.value.toLowerCase().replace(/\s+/g, '_'));
                    }
                  }}
                />
              </Field>

              <Field label="Option Key / ID" htmlFor="new-option-key">
                <Input
                  id="new-option-key"
                  type="text"
                  placeholder="e.g. fabric_grade"
                  value={newOptionKey}
                  onChange={(e) => setNewOptionKey(e.target.value)}
                  className="ui:font-mono ui:text-[12px]"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Type" htmlFor="new-option-type">
                  <Select
                    id="new-option-type"
                    value={newOptionType}
                    onChange={(e) => setNewOptionType(e.target.value)}
                  >
                    <option value="Color">Color</option>
                    <option value="Size">Size</option>
                    <option value="Material">Material</option>
                    <option value="Choice">Choice</option>
                  </Select>
                </Field>

                <div className="flex items-center pt-6">
                  <Checkbox
                    id="new-option-required"
                    label="Required option"
                    checked={newOptionRequired}
                    onChange={(e) => setNewOptionRequired(e.target.checked)}
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setAddOptionOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
                >
                  Create option
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Edit Option Modal */}
      {editOptionTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--ink)]">Edit Option</h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                  Update configuration option parameters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditOptionTarget(null)}
                className="text-[var(--text-muted)] hover:text-[var(--ink)]"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleEditOption} className="mt-4 space-y-3.5">
              <Field label="Name" htmlFor="edit-option-name">
                <Input
                  id="edit-option-name"
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </Field>

              <Field label="Key" htmlFor="edit-option-key">
                <Input
                  id="edit-option-key"
                  type="text"
                  value={editKey}
                  onChange={(e) => setEditKey(e.target.value)}
                  className="ui:font-mono ui:text-[12px]"
                />
              </Field>

              <div className="flex items-center pt-2">
                <Checkbox
                  id="edit-option-required"
                  label="Required choice for shopper"
                  checked={editRequired}
                  onChange={(e) => setEditRequired(e.target.checked)}
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditOptionTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
                >
                  Save changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Add Value Modal */}
      {addValueOptionId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--ink)]">Add Value Choice</h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                  Add a choice value to this option.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddValueOptionId(null)}
                className="text-[var(--text-muted)] hover:text-[var(--ink)]"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleAddValue} className="mt-4 space-y-3.5">
              <Field label="Value Label" htmlFor="new-value-label">
                <Input
                  id="new-value-label"
                  type="text"
                  required
                  placeholder="e.g. Navy Blue"
                  value={newValueLabel}
                  onChange={(e) => {
                    setNewValueLabel(e.target.value);
                    if (!newValueKey) {
                      setNewValueKey(e.target.value.toUpperCase().replace(/\s+/g, '_'));
                    }
                  }}
                />
              </Field>

              <Field label="Value Key" htmlFor="new-value-key">
                <Input
                  id="new-value-key"
                  type="text"
                  placeholder="e.g. NAVY_BLUE"
                  value={newValueKey}
                  onChange={(e) => setNewValueKey(e.target.value)}
                  className="ui:font-mono ui:text-[12px]"
                />
              </Field>

              <Field label="Swatch Color (Optional)" htmlFor="new-value-color">
                <div className="flex items-center gap-2">
                  <Input
                    id="new-value-color"
                    type="color"
                    value={newValueColor}
                    onChange={(e) => setNewValueColor(e.target.value)}
                    className="ui:h-8 ui:w-10 ui:cursor-pointer ui:p-0"
                  />
                  <Input
                    type="text"
                    value={newValueColor}
                    onChange={(e) => setNewValueColor(e.target.value)}
                    className="ui:flex-1 ui:font-mono ui:text-[12px]"
                  />
                </div>
              </Field>

              <div className="mt-5 flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setAddValueOptionId(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black"
                >
                  Add value
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        body={confirmDialog.body}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((d) => ({ ...d, open: false }))}
      />
    </div>
  );
}
