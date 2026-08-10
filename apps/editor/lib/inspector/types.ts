import type { ReactNode } from 'react';
import type * as THREE from 'three';
import type { EditorDocument } from '../editor-store';

export type InspectorContextKind = 'model' | 'object' | 'decoration';

export type InspectorStepGroup =
  | 'object'
  | 'appearance'
  | 'configure'
  | 'commerce'
  | 'system';

export type InspectorStepStatus =
  | { kind: 'complete' }
  | { kind: 'warning' }
  | { kind: 'empty' }
  | { kind: 'count'; value: number }
  | { kind: 'text'; value: string };

export type InspectorRuntimeContext = {
  kind: InspectorContextKind;
  selected: THREE.Object3D | null;
  document: EditorDocument | null;
  selectionRevision: number;
};

export type InspectorStep = {
  id: string;
  label: string;
  description?: string;
  group: InspectorStepGroup;
  contexts: InspectorContextKind[];
  getStatus?: (
    ctx: InspectorRuntimeContext
  ) => InspectorStepStatus | undefined;
  getSummary?: (ctx: InspectorRuntimeContext) => string | undefined;
  render: (ctx: InspectorRuntimeContext) => ReactNode;
};

export const INSPECTOR_GROUP_LABELS: Record<InspectorStepGroup, string> = {
  object: 'Object',
  appearance: 'Appearance',
  configure: 'Configure',
  commerce: 'Commerce',
  system: 'System',
};
