import Image from 'next/image';
import { cn } from '@repo/ui';

export function MediaSlot({
  src,
  alt = '',
  aspectRatio = 'aspect-[16/9]',
  priority = false,
  sizes = '(max-width: 1024px) 100vw, 55vw',
  className,
  imageClassName,
}: {
  src?: string;
  alt?: string;
  aspectRatio?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-[var(--surface)]',
        aspectRatio,
        className
      )}
      aria-hidden={!src}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn('object-cover select-none', imageClassName)}
        />
      ) : null}
    </div>
  );
}
