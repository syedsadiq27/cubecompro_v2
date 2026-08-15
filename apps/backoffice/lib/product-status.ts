import type { StatusGrammarRole } from '@/lib/status-vocabulary';

export const PRODUCT_CREATED_STATUS = '7';
export const PRODUCT_INPROGRESS_STATUS = '8';
export const PRODUCT_CANCELLED_STATUS = '9';
export const PRODUCT_UNPUBLISH_STATUS = '10';
export const PRODUCT_PUBLISH_STATUS = '11';
export const PRODUCT_DRAFT_STATUS = '12';

export const PRODUCT_LIST_STATUSES = [
  PRODUCT_CREATED_STATUS,
  PRODUCT_INPROGRESS_STATUS,
  PRODUCT_CANCELLED_STATUS,
  PRODUCT_UNPUBLISH_STATUS,
  PRODUCT_PUBLISH_STATUS,
  PRODUCT_DRAFT_STATUS,
];

/**
 * Filter buckets for list toolbars.
 * Domain publish → UI filter "Active"; domain cancel → UI filter "Archived".
 * See status-vocabulary.ts.
 */
export type OperationalStatus =
  | 'published'
  | 'draft'
  | 'cancelled'
  | 'other';

export function toOperationalStatus(
  statusName?: string | null
): OperationalStatus {
  const value = (statusName ?? '').toLowerCase();
  if (
    (value.includes('publish') && !value.includes('unpublish')) ||
    value === 'active' ||
    value.includes('live')
  ) {
    return 'published';
  }
  if (value.includes('archiv') || value.includes('cancel')) {
    return 'cancelled';
  }
  if (
    value.includes('draft') ||
    value.includes('progress') ||
    value.includes('created') ||
    value.includes('unpublish')
  ) {
    return 'draft';
  }
  return 'other';
}

/** List/filter badge labels (Active / Draft / Archived). */
export function formatListStatus(statusName?: string | null): string {
  const operational = toOperationalStatus(statusName);
  if (operational === 'published') return 'Active';
  if (operational === 'cancelled') return 'Archived';
  if (operational === 'draft') {
    const value = (statusName ?? '').toLowerCase();
    if (value.includes('progress')) return 'Processing';
    return 'Draft';
  }
  return statusName || 'Unknown';
}

/** @deprecated Prefer formatListStatus for ops lists. */
export function formatOperationalStatus(statusName?: string | null): string {
  return formatListStatus(statusName);
}

export function toStatusGrammarRole(
  statusName?: string | null
): StatusGrammarRole {
  const operational = toOperationalStatus(statusName);
  if (operational === 'published') return 'published';
  if (operational === 'cancelled') return 'archived';
  if (operational === 'draft') {
    const value = (statusName ?? '').toLowerCase();
    if (value.includes('progress')) return 'processing';
    return 'draft';
  }
  return 'neutral';
}

export function toStatusPillTone(
  statusName?: string | null
): 'live' | 'draft' | 'cancelled' | 'warning' | 'info' {
  const operational = toOperationalStatus(statusName);
  if (operational === 'published') return 'live';
  if (operational === 'cancelled') return 'cancelled';
  if (operational === 'draft') {
    const value = (statusName ?? '').toLowerCase();
    if (value.includes('progress')) return 'info';
    return 'draft';
  }
  return 'info';
}
