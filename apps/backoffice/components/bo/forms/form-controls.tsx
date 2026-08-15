'use client';

import { useState, useRef, useEffect, type ReactNode, type InputHTMLAttributes } from 'react';
import { cn } from '@repo/ui';
import { CheckIcon, CloseIcon, CopyIcon, HelpCircleIcon, PencilIcon } from '@/components/bo/icons';

/** Canonical Form Field Wrapper with Label, Required mark, Help Tooltip, Helper Text & Inline Validation */
export function FormField({
  label,
  htmlFor,
  required,
  tooltip,
  helperText,
  errorText,
  disabled,
  children,
  className,
}: {
  label: ReactNode;
  htmlFor?: string;
  required?: boolean;
  tooltip?: string;
  helperText?: ReactNode;
  errorText?: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1.5 text-left', disabled && 'opacity-60', className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-1 text-[12px] font-semibold text-[var(--ink)]"
        >
          <span>{label}</span>
          {required ? <span className="text-red-500 font-bold">*</span> : null}
          {tooltip ? (
            <span
              className="text-[var(--text-muted)] hover:text-[var(--ink)] cursor-help"
              title={tooltip}
            >
              <HelpCircleIcon size={13} />
            </span>
          ) : null}
        </label>
      </div>

      <div>{children}</div>

      {errorText ? (
        <p className="text-[11px] font-medium text-red-600 flex items-center gap-1 pt-0.5">
          <span className="font-bold">!</span>
          <span>{errorText}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-[var(--text-muted)] pt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}

/** Text Input with Error, Focus & Read-only states */
export function TextInput({
  hasError,
  readOnly,
  className,
  ref,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}) {
  return (
    <input
      ref={ref}
      readOnly={readOnly}
      className={cn(
        'w-full h-9 rounded-[7px] border bg-[var(--surface-pure)] px-3 text-[13px] text-[var(--ink)] outline-none transition-colors',
        hasError
          ? 'border-[var(--danger)] focus:border-[var(--danger)]'
          : 'border-[var(--line)] focus:border-[var(--brand)]',
        readOnly && 'bg-[var(--canvas)] text-[var(--text-secondary)] cursor-default',
        props.disabled && 'bg-[var(--canvas)] text-[var(--text-muted)] cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}

/** Textarea Input */
export function TextareaInput({
  hasError,
  rows = 3,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
}) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'w-full min-h-[96px] rounded-[7px] border bg-[var(--surface-pure)] px-3 py-2 text-[13px] text-[var(--ink)] outline-none transition-colors',
        hasError
          ? 'border-[var(--danger)] focus:border-[var(--danger)]'
          : 'border-[var(--line)] focus:border-[var(--brand)]',
        props.readOnly && 'bg-[var(--canvas)] text-[var(--text-secondary)]',
        props.disabled && 'bg-[var(--canvas)] text-[var(--text-muted)] cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}

/** Select Dropdown */
export function SelectInput({
  hasError,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
}) {
  return (
    <select
      className={cn(
        'w-full h-9 rounded-[7px] border bg-[var(--surface-pure)] px-3 text-[13px] text-[var(--ink)] outline-none transition-colors cursor-pointer',
        hasError
          ? 'border-[var(--danger)] focus:border-[var(--danger)]'
          : 'border-[var(--line)] focus:border-[var(--brand)]',
        props.disabled && 'bg-[var(--canvas)] text-[var(--text-muted)] cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

/** Switch Toggle */
export function SwitchInput({
  checked,
  onChange,
  disabled,
  label,
  description,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  label?: ReactNode;
  description?: ReactNode;
}) {
  return (
    <label className={cn('flex items-start gap-3 cursor-pointer select-none', disabled && 'opacity-60 cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] mt-0.5',
          checked ? 'bg-[var(--ink)]' : 'bg-[var(--line)]'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </button>
      {label || description ? (
        <div className="min-w-0 flex-1 text-[13px]">
          {label ? <p className="font-semibold text-[var(--ink)] leading-tight">{label}</p> : null}
          {description ? (
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{description}</p>
          ) : null}
        </div>
      ) : null}
    </label>
  );
}

/** Radio Option Card */
export function RadioCard({
  name,
  value,
  checked,
  onChange,
  label,
  description,
  badge,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (val: string) => void;
  label: string;
  description?: string;
  badge?: ReactNode;
}) {
  return (
    <label
      onClick={() => onChange(value)}
      className={cn(
        'flex items-start gap-3 rounded-[7px] border p-3.5 cursor-pointer transition-colors',
        checked
          ? 'border-[var(--brand)] bg-[var(--brand-soft)]/40 ring-1 ring-[var(--brand)]'
          : 'border-[var(--line)] bg-[var(--surface-pure)] hover:bg-[var(--canvas)]/40'
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-0.5 accent-[var(--brand)]"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-[var(--ink)]">{label}</span>
          {badge}
        </div>
        {description ? (
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
            {description}
          </p>
        ) : null}
      </div>
    </label>
  );
}

/** Interactive Inline Editable Field: View -> Edit -> Saving -> Saved -> Error */
export function InlineEditField({
  initialValue,
  label,
  onSave,
}: {
  initialValue: string;
  label: string;
  onSave?: (val: string) => Promise<boolean>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleCommit = async () => {
    if (value === initialValue) {
      setIsEditing(false);
      return;
    }
    setState('saving');
    try {
      if (onSave) await onSave(value);
      setState('saved');
      setIsEditing(false);
      setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('error');
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5">
        <TextInput
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCommit();
            if (e.key === 'Escape') {
              setValue(initialValue);
              setIsEditing(false);
            }
          }}
          className="h-7 text-[12px] py-1"
        />
        <button
          type="button"
          onClick={handleCommit}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[var(--ink)] text-white hover:bg-black text-[11px]"
          title="Save"
        >
          ✓
        </button>
        <button
          type="button"
          onClick={() => {
            setValue(initialValue);
            setIsEditing(false);
          }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[var(--line)] hover:bg-[var(--canvas)] text-[11px]"
          title="Cancel"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="group flex items-center justify-between gap-2 rounded-md p-1 -m-1 hover:bg-[var(--canvas)] cursor-pointer transition-colors"
      title={`Click to edit ${label}`}
    >
      <span className="text-[13px] font-medium text-[var(--ink)]">{value}</span>
      <div className="flex items-center gap-1">
        {state === 'saved' ? (
          <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5">
            <CheckIcon size={12} /> Saved
          </span>
        ) : state === 'saving' ? (
          <span className="text-[11px] text-[var(--text-muted)] animate-pulse">Saving…</span>
        ) : (
          <PencilIcon size={12} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  );
}
