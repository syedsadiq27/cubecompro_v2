'use client';

import { createGraphiQLFetcher, type Fetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import { useEffect, useState } from 'react';
import 'graphiql/graphiql.css';

const DEFAULT_QUERY = `# Lounge Chair resolve example
query Resolve($input: ConfigurationStateInput!) {
  resolveConfiguration(input: $input) {
    valid
    violations
    threeD {
      rootObjectAssetRevisionId
      activeObjectAssetRevisionIds
      effects {
        operation
        targetKey
        objectAssetRevisionId
      }
    }
    commerce {
      sku
      provider
    }
  }
}
`;

const INITIAL_VARIABLES = JSON.stringify(
  {
    input: {
      productId: 'PRODUCT_ID',
      selectionsJson: '{"frame":"walnut","fabric":"beige","legs":"brass"}',
    },
  },
  null,
  2
);

export function GraphiQLExplorer() {
  const [fetcher, setFetcher] = useState<Fetcher | null>(null);

  useEffect(() => {
    setFetcher(
      createGraphiQLFetcher({
        url:
          process.env.NEXT_PUBLIC_CUBECOM_GRAPHQL_URL ??
          'http://localhost:3005/graphql',
        fetch: globalThis.fetch.bind(globalThis),
      })
    );
  }, []);

  if (!fetcher) {
    return (
      <div className="text-fd-muted-foreground flex h-[calc(100dvh-3.5rem)] min-h-[32rem] items-center justify-center text-sm">
        Loading GraphQL explorer…
      </div>
    );
  }

  return (
    <div className="border-fd-border h-[calc(100dvh-3.5rem)] min-h-[32rem] w-full overflow-hidden border-t">
      <GraphiQL
        fetcher={fetcher}
        defaultQuery={DEFAULT_QUERY}
        initialVariables={INITIAL_VARIABLES}
      />
    </div>
  );
}
