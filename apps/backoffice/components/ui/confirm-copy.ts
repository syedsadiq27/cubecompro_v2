/**
 * Confirmation dialog copy helpers.
 * Never use bare “Are you sure?”
 */

export function confirmDeleteCopy(entityLabel: string, consequence?: string) {
  return {
    title: `Delete “${entityLabel}”?`,
    body:
      consequence ??
      'This permanently removes the item and cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
  };
}

export function confirmDisconnectCopy(integrationLabel: string) {
  return {
    title: `Disconnect ${integrationLabel}?`,
    body: 'Connected data will stop syncing until you reconnect.',
    confirmLabel: 'Disconnect',
    cancelLabel: 'Cancel',
  };
}

export function confirmDiscardCopy() {
  return {
    title: 'Discard unsaved changes?',
    body: 'Your edits will be lost.',
    confirmLabel: 'Discard',
    cancelLabel: 'Keep editing',
  };
}
