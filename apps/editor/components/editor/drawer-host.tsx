'use client';

import { useEditorStore, type DrawerId } from '@/lib/editor-store';

const TITLES: Record<Exclude<DrawerId, null>, string> = {
  materials: 'Material library',
  textures: 'Texture library',
  colors: 'Color library',
  variants: 'Variants',
  lights: 'Lighting',
  camera: 'Camera',
  objects: 'Object library',
};

export function DrawerHost() {
  const drawer = useEditorStore((state) => state.drawer);
  const closeDrawer = useEditorStore((state) => state.closeDrawer);

  if (!drawer) return null;

  return (
    <div className="absolute inset-0 z-[30]">
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 bg-black/20"
        onClick={closeDrawer}
      />
      <aside className="absolute inset-y-0 right-0 flex w-[360px] max-w-[90vw] flex-col border-l border-[var(--line)] bg-[var(--surface-pure)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
          <div>
            <p className="type-nav-label">Drawer</p>
            <p className="mt-1 text-[14px] font-medium text-[var(--ink)]">
              {TITLES[drawer]}
            </p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-[7px] px-2.5 py-1.5 text-[12px] text-[var(--text-muted)] hover:bg-black/[0.04] hover:text-[var(--ink)]"
          >
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <p className="text-[13px] text-[var(--text-muted)]">
            This drawer is a contribution host. Feature libraries will mount
            here without changing the shell.
          </p>
          <div className="mt-4 rounded-[10px] border border-dashed border-[var(--line)] px-4 py-8 text-center text-[12px] text-[var(--text-muted)]">
            {TITLES[drawer]} content
          </div>
        </div>
      </aside>
    </div>
  );
}
