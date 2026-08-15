import Image from 'next/image';
import { Section } from '@repo/ui';
import { MechanismFlow } from './mechanism-flow';

export function StageStory() {
  return (
    <Section
      id="stage"
      tone="ink"
      spacing="cta"
      bordered={false}
      className="border-t border-[var(--stage-violet)]"
    >
      <Section.Header>
        <Section.Eyebrow className="text-[var(--stage-violet-light)]">
          System Architecture
        </Section.Eyebrow>
        <Section.Title
          spacing="eyebrow"
          className="max-w-[16ch] text-[clamp(2.15rem,4.8vw,3.55rem)]"
        >
          Choice → Valid State → Commerce
        </Section.Title>
        <Section.Description className="max-w-2xl text-base md:text-lg">
          The CubeCom thesis in one path. Every selection becomes one valid
          state — then drives experience and sellable commerce.
        </Section.Description>
      </Section.Header>

      <Section.Body gap="lg" className="space-y-8 md:space-y-12">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-[0_28px_64px_-20px_rgba(0,0,0,0.8)]">
          <Image
            src="/images/mechanism-state-pipeline-v2.jpg"
            alt="Product choices passing through a rules graph into one valid state and synchronized commerce outputs"
            fill
            sizes="(max-width: 1024px) 100vw, 85vw"
            className="object-cover select-none"
          />
        </div>
        <MechanismFlow />
      </Section.Body>
    </Section>
  );
}
