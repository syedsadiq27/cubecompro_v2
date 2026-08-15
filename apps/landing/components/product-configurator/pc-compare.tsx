import { SolutionCompare } from '@/components/solutions/solution-compare';

const WITHOUT = [
  'Catalog explosion from every option combo',
  'Invalid combinations reach checkout',
  'Duplicated rules in every frontend',
  'No single valid-state → commerce path',
];

const WITH = [
  'Options + rules instead of variant matrices',
  'Dependencies and exclusions enforced once',
  'Runtime resolution to a valid state',
  'SKU / price / inventory from that state',
];

export function PcCompare() {
  return (
    <SolutionCompare
      without={WITHOUT}
      withItems={WITH}
      title="From variant sprawl to one source of configuration truth."
    />
  );
}
