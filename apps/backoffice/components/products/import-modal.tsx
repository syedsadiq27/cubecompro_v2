'use client';

import { useState, type ChangeEvent } from 'react';
import { Button } from '@repo/ui';
import { CloseIcon, UploadIcon } from '@/components/bo/icons';
import type { CatalogProduct } from './products-catalog';

export function ImportModal({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (products: CatalogProduct[]) => void;
}) {
  const [parsedItems, setParsedItems] = useState<CatalogProduct[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          const rawList = Array.isArray(json) ? json : [json];
          const converted: CatalogProduct[] = rawList.map((item, idx) => ({
            id: item.id || `prod_imp_${Date.now()}_${idx}`,
            name: item.name || item.title || 'Imported Product',
            code: item.code || item.key || `IMP-${idx + 1}`,
            statusName: item.statusName || item.status || 'DRAFT',
            imageUrl: item.imageUrl || null,
            categoryNames: Array.isArray(item.categoryNames)
              ? item.categoryNames
              : item.category
                ? [item.category]
                : ['General'],
            brandLabel: item.brandLabel || item.brand || 'CubeCom',
            description: item.description || '',
            createdLabel: 'Just now',
            updatedLabel: 'Just now',
            updatedDate: 'Today',
            updatedTime: 'Just now',
            modelCount: Number(item.modelCount) || 1,
            hasModels: true,
            signals: {
              health: 'mapping_required',
              healthLabel: 'Mapping required',
              needsAttention: true,
              skuCount: Number(item.skuCount) || 1,
              configurationCount: 1,
              mappedCount: 0,
              channel: null,
              channelLabel: '0',
              priceLabel: item.price ? `$${item.price}` : 'No price',
              hasPrice: Boolean(item.price),
              threeDReady: true,
              commerceMapped: false,
            },
          }));
          setParsedItems(converted);
        } else {
          // Parse CSV
          const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
          if (lines.length <= 1) {
            throw new Error('CSV is empty or contains only headers.');
          }
          const headers = lines[0]!.split(',').map((h) => h.trim().toLowerCase());
          const nameIdx = headers.findIndex((h) => h.includes('name') || h.includes('title'));
          const codeIdx = headers.findIndex((h) => h.includes('code') || h.includes('sku') || h.includes('key'));
          const catIdx = headers.findIndex((h) => h.includes('cat'));
          const statusIdx = headers.findIndex((h) => h.includes('status'));

          const converted: CatalogProduct[] = lines.slice(1).map((line, idx) => {
            const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
            const name = (nameIdx !== -1 ? cols[nameIdx] : cols[0]) || `Imported Item ${idx + 1}`;
            const code = (codeIdx !== -1 ? cols[codeIdx] : cols[1]) || `IMP-${idx + 1}`;
            const category = (catIdx !== -1 ? cols[catIdx] : cols[2]) || 'General';
            const status = (statusIdx !== -1 ? cols[statusIdx] : 'DRAFT') || 'DRAFT';

            return {
              id: `prod_csv_${Date.now()}_${idx}`,
              name,
              code,
              statusName: status.toUpperCase(),
              imageUrl: null,
              categoryNames: [category],
              brandLabel: 'CubeCom',
              description: 'Imported from CSV catalog',
              createdLabel: 'Just now',
              updatedLabel: 'Just now',
              updatedDate: 'Today',
              updatedTime: 'Just now',
              modelCount: 1,
              hasModels: true,
              signals: {
                health: 'mapping_required',
                healthLabel: 'Mapping required',
                needsAttention: true,
                skuCount: 1,
                configurationCount: 1,
                mappedCount: 0,
                channel: null,
                channelLabel: '0',
                priceLabel: 'No price',
                hasPrice: false,
                threeDReady: true,
                commerceMapped: false,
              },
            };
          });
          setParsedItems(converted);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid file format.');
        setParsedItems([]);
      }
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = () => {
    if (parsedItems.length === 0) return;
    onImport(parsedItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Dismiss modal"
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#665CFF]/10 text-[#665CFF]">
              <UploadIcon size={18} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[var(--ink)]">Import Products</h2>
              <p className="text-[12px] text-[var(--text-muted)]">Upload a JSON or CSV file to import products</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
          >
            <CloseIcon size={14} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--line)] bg-[var(--canvas)]/30 p-6 text-center cursor-pointer transition-colors hover:border-[#665CFF] hover:bg-[#665CFF]/5">
            <UploadIcon size={28} className="text-[#665CFF]" />
            <span className="mt-2 text-[13px] font-semibold text-[var(--ink)]">
              {fileName ? fileName : 'Choose CSV or JSON file'}
            </span>
            <span className="mt-0.5 text-[11px] text-[var(--text-muted)]">
              Supported formats: .csv, .json (max 5MB)
            </span>
            <input
              type="file"
              accept=".csv,.json"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {error ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-[12px] text-red-700">
              {error}
            </div>
          ) : null}

          {parsedItems.length > 0 ? (
            <div className="rounded-lg border border-[var(--line)] overflow-hidden">
              <div className="bg-[var(--surface)] px-3 py-2 text-[11px] font-semibold text-[var(--text-secondary)] uppercase">
                Preview ({parsedItems.length} products found)
              </div>
              <div className="max-h-40 overflow-y-auto divide-y divide-[var(--line)] text-[12px]">
                {parsedItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-3 py-2">
                    <div>
                      <p className="font-medium text-[var(--ink)]">{item.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{item.code}</p>
                    </div>
                    <span className="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[10px] font-semibold">
                      {item.statusName}
                    </span>
                  </div>
                ))}
                {parsedItems.length > 5 ? (
                  <div className="px-3 py-1.5 text-center text-[11px] text-[var(--text-muted)] italic">
                    +{parsedItems.length - 5} more items
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-[var(--line)] pt-4">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={parsedItems.length === 0}
            onClick={handleImportSubmit}
            className="ui:bg-[#665CFF] ui:text-white ui:hover:bg-[#5247E6]"
          >
            Import {parsedItems.length > 0 ? `(${parsedItems.length})` : ''}
          </Button>
        </div>
      </div>
    </div>
  );
}
