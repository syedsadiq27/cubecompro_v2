type CommerceMappingProps = {
  selection: string;
  provider: string;
  identity: string;
};

export function CommerceMapping({
  selection,
  provider,
  identity,
}: CommerceMappingProps) {
  return (
    <div className="not-prose my-4 grid gap-2 rounded-lg border border-fd-border bg-fd-card p-4 font-mono text-[13px]">
      <div>
        <span className="text-fd-muted-foreground">Selection </span>
        <span className="text-fd-foreground">{selection}</span>
      </div>
      <div className="text-fd-muted-foreground">↓ resolve</div>
      <div>
        <span className="text-fd-muted-foreground">{provider} </span>
        <span className="font-semibold text-fd-foreground">{identity}</span>
      </div>
    </div>
  );
}
