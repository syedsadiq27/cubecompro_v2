import { createGraphQlClient } from '@repo/graphql';
import { getLoginPath, getServerPath } from './env';

export function createAuthClient() {
  return createGraphQlClient({
    serverPath: getServerPath(),
    loginPath: getLoginPath(),
  });
}

export function createGlobalClient(token?: string) {
  return createGraphQlClient({
    serverPath: getServerPath(),
    getToken: () => token,
  });
}

export function createProjectClient(projectId: string, token?: string) {
  return createGraphQlClient({
    serverPath: getServerPath(),
    projectId,
    getToken: () => token,
  });
}
