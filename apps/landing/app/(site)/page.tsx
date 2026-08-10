import { Contact } from '../../components/landing/contact';
import { Faq } from '../../components/landing/faq';
import { Hero } from '../../components/landing/hero';
import { HomeJsonLd } from '../../components/landing/home-json-ld';
import { Pricing } from '../../components/landing/pricing';
import { Solutions } from '../../components/landing/solutions';
import { StageStory } from '../../components/landing/stage-story';
import { Why3d } from '../../components/landing/why-3d';

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <Hero />
      <Why3d />
      <StageStory />
      <Solutions />
      <Pricing />
      <Faq />
      <Contact />
    </>
  );
}
