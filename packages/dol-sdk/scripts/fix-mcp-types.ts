#!/usr/bin/env bun

/**
 * Post-generation script to fix orval MCP client type mismatches for DOL SDK
 * This script runs after orval generates files to fix duplicate type declarations
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();

// Fix http-client.ts to remove duplicate type declarations
function fixHttpClient() {
  const httpClientPath = join(projectRoot, 'src/mcp/http-client.ts');
  let content = readFileSync(httpClientPath, 'utf-8');
  
  // Fix duplicate response type declarations
  // Remove the second occurrence of duplicate type declarations
  const duplicatePatterns = [
    /export type getGetAgencyEndpointFormatResponse200 = \{\s*data: string\s*status: 200\s*\}/g,
    /export type getGetAgencyEndpointFormatMetadataResponse200 = \{\s*data: string\s*status: 200\s*\}/g,
  ];
  
  duplicatePatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches && matches.length > 1) {
      // Keep the first occurrence, remove the rest
      const firstMatch = matches[0];
      let firstIndex = content.indexOf(firstMatch);
      let searchFrom = firstIndex + firstMatch.length;
      
      while (true) {
        const nextIndex = content.indexOf(firstMatch, searchFrom);
        if (nextIndex === -1) break;
        
        // Remove the duplicate declaration
        content = content.slice(0, nextIndex) + content.slice(nextIndex + firstMatch.length);
      }
    }
  });
  
  // Alternative approach: Use regex to find and remove duplicates more precisely
  content = content.replace(
    /export type getGetAgencyEndpointFormatResponse200 = \{\s*data: string\s*status: 200\s*\}/g,
    ''
  );
  
  content = content.replace(
    /export type getGetAgencyEndpointFormatMetadataResponse200 = \{\s*data: string\s*status: 200\s*\}/g,
    ''
  );
  
  // Fix the composite types that might have duplicate references
  content = content.replace(
    /getGetAgencyEndpointFormatResponse200 \| getGetAgencyEndpointFormatResponse200/g,
    'getGetAgencyEndpointFormatResponse200'
  );
  
  content = content.replace(
    /getGetAgencyEndpointFormatMetadataResponse200 \| getGetAgencyEndpointFormatMetadataResponse200/g,
    'getGetAgencyEndpointFormatMetadataResponse200'
  );
  
  writeFileSync(httpClientPath, content);
  console.log('✅ Fixed http-client.ts duplicate type declarations');
}

console.log('🔧 Fixing DOL orval MCP client type mismatches...');
fixHttpClient();
console.log('✅ Type fixes completed!');