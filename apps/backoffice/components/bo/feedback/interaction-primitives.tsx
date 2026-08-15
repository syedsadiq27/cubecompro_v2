'use client';

import { useState, type ReactNode } from 'react';
import { cn, useToast } from '@repo/ui';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  UploadIcon,
} from '@/components/bo/icons';

/** Detail / Inspector Row with Copyable ID and status indicators */
export function DetailRow({
  label,
  value,
  copyable,
  warning,
  onClick,
  action,
}: {
  label: ReactNode;
  value: ReactNode;
  copyable?: boolean;
  warning?: ReactNode;
  onClick?: () => void;
  action?: ReactNode;
}) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof value === 'string') {
      navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`Copied ${label} to clipboard`);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between py-2 text-[12px] border-b border-[var(--line)]/50 last:border-0',
        onClick && 'cursor-pointer hover:bg-[var(--canvas)]/40 px-1 -mx-1 rounded'
      )}
    >
      <span className="text-[var(--text-muted)] font-normal">{label}</span>
      <div className="flex items-center gap-1.5 font-medium text-[var(--ink)]">
        {warning ? (
          <span className="flex items-center gap-1 text-amber-700 text-[11px] mr-1">
            <span>⚠</span>
            <span>{warning}</span>
          </span>
        ) : null}

        <span className={copyable ? 'font-mono text-[11px]' : ''}>{value}</span>

        {copyable ? (
          <button
            type="button"
            onClick={handleCopy}
            className="text-[var(--text-muted)] hover:text-[var(--ink)] ml-0.5 p-0.5"
            title="Copy to clipboard"
          >
            {copied ? <CheckIcon size={12} className="text-emerald-600" /> : <CopyIcon size={12} />}
          </button>
        ) : null}

        {action}
        {onClick ? <ChevronRightIcon size={13} className="text-[var(--text-muted)]" /> : null}
      </div>
    </div>
  );
}

/** Accordion / Collapsible Row Primitive */
export function AccordionRow({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-3.5 text-left hover:bg-[var(--canvas)]/40 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <ChevronRightIcon
            size={14}
            className={cn('text-[var(--text-muted)] transition-transform duration-200', open && 'rotate-90')}
          />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[var(--ink)] truncate">{title}</p>
            {subtitle ? (
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {badge}
      </button>
      {open ? (
        <div className="p-4 border-t border-[var(--line)] bg-[var(--canvas)]/20 animate-in fade-in duration-150">
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** File Upload States: DragDrop, Queued, Uploading, Processing, Completed, Failed */
export function FileUploadZone({
  status = 'idle',
  progress = 0,
  fileName,
  fileSize,
  errorMessage,
  onUpload,
  onCancel,
}: {
  status?: 'idle' | 'queued' | 'uploading' | 'processing' | 'completed' | 'failed';
  progress?: number;
  fileName?: string;
  fileSize?: string;
  errorMessage?: string;
  onUpload?: (file: File) => void;
  onCancel?: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--canvas)]/30 p-6 text-center">
      {status === 'idle' ? (
        <div className="space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-pure)] border border-[var(--line)] text-[var(--text-muted)]">
            <UploadIcon size={18} />
          </div>
          <p className="text-[13px] font-semibold text-[var(--ink)]">
            Click to upload or drag &amp; drop 3D GLB or textures
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">
            Supports .glb, .gltf, .hdr, .png, .jpg up to 250 MB
          </p>
        </div>
      ) : status === 'uploading' || status === 'processing' ? (
        <div className="space-y-3 max-w-sm mx-auto">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-semibold text-[var(--ink)] truncate">{fileName || 'demo-chair.glb'}</span>
            <span className="font-mono text-[var(--text-muted)]">{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[var(--line)] overflow-hidden">
            <div
              className="h-full bg-[var(--ink)] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            {status === 'uploading' ? 'Uploading geometry chunks…' : 'Generating Draco mesh LODs & AR USDZ…'}
          </p>
        </div>
      ) : status === 'completed' ? (
        <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 text-left">
          <div className="flex items-center gap-2.5">
            <CheckIcon size={16} className="text-emerald-700" />
            <div>
              <p className="text-[12px] font-semibold text-emerald-950">{fileName || 'demo-chair.glb'}</p>
              <p className="text-[11px] text-emerald-800">{fileSize || '24.6 MB · 6 meshes'}</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-emerald-800 uppercase">Ready</span>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-red-50/60 border border-red-200 rounded-lg p-3 text-left">
          <div className="flex items-center gap-2.5">
            <span className="text-red-700 font-bold">!</span>
            <div>
              <p className="text-[12px] font-semibold text-red-950">Upload failed</p>
              <p className="text-[11px] text-red-800">{errorMessage || 'Invalid GLB buffer format.'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[11px] font-medium text-red-900 hover:underline"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

/** Activity / Audit Log Item with Actor, Timestamp, and State Diff snippet */
export function AuditLogItem({
  title,
  actor,
  timestamp,
  diff,
}: {
  title: string;
  actor: string;
  timestamp: string;
  diff?: { before: string; after: string };
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--canvas)]/30 transition-colors">
      <span className="mt-1 h-2 w-2 rounded-full bg-blue-600 shrink-0" />
      <div className="min-w-0 flex-1 space-y-1 text-[12px]">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-[var(--ink)]">{title}</p>
          <span className="text-[11px] text-[var(--text-muted)] font-mono">{timestamp}</span>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)]">by {actor}</p>

        {diff ? (
          <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] bg-[var(--canvas)] p-1.5 rounded border border-[var(--line)]">
            <span className="line-through text-red-700">{diff.before}</span>
            <span className="text-[var(--text-muted)]">&rarr;</span>
            <span className="text-emerald-700 font-semibold">{diff.after}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
