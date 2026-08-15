import { Section } from '@repo/ui';

import { MediaSlot } from './media-slot';

export function FullWidthVisual({
  src,
  alt,
  eyebrow,
  title,
  description,
  priority = false,
  aspectRatio = 'aspect-[21/9]',
  tone = 'soft',
}: {
  src?: string;
  alt?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  priority?: boolean;
  aspectRatio?: string;
  tone?: 'canvas' | 'soft';
}) {
  return (
    <Section tone={tone} spacing="default">
      {title ? (
        <Section.Header
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      ) : null}

      <Section.Body>
        <MediaSlot
          src={src}
          alt={alt}
          aspectRatio={aspectRatio}
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 85vw"
        />
      </Section.Body>
    </Section>
  );
}
