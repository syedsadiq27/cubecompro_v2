import type { ReactNode } from 'react';

type ConceptDiagramProps = {
  children: ReactNode;
  caption?: string;
};

export function ConceptDiagram({ children, caption }: ConceptDiagramProps) {
  return (
    <figure className="not-prose my-4">
      <pre className="overflow-x-auto rounded-lg border border-fd-border bg-fd-secondary p-4 font-mono text-[13px] leading-relaxed text-fd-foreground">
        {children}
      </pre>
      {caption ? (
        <figcaption className="mt-2 text-xs text-fd-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function ArchitectureDiagram(props: ConceptDiagramProps) {
  return <ConceptDiagram {...props} />;
}
