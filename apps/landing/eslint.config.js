import { nextJsConfig } from '@repo/eslint-config/next-js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    files: ['components/demo/sofa/**/*.{ts,tsx}'],
    rules: {
      'react/no-unknown-property': 'off',
    },
  },
];
