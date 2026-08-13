'use client';

import { scrollDocsToId } from '@/lib/docs-scroll';

export function HeadingAnchor({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      className="type-meta ml-2 no-underline opacity-0 transition-opacity group-hover:opacity-100"
      onClick={(event) => {
        event.preventDefault();
        scrollDocsToId(id);
      }}
    >
      #
    </a>
  );
}
