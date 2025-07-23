#!/usr/bin/env bun

/**
 * Post-generation script to fix orval MCP client type mismatches for GovInfo SDK
 * This script runs after orval generates files to fix naming inconsistencies
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();

// Fix handlers.ts to correct import names
function fixHandlersImports() {
  const handlersPath = join(projectRoot, 'src/mcp/handlers.ts');
  let content = readFileSync(handlersPath, 'utf-8');
  
  // Fix SearchBody -> SearchRequest
  content = content.replace('SearchBody,', 'SearchRequest,');
  content = content.replace('bodyParams: SearchRequest', 'bodyParams: SearchRequest');
  
  writeFileSync(handlersPath, content);
  console.log('✅ Fixed handlers.ts imports');
}

// Fix http-schemas/index.ts to add global type declarations  
function fixHttpSchemasIndex() {
  const indexPath = join(projectRoot, 'src/mcp/http-schemas/index.ts');
  let content = readFileSync(indexPath, 'utf-8');
  
  // Add global type declarations for GovInfo SDK types
  // This will need to be updated once we know what types are generated
  if (!content.includes('declare global')) {
    content += '\n// Global type declarations for orval MCP client\n';
    content += 'declare global {\n';
    // TODO: Add specific GovInfo types here after generation
    content += '  // GovInfo-specific type declarations will be added here\n';
    content += '}\n';
  }
  
  writeFileSync(indexPath, content);
  console.log('✅ Fixed http-schemas/index.ts with global type declarations');
}

console.log('🔧 Fixing GovInfo orval MCP client type mismatches...');
fixHandlersImports();
fixHttpSchemasIndex();
console.log('✅ Type fixes completed!');