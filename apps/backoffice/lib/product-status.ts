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

export type OperationalStatus = 'live' | 'draft' | 'cancelled' | 'other';

export function toOperationalStatus(
  statusName?: string | null
): OperationalStatus {
  const value = (statusName ?? '').toLowerCase();
  if (value.includes('publish') && !value.includes('unpublish')) return 'live';
  if (
    value.includes('draft') ||
    value.includes('progress') ||
    value.includes('created') ||
    value.includes('unpublish')
  ) {
    return 'draft';
  }
  if (value.includes('cancel')) return 'cancelled';
  return 'other';
}

export function formatOperationalStatus(
  statusName?: string | null
): string {
  const operational = toOperationalStatus(statusName);
  if (operational === 'live') return 'Live';
  if (operational === 'draft') return 'Draft';
  if (operational === 'cancelled') return 'Cancelled';
  return statusName || 'Unknown';
}
