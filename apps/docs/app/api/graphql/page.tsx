import type { Metadata } from 'next';
import Link from 'next/link';
import { GraphiQLExplorer } from '@/components/graphiql-explorer';

export const metadata: Metadata = {
  title: 'GraphQL explorer',
  description:
    'Interactive GraphiQL for CubeCom Pro schema exploration and resolveConfiguration.',
};

export default function GraphQLExplorerPage() {
  return (
    <main className="bg-fd-background text-fd-foreground flex min-h-screen flex-col">
      <header className="border-fd-border flex items-center justify-between gap-4 border-b px-4 py-3">
        <div>
          <p className="text-fd-muted-foreground text-xs font-medium tracking-wide uppercase">
            API
          </p>
          <h1 className="text-lg font-semibold tracking-tight">
            GraphQL explorer
          </h1>
        </div>
        <Link
          href="/"
          className="text-fd-muted-foreground hover:text-fd-foreground text-sm underline-offset-4 hover:underline"
        >
          ← Docs
        </Link>
      </header>
      <GraphiQLExplorer />
    </main>
  );
}
