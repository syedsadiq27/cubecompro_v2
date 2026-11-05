const path = require('node:path');

const appRoot = path.resolve(process.argv[2] || process.cwd());
const resolveOpts = { paths: [appRoot] };
const workspaceRoot = path.resolve(appRoot, '../..');
const nestRoot = path.join(workspaceRoot, 'node_modules', '@nestjs');

const core = require.resolve('@nestjs/core', resolveOpts);
const apollo = require.resolve('@nestjs/apollo', resolveOpts);
const config = require.resolve('@nestjs/config', resolveOpts);

const resolved = { core, apollo, config };

for (const [name, resolvedPath] of Object.entries(resolved)) {
  if (!resolvedPath.startsWith(nestRoot + path.sep) && resolvedPath !== nestRoot) {
    console.error(
      `[verify-nest-resolution] ${name} is not hoisted under ${nestRoot}`
    );
    console.error(JSON.stringify(resolved, null, 2));
    process.exit(1);
  }
}

console.log('[verify-nest-resolution] ok', resolved);
