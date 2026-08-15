import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSchema } from 'graphql';

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(docsRoot, '../..');
const schemaPath = resolve(repoRoot, 'apps/api/src/schema.gql');
const referenceFiles = [
  resolve(docsRoot, 'content/docs/api/inputs.mdx'),
  resolve(docsRoot, 'content/docs/api/objects.mdx'),
  resolve(docsRoot, 'content/docs/api/enums.mdx'),
];
const operationFiles = {
  Query: resolve(docsRoot, 'content/docs/api/queries.mdx'),
  Mutation: resolve(docsRoot, 'content/docs/api/mutations.mdx'),
};
const outputPath = resolve(docsRoot, 'content/docs/api/schema-coverage.mdx');

const schema = await readFile(schemaPath, 'utf8');
const declarations = [...schema.matchAll(/^\s*(type|input|enum)\s+([A-Za-z_]\w*)/gm)].map(
  ([, kind, name]) => ({ kind, name })
);
const reference = (
  await Promise.all(referenceFiles.map((path) => readFile(path, 'utf8')))
).join('\n');
const dedicatedSections = new Set(
  [...reference.matchAll(/^##\s+`([^`]+)`/gm)].map(([, name]) => name)
);

const documented = declarations.filter(({ name }) => dedicatedSections.has(name));
const undocumented = declarations.filter(({ name }) => !dedicatedSections.has(name));
const coverage = ((documented.length / declarations.length) * 100).toFixed(1);
const schemaHash = createHash('sha256').update(schema).digest('hex').slice(0, 12);
const executableSchema = buildSchema(schema);
const operationCoverage = Object.fromEntries(
  await Promise.all(
    Object.entries(operationFiles).map(async ([kind, path]) => {
      const fields = Object.keys(executableSchema.getType(kind).getFields());
      const document = await readFile(path, 'utf8');
      const headings = new Set(
        [...document.matchAll(/^##\s+`([^`]+)`/gm)].map(([, name]) => name)
      );
      const missing = fields.filter((name) => !headings.has(name));
      return [kind, { fields, missing, documented: fields.length - missing.length }];
    })
  )
);

const group = (items, kind) =>
  items
    .filter((item) => item.kind === kind)
    .map((item) => `- \`${item.name}\``)
    .join('\n') || '- None';

const output = `---
title: Schema coverage
description: Generated inventory of GraphQL declarations with dedicated API reference sections.
---

This page is generated from \`apps/api/src/schema.gql\` by \`yarn workspace docs api:coverage\`. Schema fingerprint: \`${schemaHash}\`.

| Measure | Count |
| --- | ---: |
| Schema declarations | ${declarations.length} |
| Documented with a dedicated section | ${documented.length} |
| Undocumented | ${undocumented.length} |
| Coverage | ${coverage}% |

Coverage counts named \`type\`, \`input\`, and \`enum\` declarations. A declaration is documented only when Inputs, Objects, or Enums contains a matching level-two code heading. Mentions in prose and operation pages do not count.

## Operation coverage

| Root type | Fields | Documented | Undocumented | Coverage |
| --- | ---: | ---: | ---: | ---: |
| Query | ${operationCoverage.Query.fields.length} | ${operationCoverage.Query.documented} | ${operationCoverage.Query.missing.length} | ${((operationCoverage.Query.documented / operationCoverage.Query.fields.length) * 100).toFixed(1)}% |
| Mutation | ${operationCoverage.Mutation.fields.length} | ${operationCoverage.Mutation.documented} | ${operationCoverage.Mutation.missing.length} | ${((operationCoverage.Mutation.documented / operationCoverage.Mutation.fields.length) * 100).toFixed(1)}% |

### Undocumented queries

${operationCoverage.Query.missing.map((name) => `- \`${name}\``).join('\n') || '- None'}

### Undocumented mutations

${operationCoverage.Mutation.missing.map((name) => `- \`${name}\``).join('\n') || '- None'}

## Undocumented types

${group(undocumented, 'type')}

## Undocumented inputs

${group(undocumented, 'input')}

## Undocumented enums

${group(undocumented, 'enum')}
`;

await writeFile(outputPath, output);
console.log(
  `API declarations: ${documented.length}/${declarations.length} (${coverage}%); ` +
    `queries: ${operationCoverage.Query.documented}/${operationCoverage.Query.fields.length}; ` +
    `mutations: ${operationCoverage.Mutation.documented}/${operationCoverage.Mutation.fields.length}`
);
