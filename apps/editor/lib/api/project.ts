import { graphqlRequest, resolveGraphQlEndpoint } from '@repo/graphql';
import { RegisterProjectWithCmsDocument } from '@repo/graphql/generated';
import { getServerPath } from '../env';

export type ProjectAuth = {
  projectId: string;
  token: string;
  cmsName?: string;
};

export async function loginProject(projectId: string): Promise<ProjectAuth> {
  const data = await graphqlRequest(
    resolveGraphQlEndpoint('global', { serverPath: getServerPath() }),
    RegisterProjectWithCmsDocument,
    { ProductId: projectId }
  );

  if (!data.registerProjectwithCMS?.token) {
    throw new Error('Project registration did not return a token');
  }

  return {
    projectId,
    token: data.registerProjectwithCMS.token,
    cmsName: data.registerProjectwithCMS.cmsData?.name ?? undefined,
  };
}

export function projectGraphqlEndpoint(projectId: string): string {
  return resolveGraphQlEndpoint('project', {
    serverPath: getServerPath(),
    projectId,
  });
}
