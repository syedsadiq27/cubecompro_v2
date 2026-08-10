'use client';

import { useEditorStore } from '../../lib/editor-store';

export function ModalHost() {
  const modal = useEditorStore((state) => state.modal);
  const document = useEditorStore((state) => state.document);
  const closeModal = useEditorStore((state) => state.closeModal);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  if (!modal) return null;

  return (
    <div className="absolute inset-0 z-[40] flex items-center justify-center bg-black/25 p-4">
      <div className="w-full max-w-md rounded-[14px] border border-[var(--line)] bg-[var(--surface-pure)] shadow-xl">
        <div className="border-b border-[var(--line)] px-4 py-3">
          <p className="type-nav-label">Modal</p>
          <p className="mt-1 text-[14px] font-medium text-[var(--ink)]">
            {modal === 'save' ? 'Save as' : 'Info'}
          </p>
        </div>
        <div className="space-y-3 px-4 py-4">
          {modal === 'save' ? (
            <>
              <label className="block text-[12px]">
                <span className="text-[var(--text-muted)]">Name</span>
                <input
                  defaultValue={document?.modelName ?? ''}
                  className="mt-1 w-full rounded-[8px] border border-[var(--line)] px-3 py-2 text-[13px] text-[var(--ink)] outline-none focus:border-[var(--ink)]"
                />
              </label>
              <label className="block text-[12px]">
                <span className="text-[var(--text-muted)]">SKU</span>
                <input
                  defaultValue={document?.modelSku ?? ''}
                  className="mt-1 w-full rounded-[8px] border border-[var(--line)] px-3 py-2 text-[13px] text-[var(--ink)] outline-none focus:border-[var(--ink)]"
                />
              </label>
              <p className="type-meta">
                Server persistence replaces this form later. Quick save stays
                one click.
              </p>
            </>
          ) : (
            <p className="text-[13px] text-[var(--text-muted)]">
              Secondary model info will live here.
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-[var(--line)] px-4 py-3">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-[7px] px-3 py-1.5 text-[12px] text-[var(--text-muted)] hover:bg-black/[0.04]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              closeModal();
              setStatusMessage(
                modal === 'save'
                  ? 'Save as is not persisted yet.'
                  : 'Closed'
              );
            }}
            className="rounded-[7px] bg-[var(--ink)] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-black"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
