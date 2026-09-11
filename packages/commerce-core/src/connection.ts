import type { CommerceConnectionRef } from './refs.js';

export class CommerceConnectionResolveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommerceConnectionResolveError';
  }
}

export type ResolveCommerceConnectionInput = {
  mappingConnectionId?: string | null;
  projectDefaultConnectionId?: string | null;
  organizationDefaultConnectionId?: string | null;
};

export function resolveCommerceConnection(
  input: ResolveCommerceConnectionInput
): CommerceConnectionRef {
  const mapping = input.mappingConnectionId?.trim();
  if (mapping) {
    return mapping;
  }

  const projectDefault = input.projectDefaultConnectionId?.trim();
  if (projectDefault) {
    return projectDefault;
  }

  const organizationDefault = input.organizationDefaultConnectionId?.trim();
  if (organizationDefault) {
    return organizationDefault;
  }

  throw new CommerceConnectionResolveError(
    'No commerce connection resolved: mapping, project default, and organization default are all missing'
  );
}
