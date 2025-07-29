#!/usr/bin/env bun

import { $ } from 'bun';

console.log('Building Federal Register SDK...');

// Clean dist directory
await $`rm -rf dist`;

// Build ESM format
console.log('Building ESM...');
await Bun.build({
  entrypoints: ['./src/index.ts', './src/mcp/index.ts'],
  outdir: './dist',
  format: 'esm',
  target: 'node',
  external: ['@modelcontextprotocol/sdk', 'axios', 'zod'],
  splitting: true,
  minify: false,
  sourcemap: 'linked',
  naming: {
    entry: '[dir]/[name].mjs',
  },
});

// Build CJS format
console.log('Building CommonJS...');
await Bun.build({
  entrypoints: ['./src/index.ts', './src/mcp/index.ts'],
  outdir: './dist',
  format: 'cjs',
  target: 'node',
  external: ['@modelcontextprotocol/sdk', 'axios', 'zod'],
  splitting: false,
  minify: false,
  sourcemap: 'linked',
  naming: {
    entry: '[dir]/[name].js',
  },
});

// Generate TypeScript declarations
console.log('Generating TypeScript declarations...');
// Find all TypeScript files excluding tests
const srcFiles = await Array.fromAsync(
  new Bun.Glob('src/**/*.ts').scan({
    cwd: process.cwd(),
    onlyFiles: true,
  }),
);
const nonTestFiles = srcFiles.filter(
  (f) => !f.includes('.test.') && !f.includes('.spec.') && !f.includes('test-'),
);

if (nonTestFiles.length > 0) {
  await $`bunx tsc ${nonTestFiles} --declaration --emitDeclarationOnly --outDir dist --moduleResolution node --skipLibCheck --module esnext --target esnext --allowJs false`;
}

console.log('✅ Build complete!');
