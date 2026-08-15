'use client';

import type { ReactNode } from 'react';
import { Button } from './button';
import { cn } from '../lib/cn';

export function ConfirmDialog({
  open,
  title,
  description,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  danger,
  isPending = false,
  pending,
  onConfirm,
  onClose,
  onCancel,
  dismissOnBackdrop = true,
  children,
  className,
}: {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  body?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  danger?: boolean;
  isPending?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onClose?: () => void;
  onCancel?: () => void;
  dismissOnBackdrop?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  if (!open) return null;

  const close = onClose ?? onCancel ?? (() => undefined);
  const destructive = isDestructive || Boolean(danger);
  const waiting = isPending || Boolean(pending);
  const copy = description ?? body;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150 select-none">
      {dismissOnBackdrop ? (
        <button
          type="button"
          aria-label="Dismiss"
          className="absolute inset-0 cursor-default"
          onClick={close}
        />
      ) : null}
      <div
        role="alertdialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] p-6 shadow-2xl space-y-4',
          className
        )}
      >
        <div className="space-y-1.5">
          <h3 className="text-[16px] font-bold text-[var(--ink)] leading-tight">
            {title}
          </h3>
          {copy ? (
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
              {copy}
            </p>
          ) : null}
        </div>

        {children ? <div className="py-2">{children}</div> : null}

        <div className="flex items-center justify-end gap-2.5 border-t border-[var(--line)] pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={waiting}
            onClick={close}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? 'danger' : 'primary'}
            size="sm"
            disabled={waiting}
            onClick={onConfirm}
          >
            {waiting ? '…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
