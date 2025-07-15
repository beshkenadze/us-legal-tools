#!/usr/bin/env bun

import fs from 'node:fs/promises';
import path from 'node:path';
import converter from 'swagger2openapi';

const INPUT_FILE = path.join(process.cwd(), 'docs', 'v1.json');
const OUTPUT_FILE = path.join(process.cwd(), 'docs', 'v1-openapi3.json');

async function fixAndConvert() {
  try {
    console.log('📝 Reading Swagger 2.0 file...');
    
    const swaggerContent = await fs.readFile(INPUT_FILE, 'utf-8');
    const swagger2 = JSON.parse(swaggerContent);
    
    console.log('🔧 Fixing common issues...');
    
    // Fix common issues in the swagger file
    if (swagger2.paths) {
      for (const [pathKey, pathValue] of Object.entries(swagger2.paths)) {
        for (const [method, operation] of Object.entries(pathValue)) {
          if (typeof operation === 'object' && operation !== null) {
            // Fix parameters
            if (operation.parameters) {
              operation.parameters = operation.parameters.map((param: any) => {
                // Skip if it's a reference
                if (param.$ref) {
                  return param;
                }
                
                // Fix missing schema for non-body parameters
                if (param.type && !param.schema && param.in !== 'body') {
                  const { type, format, enum: enumValues, ...rest } = param;
                  return {
                    ...rest,
                    schema: {
                      type,
                      ...(format && { format }),
                      ...(enumValues && { enum: enumValues }),
                    },
                  };
                }
                
                return param;
              });
            }
            
            // Fix responses
            if (operation.responses) {
              for (const [statusCode, response] of Object.entries(operation.responses)) {
                if (typeof response === 'object' && response !== null && !response.$ref) {
                  // Fix invalid headers
                  if (response.headers) {
                    const fixedHeaders: any = {};
                    for (const [headerName, headerValue] of Object.entries(response.headers)) {
                      if (typeof headerValue === 'string') {
                        // Convert string header to proper format
                        fixedHeaders[headerName] = {
                          schema: {
                            type: 'string',
                            default: headerValue,
                          },
                        };
                      } else if (typeof headerValue === 'object' && headerValue !== null) {
                        // Ensure header has proper schema
                        if (!headerValue.schema && headerValue.type) {
                          const { type, format, ...rest } = headerValue;
                          fixedHeaders[headerName] = {
                            ...rest,
                            schema: {
                              type,
                              ...(format && { format }),
                            },
                          };
                        } else {
                          fixedHeaders[headerName] = headerValue;
                        }
                      }
                    }
                    response.headers = fixedHeaders;
                  }
                  
                  // Ensure description exists
                  if (!response.description) {
                    response.description = `Response ${statusCode}`;
                  }
                }
              }
            }
          }
        }
      }
    }
    
    // Ensure all required fields exist
    if (!swagger2.info) {
      swagger2.info = { title: 'eCFR API', version: '1.0.0' };
    }
    
    console.log('🔄 Converting to OpenAPI 3.0...');
    
    // Convert to OpenAPI 3.0
    const options = {
      patch: true,
      warnOnly: true,
      refSiblings: 'preserve',
    };
    
    const result = await converter.convertObj(swagger2, options);
    
    if (result.openapi) {
      // Additional fixes for OpenAPI 3.0
      const openapi3 = result.openapi;
      
      // Save the converted file
      await fs.writeFile(OUTPUT_FILE, JSON.stringify(openapi3, null, 2));
      
      console.log('\n✅ Conversion successful!');
      console.log(`📁 OpenAPI 3.0 saved to: ${OUTPUT_FILE}`);
      
      if (result.warnings && result.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        result.warnings.forEach((warning: any) => {
          console.log(`  - ${warning}`);
        });
      }
    } else {
      throw new Error('Conversion failed - no OpenAPI output');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixAndConvert();