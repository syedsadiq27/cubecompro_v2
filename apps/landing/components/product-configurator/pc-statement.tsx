import { SignatureMechanism } from '@/components/patterns/signature-mechanism';

const STEPS = [
  {
    label: 'Product Graph',
    detail:
      'Options, dimensions, dependencies, and exclusions describe the full configurable product family.',
  },
  {
    label: 'Valid State Resolution',
    detail:
      'CubeCom evaluates every choice against the rules graph and resolves one legal product state.',
    accent: true,
  },
  {
    label: 'Commerce Projection',
    detail:
      'The resolved state deterministically projects to SKU, price, inventory, and the exact cart line.',
  },
];

export function PcStatement() {
  return (
    <SignatureMechanism
      eyebrow="Core Transformation"
      title="Every choice has a consequence. CubeCom resolves it."
      description="Product Graph → Valid State Resolution → Commerce Projection."
      steps={STEPS}
    />
  );
}
