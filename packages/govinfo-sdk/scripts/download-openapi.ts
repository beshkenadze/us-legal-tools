#!/usr/bin/env bun

import { writeFile } from 'node:fs/promises';

async function downloadOpenAPISpec() {
  console.log('📥 Downloading GovInfo OpenAPI specification...');
  
  try {
    const response = await fetch('https://api.govinfo.gov/api-docs');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const spec = await response.json();
    
    // Fix apostrophes in descriptions to prevent syntax errors in generated code
    const fixApostrophes = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.replace(/'/g, "\\'");
      }
      if (Array.isArray(obj)) {
        return obj.map(fixApostrophes);
      }
      if (obj && typeof obj === 'object') {
        const fixed: any = {};
        for (const [key, value] of Object.entries(obj)) {
          fixed[key] = fixApostrophes(value);
        }
        return fixed;
      }
      return obj;
    };
    
    const fixedSpec = fixApostrophes(spec);
    
    // Write the spec to a file
    await writeFile('./openapi.json', JSON.stringify(fixedSpec, null, 2));
    
    console.log('✅ OpenAPI specification downloaded successfully');
    console.log(`📄 Spec title: ${spec.info?.title}`);
    console.log(`📦 Version: ${spec.info?.version}`);
    console.log(`🔗 Servers: ${spec.servers?.map((s: any) => s.url).join(', ')}`);
    
  } catch (error) {
    console.error('❌ Failed to download OpenAPI specification:', error);
    process.exit(1);
  }
}

downloadOpenAPISpec();