import type { InspectorStep, InspectorStepGroup } from './types';

const steps = new Map<string, InspectorStep>();

export function registerInspectorStep(step: InspectorStep): void {
  steps.set(step.id, step);
}

export function getInspectorStep(id: string): InspectorStep | undefined {
  return steps.get(id);
}

export function listInspectorSteps(): InspectorStep[] {
  return Array.from(steps.values());
}

export function stepsForContext(
  kind: InspectorStep['contexts'][number]
): InspectorStep[] {
  return listInspectorSteps().filter((step) => step.contexts.includes(kind));
}

export function groupSteps(
  items: InspectorStep[]
): Array<{ group: InspectorStepGroup; steps: InspectorStep[] }> {
  const order: InspectorStepGroup[] = [
    'object',
    'appearance',
    'configure',
    'commerce',
    'system',
  ];
  return order
    .map((group) => ({
      group,
      steps: items.filter((step) => step.group === group),
    }))
    .filter((entry) => entry.steps.length > 0);
}
