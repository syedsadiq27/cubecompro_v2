
import { Section } from '@repo/ui';
import { MechanismFlow } from './mechanism-flow';

export function StageStory() {
  return (
    <Section id="stage" tone="canvas" spacing="default">
      <Section.Header
        title="One product. Every choice stays connected."
        description="A shopper choice becomes one valid state, then drives both the experience and commerce."
      />

      <Section.Body gap="tight">
        <MechanismFlow />
      </Section.Body>
    </Section>
  );
}
