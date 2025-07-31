#!/usr/bin/env bun

import { $ } from 'bun';

console.log('Building GovInfo SDK...');

// Clean dist directory
await $`rm -rf dist`;

// Build ESM format
console.log('Building ESM...');
await Bun.build({
  entrypoints: ['./src/index.ts'],
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
  entrypoints: ['./src/index.ts'],
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
await $`bunx tsc --emitDeclarationOnly --declaration --outDir dist --project tsconfig.build.json`;

console.log('✅ Build complete!');
