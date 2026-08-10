import type { CodegenConfig } from '@graphql-codegen/cli';

const serverPath = (
  process.env.NEXT_PUBLIC_3DDD_SERVER_PATH ??
  'https://qa-product-3ddd-plus-server-659729422033.us-east1.run.app'
).replace(/\/$/, '');

const projectId = process.env.GRAPHQL_INTROSPECT_PROJECT_ID ?? '193';
const token = process.env.GRAPHQL_INTROSPECT_TOKEN;

const config: CodegenConfig = {
  schema: {
    [`${serverPath}/${projectId}/graphql`]: {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    },
  },
  generates: {
    './schema/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
