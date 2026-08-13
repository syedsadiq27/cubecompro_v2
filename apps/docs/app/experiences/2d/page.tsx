import { Planned } from '@/components/planned';

export const metadata = { title: '2D' };

export default function Experience2dPage() {
  return (
    <Planned
      title="2D"
      description="Layered stills and swatches as an alternate experience on the same graph."
      ships={false}
      contract="Same ConfigurationState and resolve path as 3D. A 2D experience would consume a future twoD projection (image layers, swatches) instead of threeD.effects. Options, rules, and commerce mappings stay shared. Do not fork a second product graph for 2D."
      related={[
        { href: '/experiences/3d', label: '3D' },
        { href: '/concepts/resolved-selection', label: 'Resolved selection' },
      ]}
    />
  );
}
