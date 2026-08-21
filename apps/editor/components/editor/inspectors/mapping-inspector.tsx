'use client';

import { DetailRow, InspectorSection, StatusBadge } from '@repo/ui';
import { hierarchyBreadcrumb } from '@/lib/authoring-labels';
import { useEditorStore } from '@/lib/editor-store';

export function MappingInspector() {
  const identity = useEditorStore((state) => state.selectionIdentity);
  const dirty = useEditorStore((state) => state.dirty);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const setActiveWorkspace = useEditorStore((state) => state.setActiveWorkspace);

  return (
    <div className="space-y-4 text-[12px]">
      <div>
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-[13px] font-semibold text-[var(--ink)]">
            Make configurable
          </h3>
          <StatusBadge
            role={dirty ? 'warning' : 'published'}
            label={dirty ? 'DRAFT' : 'SAVED'}
          />
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          Bind product choices to the selected target. Save writes ModelTarget
          and VisualEffect data only.
        </p>
      </div>

      <InspectorSection title="Selected object">
        {!identity ? (
          <p className="text-[11px] text-[var(--text-muted)]">
            Select a mesh in the viewport or scene tree.
          </p>
        ) : (
          <div className="space-y-1">
            <p className="text-[12px] font-medium text-[var(--ink)]">
              {identity.objectName}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              {hierarchyBreadcrumb(identity.nodePath)}
            </p>
            <p className="text-[11px] text-[var(--ink)]">
              Target:{' '}
              <span className="font-medium">
                {identity.target?.key ?? 'Unbound'}
              </span>
            </p>
            {!identity.target ? (
              <button
                type="button"
                className="text-[11px] font-medium text-[var(--brand)] hover:underline"
                onClick={() => setActiveWorkspace('objects')}
              >
                Create target from selection
              </button>
            ) : (
              <p className="text-[11px] text-[var(--text-muted)]">
                {identity.bindings.length} binding
                {identity.bindings.length === 1 ? '' : 's'} on this target
              </p>
            )}
          </div>
        )}
      </InspectorSection>

      <InspectorSection title="Document">
        <div className="space-y-1 text-[11px]">
          <DetailRow
            label="Targets"
            value={String(visualDocument?.targets.length ?? 0)}
          />
          <DetailRow
            label="Bindings"
            value={String(visualDocument?.bindings.length ?? 0)}
          />
        </div>
      </InspectorSection>

      <details className="rounded-lg border border-[var(--line)] bg-[var(--canvas)]/40 px-2.5 py-2">
        <summary className="cursor-pointer select-none text-[11px] font-medium text-[var(--text-muted)]">
          Details
        </summary>
        <div className="mt-2 space-y-1 text-[11px]">
          <DetailRow
            label="Revision"
            value={visualDocument?.productRevisionId ?? '—'}
            isCode
          />
          <DetailRow
            label="nodePath"
            value={identity?.nodePath ?? '—'}
            isCode
          />
        </div>
      </details>
    </div>
  );
}
