'use client';

import {
  type HTMLAttributes,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import Link from 'next/link';
import { cn } from '../lib/cn';

function SortGlyph({
  sorted,
}: {
  sorted?: 'asc' | 'desc';
}) {
  if (sorted) {
    return (
      <span
        aria-hidden
        className={cn(
          'text-[10px] text-[#665CFF] transition-transform duration-150',
          sorted === 'asc' && 'rotate-180 inline-block'
        )}
      >
        ↓
      </span>
    );
  }
  return (
    <span aria-hidden className="text-[10px] text-[var(--text-muted)] opacity-40">
      ↕
    </span>
  );
}

export function Table({
  children,
  className,
  footer,
  minWidth = 640,
  variant = 'panel',
}: {
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  minWidth?: number;
  variant?: 'panel' | 'fill';
}) {
  if (variant === 'fill') {
    return (
      <div
        className={cn(
          'flex min-h-0 min-w-0 w-full flex-1 flex-col bg-[var(--surface-pure)]',
          className
        )}
      >
        <div className="min-h-0 min-w-0 flex-1 overflow-auto">
          <table
            className="w-full min-w-full border-collapse text-left text-[13px]"
            style={{ minWidth }}
          >
            {children}
          </table>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface-pure)]',
        className
      )}
    >
      <table
        className="w-full text-left text-[12px] sm:text-[13px]"
        style={{ minWidth }}
      >
        {children}
      </table>
      {footer}
    </div>
  );
}

export function TableHeader({
  className,
  children,
  sticky = false,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & { sticky?: boolean }) {
  return (
    <thead
      className={cn(
        'border-b border-[var(--line)] bg-[var(--surface-pure)] font-mono text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider',
        sticky && 'sticky top-0 z-[1] bg-[#FAFAF9] text-[12px] font-semibold normal-case tracking-normal text-[var(--text-secondary)] font-sans',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn(
        'divide-y divide-[var(--line)] text-[var(--text-secondary)]',
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({
  className,
  children,
  selected,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }) {
  return (
    <tr
      className={cn(
        'transition-colors duration-100 border-b border-[var(--line)]/60',
        props.onClick && 'cursor-pointer',
        selected
          ? 'bg-[var(--canvas)]/60 font-medium shadow-[inset_2px_0_0_0_#665CFF]'
          : 'bg-[var(--surface-pure)] hover:bg-[var(--canvas)]/40',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  className,
  children,
  align = 'left',
  sortable,
  sorted,
  onSort,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & {
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  sorted?: 'asc' | 'desc';
  onSort?: () => void;
}) {
  return (
    <th
      className={cn(
        'h-10 px-4 text-left font-medium align-middle',
        sortable && 'cursor-pointer select-none hover:text-[var(--ink)]',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div
        className={cn(
          'inline-flex items-center gap-1.5',
          align === 'right' && 'w-full justify-end'
        )}
      >
        <span>{children}</span>
        {sortable ? <SortGlyph sorted={sorted} /> : null}
      </div>
    </th>
  );
}

export function TableCell({
  className,
  children,
  numeric,
  muted,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & {
  numeric?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      className={cn(
        'h-14 px-4 align-middle text-[12px] sm:text-[13px]',
        numeric && 'tabular-nums text-[var(--text-secondary)] font-mono',
        muted ? 'text-[var(--text-muted)]' : !numeric && 'text-[var(--ink)]',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

export function TableHeaderCheckboxCell({
  checked,
  indeterminate,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <th className="w-14 pl-6 pr-2 text-left align-middle">
      <input
        type="checkbox"
        checked={checked}
        aria-label={ariaLabel}
        ref={(node) => {
          if (node) node.indeterminate = Boolean(indeterminate);
        }}
        onChange={(event) => onChange(event.target.checked)}
        onClick={(event) => event.stopPropagation()}
        className="h-4 w-4 cursor-pointer rounded border-[var(--line)] accent-[var(--ink)]"
      />
    </th>
  );
}

export function TableCheckboxCell({
  checked,
  indeterminate,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <td className="w-14 pl-6 pr-2 align-middle">
      <input
        type="checkbox"
        checked={checked}
        aria-label={ariaLabel}
        ref={(node) => {
          if (node) node.indeterminate = Boolean(indeterminate);
        }}
        onChange={(event) => onChange(event.target.checked)}
        onClick={(event) => event.stopPropagation()}
        className="h-4 w-4 cursor-pointer rounded border-[var(--line)] accent-[var(--ink)]"
      />
    </td>
  );
}

export function TableIdentityCell({
  title,
  subtitle,
  href,
  thumbnailUrl,
  thumbnailAlt = '',
  icon,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  thumbnailUrl?: string | null;
  thumbnailAlt?: string;
  icon?: ReactNode;
}) {
  const name = href ? (
    <Link
      href={href}
      className="font-medium text-[var(--ink)] hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {title}
    </Link>
  ) : (
    <span className="font-medium text-[var(--ink)]">{title}</span>
  );

  return (
    <TableCell>
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--canvas)]">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={thumbnailAlt}
              className="h-full w-full object-cover"
            />
          ) : icon ? (
            <span className="text-[var(--text-secondary)]">{icon}</span>
          ) : (
            <span className="text-[10px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              —
            </span>
          )}
        </span>
        <div className="min-w-0">
          <div className="text-[13px] font-medium leading-snug text-[var(--ink)]">
            {name}
          </div>
          {subtitle != null && subtitle !== '' ? (
            <div className="truncate text-[11px] font-normal text-[var(--text-muted)]">
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    </TableCell>
  );
}

export function TableDateCell({
  date,
  time,
}: {
  date: ReactNode;
  time?: ReactNode;
}) {
  return (
    <TableCell className="text-[11px]">
      <div className="font-medium leading-snug text-[var(--ink)]">{date}</div>
      {time ? (
        <div className="font-mono text-[10px] text-[var(--text-muted)]">{time}</div>
      ) : null}
    </TableCell>
  );
}

export function TableActionsCell({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <TableCell className={cn('pl-2 pr-6 text-right', className)}>
      <div
        className="inline-flex items-center justify-end gap-1.5"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </TableCell>
  );
}

export function TableFooter({
  totalItems,
  rangeStart,
  rangeEnd,
  currentPage = 1,
  pageCount = 1,
  pageSize = 25,
  pageSizeOptions,
  onPrevious,
  onNext,
  onPageChange,
  onPageSizeChange,
  itemLabel = 'items',
  children,
}: {
  totalItems?: number;
  rangeStart?: number;
  rangeEnd?: number;
  currentPage?: number;
  pageCount?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPrevious?: () => void;
  onNext?: () => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  itemLabel?: string;
  children?: ReactNode;
}) {
  if (children) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-6 py-3 text-[12px] text-[var(--text-muted)]">
        {children}
      </div>
    );
  }

  const calculatedTotal = totalItems ?? 0;
  const start =
    rangeStart ??
    (calculatedTotal === 0 ? 0 : (currentPage - 1) * pageSize + 1);
  const end = rangeEnd ?? Math.min(currentPage * pageSize, calculatedTotal);
  const totalPages = Math.max(
    1,
    pageCount || Math.ceil(calculatedTotal / pageSize) || 1
  );

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else if (page > currentPage && onNext) {
      onNext();
    } else if (page < currentPage && onPrevious) {
      onPrevious();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-6 py-3 text-[12px] text-[var(--text-muted)]">
      <div className="flex items-center gap-4">
        <span>
          Showing{' '}
          <span className="font-medium text-[var(--ink)]">{start}</span> to{' '}
          <span className="font-medium text-[var(--ink)]">{end}</span> of{' '}
          <span className="font-medium text-[var(--ink)]">{calculatedTotal}</span>{' '}
          {itemLabel}
        </span>

        {pageSizeOptions && onPageSizeChange ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--text-muted)]">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-7 rounded border border-[var(--line)] bg-[var(--surface-pure)] px-2 text-[11px] font-medium text-[var(--ink)] outline-none focus:border-[var(--ink)]"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
          aria-label="Previous page"
          className="mr-1 flex h-7 items-center gap-1 rounded border border-[var(--line)] px-2 text-[12px] text-[var(--text-muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)] disabled:pointer-events-none disabled:opacity-35"
        >
          <span aria-hidden>‹</span>
          <span className="hidden sm:inline">Prev</span>
        </button>

        <span className="flex h-7 min-w-7 items-center justify-center rounded border border-[var(--ink)] bg-[var(--ink)] px-2 font-mono text-[12px] font-semibold text-white shadow-2xs">
          {currentPage}
        </span>
        {totalPages > 1 ? (
          <span className="px-1 font-mono text-[12px] text-[var(--text-muted)]">
            of {totalPages}
          </span>
        ) : null}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          aria-label="Next page"
          className="ml-1 flex h-7 items-center gap-1 rounded border border-[var(--line)] px-2 text-[12px] text-[var(--text-muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)] disabled:pointer-events-none disabled:opacity-35"
        >
          <span className="hidden sm:inline">Next</span>
          <span aria-hidden>›</span>
        </button>
      </div>
    </div>
  );
}

function FillHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <TableHeader sticky className={className} {...props}>
      {children}
    </TableHeader>
  );
}

export const DataTableRoot = Table;
export const DataTableHeader = TableHeader;
export const DataTableFillHeader = FillHeader;
export const DataTableBody = TableBody;
export const DataTableRow = TableRow;
export const DataTableHead = TableHead;
export const DataTableHeaderCell = TableHead;
export const DataTableCell = TableCell;
export const DataTableHeaderCheckboxCell = TableHeaderCheckboxCell;
export const DataTableCheckboxCell = TableCheckboxCell;
export const DataTableIdentityCell = TableIdentityCell;
export const DataTableDateCell = TableDateCell;
export const DataTableActionsCell = TableActionsCell;
export const DataTableFooter = TableFooter;

function DataTableCallable(
  props: Parameters<typeof Table>[0]
): ReturnType<typeof Table> {
  return Table(props);
}

export const DataTable = Object.assign(DataTableCallable, {
  Root: Table,
  Header: TableHeader,
  FillHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  HeaderCell: TableHead,
  Cell: TableCell,
  HeaderCheckboxCell: TableHeaderCheckboxCell,
  CheckboxCell: TableCheckboxCell,
  IdentityCell: TableIdentityCell,
  DateCell: TableDateCell,
  ActionsCell: TableActionsCell,
  Footer: TableFooter,
});
