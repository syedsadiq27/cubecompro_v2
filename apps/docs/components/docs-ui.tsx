import { HeadingAnchor } from '@/components/heading-anchor';
import { slugify } from '@/lib/slug';

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const id = `doc-${slugify(title)}`;
  return (
    <header className="mb-16">
      <h1 id={id} data-docs-title className="type-page max-w-xl scroll-mt-8">
        {title}
      </h1>
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
  const id = `sec-${slugify(title)}`;
  return (
    <section id={id} data-docs-section={title} className="mb-16 scroll-mt-8">
      <h2 className="type-section group mb-8">
        {title}
        <HeadingAnchor id={id} />
      </h2>
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

export function Steps({
  items,
}: {
  items: Array<{ title: string; body: string }>;
}) {
  return (
    <ol className="space-y-6">
      {items.map((item, index) => (
        <li key={item.title} className="flex gap-4">
          <span className="type-num w-7 shrink-0 pt-0.5">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <p className="type-item">{item.title}</p>
            <p className="type-desc mt-1.5">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function TermList({
  items,
}: {
  items: Array<{ term: string; meaning: string }>;
}) {
  return (
    <dl className="space-y-5">
      {items.map((item) => (
        <div key={item.term}>
          <dt className="type-item">{item.term}</dt>
          <dd className="type-desc mt-1">{item.meaning}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Related({
  links,
}: {
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            className="type-desc font-medium text-[var(--ink)] underline-offset-2 hover:underline"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
