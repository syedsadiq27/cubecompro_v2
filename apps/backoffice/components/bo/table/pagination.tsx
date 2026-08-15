'use client';

import { useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/bo/icons';
import { cn } from '@repo/ui';

export type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  variant?: 'default' | 'compact' | 'minimal';
  itemLabel?: string;
  className?: string;
};

export function Pagination({
  currentPage,
  totalItems,
  pageSize = 25,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  variant = 'default',
  itemLabel = 'items',
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis (e.g. 1, 2, 3, '...', 10)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, 'ellipsis', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-1.5 text-[12px] text-[var(--text-muted)]', className)}>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
            className="flex h-7 w-7 items-center justify-center rounded border border-[var(--line)] text-[var(--text-muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)] disabled:opacity-35 disabled:pointer-events-none"
          >
            <ChevronLeftIcon size={14} />
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
            className="flex h-7 w-7 items-center justify-center rounded border border-[var(--line)] text-[var(--text-muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)] disabled:opacity-35 disabled:pointer-events-none"
          >
            <ChevronRightIcon size={14} />
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-3 px-6 py-3 text-[12px] text-[var(--text-muted)] border-t border-[var(--line)]',
          className
        )}
      >
        <span>
          Showing <span className="font-medium text-[var(--ink)]">{startItem}</span> to{' '}
          <span className="font-medium text-[var(--ink)]">{endItem}</span> of{' '}
          <span className="font-medium text-[var(--ink)]">{totalItems}</span> {itemLabel}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
            className="flex h-7 w-7 items-center justify-center rounded border border-[var(--line)] text-[var(--text-muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)] disabled:opacity-35 disabled:pointer-events-none"
          >
            <ChevronLeftIcon size={14} />
          </button>
          <span className="flex h-7 min-w-7 items-center justify-center rounded border border-[var(--border-strong)] bg-[var(--surface)] px-2 text-[12px] font-semibold text-[var(--ink)]">
            {currentPage}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
            className="flex h-7 w-7 items-center justify-center rounded border border-[var(--line)] text-[var(--text-muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)] disabled:opacity-35 disabled:pointer-events-none"
          >
            <ChevronRightIcon size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 px-6 py-3 text-[12px] text-[var(--text-muted)] border-t border-[var(--line)]',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <span>
          Showing <span className="font-medium text-[var(--ink)]">{startItem}</span> to{' '}
          <span className="font-medium text-[var(--ink)]">{endItem}</span> of{' '}
          <span className="font-medium text-[var(--ink)]">{totalItems}</span> {itemLabel}
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
        {/* Previous */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className="flex h-7 items-center gap-1 rounded border border-[var(--line)] px-2 text-[12px] text-[var(--text-muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)] disabled:opacity-35 disabled:pointer-events-none mr-1"
        >
          <ChevronLeftIcon size={13} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Numeric Page Buttons */}
        {pageNumbers.map((page, idx) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-7 w-7 items-center justify-center text-[var(--text-muted)] select-none font-mono"
              >
                …
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex h-7 min-w-7 items-center justify-center rounded px-2 font-mono text-[12px] transition-colors',
                isActive
                  ? 'border border-[var(--ink)] bg-[var(--ink)] text-white font-semibold shadow-2xs'
                  : 'border border-[var(--line)] bg-[var(--surface-pure)] text-[var(--text-secondary)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]'
              )}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className="flex h-7 items-center gap-1 rounded border border-[var(--line)] px-2 text-[12px] text-[var(--text-muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)] disabled:opacity-35 disabled:pointer-events-none ml-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon size={13} />
        </button>
      </div>
    </div>
  );
}
