#!/usr/bin/env bun

import fs from 'node:fs/promises';
import path from 'node:path';
import converter from 'swagger2openapi';

interface SwaggerParameter {
  $ref?: string;
  name?: string;
  in?: string;
  type?: string;
  format?: string;
  enum?: string[];
  schema?: unknown;
  [key: string]: unknown;
}

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
      for (const [_pathKey, pathValue] of Object.entries(swagger2.paths)) {
        for (const [_method, operation] of Object.entries(pathValue)) {
          if (typeof operation === 'object' && operation !== null) {
            // Fix parameters
            if (operation.parameters) {
              operation.parameters = operation.parameters.map((param: SwaggerParameter) => {
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
                    const fixedHeaders: Record<string, unknown> = {};
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

    // Ensure all required fields exist and set proper title
    if (!swagger2.info) {
      swagger2.info = { title: 'eCFR API', version: '1.0.0' };
    }

    // Update the title to be more descriptive for SDK generation
    // Note: Orval appends "Server" to the title for MCP generation, so we use just "eCFR SDK"
    swagger2.info.title = 'eCFR SDK';
    swagger2.info.description =
      swagger2.info.description ||
      'TypeScript SDK and Model Context Protocol server for the Electronic Code of Federal Regulations (eCFR) API';

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

      // Fix OpenAPI 3.0 specific issues
      if (openapi3.paths) {
        for (const [, pathValue] of Object.entries(openapi3.paths)) {
          if (pathValue && typeof pathValue === 'object') {
            for (const [, operation] of Object.entries(pathValue)) {
              if (
                typeof operation === 'object' &&
                operation !== null &&
                'parameters' in operation
              ) {
                const op = operation as Record<string, unknown> & {
                  parameters?: unknown[];
                  responses?: Record<string, unknown>;
                };

                // Fix parameters
                if (op.parameters && Array.isArray(op.parameters)) {
                  op.parameters = op.parameters.map((param: SwaggerParameter) => {
                    // Fix array parameters with conflicting items and schema
                    if (param.items && param.schema) {
                      const { items, ...rest } = param;
                      return {
                        ...rest,
                        schema: {
                          ...param.schema,
                          items: items,
                        },
                      };
                    }

                    // Fix per_page and page parameters - should be integers
                    if (param.name === 'per_page' || param.name === 'page') {
                      return {
                        ...param,
                        schema: {
                          ...param.schema,
                          type: 'integer',
                          ...(param.name === 'per_page' && { minimum: 1, maximum: 1000 }),
                          ...(param.name === 'page' && { minimum: 1 }),
                        },
                      };
                    }

                    return param;
                  });
                }

                // Fix responses with duplicate description fields
                if (op.responses) {
                  for (const [, response] of Object.entries(op.responses)) {
                    if (
                      typeof response === 'object' &&
                      response !== null &&
                      !('$ref' in response)
                    ) {
                      const resp = response as Record<string, unknown>;
                      // Remove duplicate descripton field if it exists
                      if (resp.descripton && resp.description) {
                        delete resp.descripton;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      // Ensure info.version is set
      if (!openapi3.info?.version) {
        openapi3.info = { ...openapi3.info, version: '1.0.0' };
      }

      // Add global Accept header for JSON responses
      if (!openapi3.components) {
        openapi3.components = {};
      }
      
      if (!openapi3.components.parameters) {
        openapi3.components.parameters = {};
      }
      
      // Add Accept header parameter
      openapi3.components.parameters.AcceptHeader = {
        name: 'Accept',
        in: 'header',
        description: 'Media type to request from the server',
        required: false,
        schema: {
          type: 'string',
          default: 'application/json',
          enum: ['application/json']
        }
      };
      
      // Add Accept header to all operations
      if (openapi3.paths) {
        for (const [, pathValue] of Object.entries(openapi3.paths)) {
          if (pathValue && typeof pathValue === 'object') {
            for (const [methodName, operation] of Object.entries(pathValue)) {
              if (
                typeof operation === 'object' &&
                operation !== null &&
                methodName !== 'parameters' &&
                methodName !== 'servers' &&
                methodName !== 'summary' &&
                methodName !== 'description'
              ) {
                const op = operation as Record<string, unknown> & {
                  parameters?: unknown[];
                };
                
                // Initialize parameters array if it doesn't exist
                if (!op.parameters) {
                  op.parameters = [];
                }
                
                // Add reference to Accept header parameter
                const hasAcceptHeader = op.parameters.some((param: any) => 
                  param.name === 'Accept' || param.$ref === '#/components/parameters/AcceptHeader'
                );
                
                if (!hasAcceptHeader) {
                  op.parameters.push({
                    $ref: '#/components/parameters/AcceptHeader'
                  });
                }
              }
            }
          }
        }
      }

      // Save the converted file
      await fs.writeFile(OUTPUT_FILE, JSON.stringify(openapi3, null, 2));

      console.log('\n✅ Conversion successful!');
      console.log(`📁 OpenAPI 3.0 saved to: ${OUTPUT_FILE}`);

      if (result.warnings && result.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        result.warnings.forEach((warning: unknown) => {
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
