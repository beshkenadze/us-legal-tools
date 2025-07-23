#!/usr/bin/env bun

/**
 * Post-generation script to fix orval MCP client type mismatches
 * This script runs after orval generates files to fix naming inconsistencies
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();

// Fix http-schemas/index.ts to export the missing type aliases
function fixHttpSchemasIndex() {
  const indexPath = join(projectRoot, 'src/mcp/http-schemas/index.ts');
  let content = readFileSync(indexPath, 'utf-8');
  
  // Add type aliases for orval MCP client naming inconsistency
  if (!content.includes('PostAlertsBody')) {
    content += '\n// Type aliases for orval MCP client naming inconsistency\n';
    content += "export type { AlertCreate as PostAlertsBody } from './alertCreate';\n";
    content += "export type { RECAPFetchRequest as PostRecapFetchBody } from './rECAPFetchRequest';\n";
    content += "export type { DocketAlertCreate as PostDocketAlertsBody } from './docketAlertCreate';\n";
  }
  
  writeFileSync(indexPath, content);
  console.log('✅ Fixed http-schemas/index.ts type aliases');
}

// Create a global types file to make function signature types available
function createGlobalTypes() {
  const globalTypesPath = join(projectRoot, 'src/mcp/types.d.ts');
  const content = `/**
 * Global type declarations for orval MCP client
 * This file makes the original schema types available for function signatures
 */

// Import types for global declaration
import type { AlertCreate } from './http-schemas/alertCreate';
import type { RECAPFetchRequest } from './http-schemas/rECAPFetchRequest';
import type { DocketAlertCreate } from './http-schemas/docketAlertCreate';

// Make types available globally for generated handlers
declare global {
  type AlertCreate = import('./http-schemas/alertCreate').AlertCreate;
  type RECAPFetchRequest = import('./http-schemas/rECAPFetchRequest').RECAPFetchRequest;
  type DocketAlertCreate = import('./http-schemas/docketAlertCreate').DocketAlertCreate;
}

export {};
`;
  
  writeFileSync(globalTypesPath, content);
  console.log('✅ Created global types declaration file');
}

console.log('🔧 Fixing orval MCP client type mismatches...');
fixHttpSchemasIndex();
createGlobalTypes();
console.log('✅ Type fixes completed!');