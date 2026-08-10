export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="mb-16">
      <h1 className="type-page max-w-xl">{title}</h1>
      <p className="type-body type-measure mt-5">{description}</p>
    </header>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="type-section mb-8">{title}</h2>
      <div className="space-y-8">{children}</div>
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="type-body type-measure space-y-3">{children}</div>;
}

export function SpecTable({
  rows,
}: {
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[var(--line)]">
      <table className="w-full text-left">
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-b border-[var(--line)] last:border-b-0"
            >
              <th className="type-meta w-[40%] px-4 py-3.5 text-left">
                {row.label}
              </th>
              <td className="px-4 py-3.5 text-[14px] font-normal text-[var(--ink)]">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-[10px] bg-[var(--ink)] p-5 font-[family-name:var(--font-mono)] text-[13px] leading-[1.5] font-normal text-[#f2f1ed]">
      <code>{children}</code>
    </pre>
  );
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="type-body rounded-[10px] bg-[var(--stage-bg)] px-5 py-4">
      {children}
    </div>
  );
}
