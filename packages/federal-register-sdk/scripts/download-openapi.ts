#!/usr/bin/env bun

import { writeFile } from "node:fs/promises";

async function downloadOpenAPISpec() {
  console.log("📥 Downloading Federal Register OpenAPI specification...");

  try {
    const response = await fetch(
      "https://www.federalregister.gov/developers/documentation/api/v1.json"
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const spec = await response.json();

    // Fix apostrophes in descriptions to prevent syntax errors in generated code
    const fixApostrophes = (obj: any): any => {
      if (typeof obj === "string") {
        return obj.replace(/'/g, "\\'");
      }
      if (Array.isArray(obj)) {
        return obj.map(fixApostrophes);
      }
      if (obj && typeof obj === "object") {
        const fixed: any = {};
        for (const [key, value] of Object.entries(obj)) {
          fixed[key] = fixApostrophes(value);
        }
        return fixed;
      }
      return obj;
    };

    const fixedSpec = fixApostrophes(spec);
    
    // Fix Agency schema - it's incorrectly defined as an array when used as path param
    if (fixedSpec.components?.schemas?.Agency?.type === 'array') {
      fixedSpec.components.schemas.Agency = {
        type: 'string',
        enum: fixedSpec.components.schemas.Agency.items.enum
      };
    }

    // Fix path parameter schema references for MCP generation
    const fixPathParameterRefs = (spec: any): any => {
      if (!spec.paths) return spec;

      const updatedSpec = JSON.parse(JSON.stringify(spec));
      
      // Get the actual enum values from components
      const formatEnum = spec.components?.schemas?.Format?.enum || ['json', 'csv'];
      const facetEnum = spec.components?.schemas?.Facet?.enum || [];
      
      // For Agency and SuggestedSearch, we'll use string type since they don't have enums
      const agencyType = spec.components?.schemas?.Agency || { type: 'string' };
      const suggestedSearchType = spec.components?.schemas?.SuggestedSearch || { type: 'string' };

      // Process each path
      for (const [path, methods] of Object.entries(updatedSpec.paths)) {
        for (const [method, operation] of Object.entries(methods as any)) {
          if (operation.parameters) {
            operation.parameters = operation.parameters.map((param: any) => {
              // If it's a path parameter with a $ref to Format or Facet, inline the enum
              if (param.in === 'path' && param.schema?.$ref) {
                if (param.schema.$ref === '#/components/schemas/Format') {
                  return {
                    ...param,
                    schema: {
                      type: 'string',
                      enum: formatEnum
                    }
                  };
                } else if (param.schema.$ref === '#/components/schemas/Facet') {
                  return {
                    ...param,
                    schema: {
                      type: 'string',
                      enum: facetEnum
                    }
                  };
                } else if (param.schema.$ref === '#/components/schemas/Agency') {
                  return {
                    ...param,
                    schema: {
                      type: 'string'
                    }
                  };
                } else if (param.schema.$ref === '#/components/schemas/SuggestedSearch') {
                  return {
                    ...param,
                    schema: {
                      type: 'string'
                    }
                  };
                }
              }
              return param;
            });
          }
        }
      }
      
      return updatedSpec;
    };

    const processedSpec = fixPathParameterRefs(fixedSpec);

    // Write the spec to a file
    await writeFile("./openapi.json", JSON.stringify(processedSpec, null, 2));

    console.log("✅ OpenAPI specification downloaded successfully");
    console.log(`📄 Spec title: ${spec.info?.title}`);
    console.log(`📦 Version: ${spec.info?.version}`);
    console.log(
      `🔗 Servers: ${spec.servers?.map((s: any) => s.url).join(", ")}`
    );
  } catch (error) {
    console.error("❌ Failed to download OpenAPI specification:", error);
    process.exit(1);
  }
}

downloadOpenAPISpec();
