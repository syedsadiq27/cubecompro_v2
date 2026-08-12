import { registerInspectorStep } from '@/lib/inspector/registry';
import type { InspectorStep } from '@/lib/inspector/types';
import {
  CameraStep,
  EnvironmentStep,
  GeometryStep,
  MaterialStep,
  SceneStep,
  ShadowStep,
  TextureStep,
  TransformStep,
  VisibilityStep,
} from './steps';

let registered = false;

export function ensureInspectorStepsRegistered() {
  if (registered) return;
  registered = true;

  const steps: InspectorStep[] = [
    {
      id: 'transform',
      label: 'Transform',
      description: 'Position, rotation, scale',
      group: 'object',
      contexts: ['object', 'decoration'],
      getStatus: () => ({ kind: 'complete' }),
      render: (ctx) => <TransformStep ctx={ctx} />,
    },
    {
      id: 'visibility',
      label: 'Visibility',
      description: 'Show or hide',
      group: 'object',
      contexts: ['object', 'decoration'],
      getStatus: (ctx) =>
        ctx.selected?.visible === false
          ? { kind: 'warning' }
          : { kind: 'complete' },
      getSummary: (ctx) =>
        ctx.selected?.visible === false ? 'Hidden' : 'Visible',
      render: (ctx) => <VisibilityStep ctx={ctx} />,
    },
    {
      id: 'geometry',
      label: 'Geometry',
      description: 'Mesh stats',
      group: 'object',
      contexts: ['object'],
      getStatus: () => ({ kind: 'complete' }),
      render: (ctx) => <GeometryStep ctx={ctx} />,
    },
    {
      id: 'material-object',
      label: 'Material',
      description: 'Assignment & PBR',
      group: 'appearance',
      contexts: ['object'],
      getStatus: () => ({ kind: 'complete' }),
      render: (ctx) => <MaterialStep ctx={ctx} />,
    },
    {
      id: 'texture',
      label: 'Texture',
      description: 'Maps & UVs',
      group: 'appearance',
      contexts: ['object'],
      getStatus: () => ({ kind: 'empty' }),
      getSummary: () => 'No maps',
      render: (ctx) => <TextureStep ctx={ctx} />,
    },
    {
      id: 'shadow',
      label: 'Shadow',
      description: 'Cast & receive',
      group: 'appearance',
      contexts: ['object'],
      getStatus: () => ({ kind: 'complete' }),
      render: (ctx) => <ShadowStep ctx={ctx} />,
    },
    {
      id: 'scene',
      label: 'Scene',
      description: 'Counts & graph',
      group: 'system',
      contexts: ['model'],
      getStatus: () => ({ kind: 'complete' }),
      render: (ctx) => <SceneStep ctx={ctx} />,
    },
    {
      id: 'environment',
      label: 'Environment',
      description: 'HDRI & exposure',
      group: 'system',
      contexts: ['model'],
      getStatus: () => ({ kind: 'complete' }),
      getSummary: () => 'Studio Soft',
      render: (ctx) => <EnvironmentStep ctx={ctx} />,
    },
    {
      id: 'camera',
      label: 'Camera',
      description: 'Framing',
      group: 'system',
      contexts: ['model'],
      getStatus: () => ({ kind: 'complete' }),
      getSummary: () => 'Perspective',
      render: (ctx) => <CameraStep ctx={ctx} />,
    },
  ];

  steps.forEach(registerInspectorStep);
}
