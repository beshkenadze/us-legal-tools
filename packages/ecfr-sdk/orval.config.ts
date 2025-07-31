import { defineConfig } from "orval";

export default defineConfig({
  sdk: {
    input: {
      target: "./v1-openapi3.json",
    },
    output: {
      mode: "split",
      allParamsOptional: true,
      target: "./src/api/generated/endpoints.ts",
      schemas: "./src/api/generated/model",
      mock: true,
      clean: true,
      docs: {
        out: "./docs",
        disableSources: true,
      },
      baseUrl: "https://www.ecfr.gov",
      client: "axios-functions",
      httpClient: "axios",
      prettier: false,
      override: {
        mutator: {
          path: "./src/api/client.ts",
          name: "customInstance",
        },
      },
    },
  },
  mcp: {
    input: {
      target: "./v1-openapi3.json",
    },
    output: {
      mode: "single",
      client: "mcp",
      baseUrl: "https://www.ecfr.gov",
      target: "./src/mcp/handlers.ts",
      schemas: "./src/mcp/http-schemas",
      clean: true,
    },
  },
});
