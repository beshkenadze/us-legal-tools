#!/usr/bin/env bun

/**
 * Post-generation script to fix orval MCP client type mismatches for Federal Register SDK
 * This script runs after orval generates files to fix naming inconsistencies
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();

// Fix http-schemas/index.ts to add global type declarations  
function fixHttpSchemasIndex() {
  const indexPath = join(projectRoot, 'src/mcp/http-schemas/index.ts');
  let content = readFileSync(indexPath, 'utf-8');
  
  // Add global type declarations for Federal Register SDK types
  if (!content.includes('declare global')) {
    content += '\n// Global type declarations for orval MCP client\n';
    content += 'declare global {\n';
    content += '  type Format = typeof import("./format").Format[keyof typeof import("./format").Format];\n';
    content += '  type Facet = typeof import("./facet").Facet[keyof typeof import("./facet").Facet];\n';
    content += '  type Agency = import("./agency").Agency;\n';
    content += '  type SuggestedSearch = typeof import("./suggestedSearch").SuggestedSearch[keyof typeof import("./suggestedSearch").SuggestedSearch];\n';
    content += '}\n';
  }
  
  writeFileSync(indexPath, content);
  console.log('✅ Fixed http-schemas/index.ts with global type declarations');
}

console.log('🔧 Fixing Federal Register orval MCP client type mismatches...');
fixHttpSchemasIndex();
console.log('✅ Type fixes completed!');