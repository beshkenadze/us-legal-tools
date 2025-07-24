#!/usr/bin/env bun

/**
 * Script to fix the DOL OpenAPI spec by creating separate endpoints for each format
 * This eliminates duplicate type generation issues in Orval
 */

import { readFileSync, writeFileSync } from 'fs';
import { load, dump } from 'js-yaml';
import { join } from 'path';

const specPath = join(process.cwd(), 'openapi-v4.yaml');
const spec = load(readFileSync(specPath, 'utf-8')) as any;

console.log('🔧 Fixing DOL OpenAPI spec...');

// Create separate endpoints for each format
const dataEndpoint = spec.paths['/get/{agency}/{endpoint}/{format}'];
const metadataEndpoint = spec.paths['/get/{agency}/{endpoint}/{format}/metadata'];

// Delete the original endpoints
delete spec.paths['/get/{agency}/{endpoint}/{format}'];
delete spec.paths['/get/{agency}/{endpoint}/{format}/metadata'];

// Create new endpoints for each format
const formats = ['json', 'xml', 'csv'];

formats.forEach(format => {
  // Data endpoints
  const dataPath = `/get/{agency}/{endpoint}/${format}`;
  spec.paths[dataPath] = JSON.parse(JSON.stringify(dataEndpoint));
  
  // Remove the format parameter since it's now in the path
  if (spec.paths[dataPath].get.parameters) {
    spec.paths[dataPath].get.parameters = spec.paths[dataPath].get.parameters.filter(
      (param: any) => {
        if (typeof param === 'string') return true;
        return param.name !== 'format';
      }
    );
  }
  
  // Set specific operationId
  spec.paths[dataPath].get.operationId = `getAgencyEndpointData${format.charAt(0).toUpperCase() + format.slice(1)}`;
  
  // Keep only the relevant content type
  const responses = spec.paths[dataPath].get.responses['200'];
  if (responses && responses.content) {
    const newContent: any = {};
    if (format === 'json' && responses.content['application/json']) {
      newContent['application/json'] = responses.content['application/json'];
    } else if (format === 'xml' && responses.content['application/xml']) {
      newContent['application/xml'] = responses.content['application/xml'];
    } else if (format === 'csv' && responses.content['text/csv']) {
      newContent['text/csv'] = responses.content['text/csv'];
    }
    responses.content = newContent;
  }
});

// Handle metadata endpoints (only json and csv)
['json', 'csv'].forEach(format => {
  const metadataPath = `/get/{agency}/{endpoint}/${format}/metadata`;
  spec.paths[metadataPath] = JSON.parse(JSON.stringify(metadataEndpoint));
  
  // Remove the format parameter
  if (spec.paths[metadataPath].get.parameters) {
    spec.paths[metadataPath].get.parameters = spec.paths[metadataPath].get.parameters.filter(
      (param: any) => {
        if (typeof param === 'string') return true;
        return param.name !== 'format';
      }
    );
  }
  
  // Set specific operationId
  spec.paths[metadataPath].get.operationId = `getAgencyEndpointMetadata${format.charAt(0).toUpperCase() + format.slice(1)}`;
  
  // Keep only the relevant content type
  const responses = spec.paths[metadataPath].get.responses['200'];
  if (responses && responses.content) {
    const newContent: any = {};
    if (format === 'json' && responses.content['application/json']) {
      newContent['application/json'] = responses.content['application/json'];
    } else if (format === 'csv' && responses.content['text/csv']) {
      newContent['text/csv'] = responses.content['text/csv'];
    }
    responses.content = newContent;
  }
});

// Remove the Format parameter from components since it's no longer needed
if (spec.components?.parameters?.Format) {
  delete spec.components.parameters.Format;
}

// Write the fixed spec
const fixedYaml = dump(spec, {
  lineWidth: -1,
  noRefs: true,
  sortKeys: false,
});

writeFileSync(specPath, fixedYaml);

console.log('✅ OpenAPI spec fixed! Separate endpoints created for each format.');
console.log('📝 Changes made:');
console.log('   - /get/{agency}/{endpoint}/json');
console.log('   - /get/{agency}/{endpoint}/xml');
console.log('   - /get/{agency}/{endpoint}/csv');
console.log('   - /get/{agency}/{endpoint}/json/metadata');
console.log('   - /get/{agency}/{endpoint}/csv/metadata');