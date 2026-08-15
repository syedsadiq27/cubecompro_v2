type ApiMethodProps = {
  method: string;
  path: string;
  summary?: string;
};

export function ApiMethod({ method, path, summary }: ApiMethodProps) {
  return (
    <div className="not-prose my-4 flex flex-wrap items-baseline gap-3 rounded-lg border border-fd-border bg-fd-secondary px-4 py-3">
      <span className="font-mono text-xs font-semibold tracking-wide text-fd-primary">
        {method.toUpperCase()}
      </span>
      <code className="font-mono text-sm text-fd-foreground">{path}</code>
      {summary ? (
        <span className="text-sm text-fd-muted-foreground">{summary}</span>
      ) : null}
    </div>
  );
}
