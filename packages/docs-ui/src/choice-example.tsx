type ChoiceExampleProps = {
  product?: string;
  choices: Array<{
    key: string;
    values: string[];
  }>;
};

export function ChoiceExample({
  product = 'Lounge Chair',
  choices,
}: ChoiceExampleProps) {
  return (
    <div className="not-prose my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card p-4">
      <p className="mb-3 text-sm font-semibold text-fd-foreground">{product}</p>
      <ul className="space-y-3 font-mono text-[13px] text-fd-foreground">
        {choices.map((choice) => (
          <li key={choice.key}>
            <span className="font-semibold">{choice.key}</span>
            <ul className="mt-1 space-y-0.5 pl-4 text-fd-muted-foreground">
              {choice.values.map((value) => (
                <li key={value}>├── {value}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
