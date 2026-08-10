import { print, type DocumentNode } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

export type GraphQlError = {
  message: string;
};

export type GraphQlResponse<T> = {
  data?: T;
  errors?: GraphQlError[];
};

export class GraphQlRequestError extends Error {
  errors: GraphQlError[];

  constructor(message: string, errors: GraphQlError[] = []) {
    super(message);
    this.name = 'GraphQlRequestError';
    this.errors = errors;
  }
}

export type GraphQlClientContext = 'auth' | 'global' | 'project';

export type GraphQlEndpointConfig = {
  serverPath: string;
  loginPath?: string;
  projectId?: string;
};

export function normalizeServerPath(serverPath: string): string {
  return serverPath.replace(/\/$/, '');
}

export function resolveGraphQlEndpoint(
  context: GraphQlClientContext,
  config: GraphQlEndpointConfig
): string {
  const base = normalizeServerPath(config.serverPath);

  if (context === 'auth') {
    const loginPath = config.loginPath ?? '/register';
    return `${base}${loginPath.startsWith('/') ? loginPath : `/${loginPath}`}`;
  }

  if (context === 'global') {
    return `${base}/graphql`;
  }

  if (!config.projectId) {
    throw new GraphQlRequestError(
      'projectId is required for project-scoped GraphQL requests'
    );
  }

  return `${base}/${config.projectId}/graphql`;
}

export type DocumentLike<TResult, TVariables> =
  | TypedDocumentNode<TResult, TVariables>
  | DocumentNode
  | string;

function documentToString(document: DocumentNode | string): string {
  if (typeof document === 'string') {
    return document;
  }

  return print(document);
}

export async function graphqlRequest<TResult, TVariables>(
  endpoint: string,
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  token?: string
): Promise<TResult>;
export async function graphqlRequest<TResult>(
  endpoint: string,
  document: DocumentNode | string,
  variables?: Record<string, unknown>,
  token?: string
): Promise<TResult>;
export async function graphqlRequest<TResult, TVariables = Record<string, unknown>>(
  endpoint: string,
  document: DocumentLike<TResult, TVariables>,
  variables?: TVariables,
  token?: string
): Promise<TResult> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: documentToString(document as DocumentNode | string),
      variables: variables ?? {},
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    let detail = '';
    try {
      detail = (await response.text()).trim();
    } catch {
      detail = '';
    }
    const suffix = detail ? ` — ${detail.slice(0, 400)}` : '';
    throw new GraphQlRequestError(
      `GraphQL HTTP ${response.status}: ${response.statusText}${suffix}`
    );
  }

  const payload = (await response.json()) as GraphQlResponse<TResult>;

  if (payload.errors?.length) {
    throw new GraphQlRequestError(
      payload.errors.map((error) => error.message).join('; '),
      payload.errors
    );
  }

  if (!payload.data) {
    throw new GraphQlRequestError('GraphQL response missing data');
  }

  return payload.data;
}

export type CreateGraphQlClientOptions = GraphQlEndpointConfig & {
  getToken?: () => string | undefined | Promise<string | undefined>;
};

export function createGraphQlClient(options: CreateGraphQlClientOptions) {
  async function request<TResult, TVariables>(
    context: GraphQlClientContext,
    document: TypedDocumentNode<TResult, TVariables>,
    variables?: TVariables,
    tokenOverride?: string
  ): Promise<TResult> {
    const token =
      tokenOverride ?? (options.getToken ? await options.getToken() : undefined);
    const endpoint = resolveGraphQlEndpoint(context, options);
    return graphqlRequest(endpoint, document, variables, token);
  }

  return {
    request,
    auth: <TResult, TVariables>(
      document: TypedDocumentNode<TResult, TVariables>,
      variables?: TVariables,
      token?: string
    ) => request('auth', document, variables, token),
    global: <TResult, TVariables>(
      document: TypedDocumentNode<TResult, TVariables>,
      variables?: TVariables,
      token?: string
    ) => request('global', document, variables, token),
    project: <TResult, TVariables>(
      document: TypedDocumentNode<TResult, TVariables>,
      variables?: TVariables,
      token?: string
    ) => request('project', document, variables, token),
  };
}

export type GraphQlClient = ReturnType<typeof createGraphQlClient>;
