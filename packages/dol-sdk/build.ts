import { join } from 'node:path';
import { build } from 'bun';

const entrypoints = ['./src/index.ts', './src/mcp/server.ts'];

// Build for Node.js (CommonJS)
await build({
  entrypoints,
  outdir: './dist',
  target: 'node',
  format: 'cjs',
  splitting: false,
  naming: '[dir]/[name].cjs',
  external: ['@modelcontextprotocol/sdk', 'zod'],
});

// Build for Node.js (ESM)
await build({
  entrypoints,
  outdir: './dist',
  target: 'node',
  format: 'esm',
  splitting: true,
  external: ['@modelcontextprotocol/sdk', 'zod'],
});

// Add shebang to the server executable
const serverPath = join(import.meta.dir, 'dist/mcp/server.js');
const serverContent = await Bun.file(serverPath).text();
await Bun.write(serverPath, `#!/usr/bin/env node\n${serverContent}`);

// Generate TypeScript declarations
console.log('Generating TypeScript declarations...');
const { $ } = await import('bun');
await $`bunx tsc --emitDeclarationOnly --declaration --outDir dist --project tsconfig.build.json`;

console.log('Build completed successfully!');
