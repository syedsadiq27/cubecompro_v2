import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './schema/schema.graphql',
  documents: [
    './operations/**/*.graphql',
    './fragments/**/*.graphql',
  ],
  ignoreNoDocuments: true,
  generates: {
    './generated/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
        gqlTagName: 'graphql',
      },
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
        skipTypename: true,
        scalars: {
          Date: 'string',
          JSON: 'unknown',
          Upload: 'File',
        },
      },
    },
  },
};

export default config;
