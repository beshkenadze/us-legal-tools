import { defineConfig } from "orval";

export default defineConfig({
  sdk: {
    input: "./openapi.json",
    output: {
      mode: "split",
      target: "./src/api/generated/endpoints.ts",
      schemas: "./src/api/generated/model",
      client: "axios-functions",
      httpClient: "axios",
      mock: true,
      clean: true,
      docs: {
        out: "./docs",
        disableSources: true,
      },
      prettier: false,
      override: {
        operations: {
          Document: {
            mutator: {
              path: "./src/api/client.ts",
              name: "customInstance",
            },
          },
        },
        mutator: {
          path: "./src/api/client.ts",
          name: "customInstance",
        },
      },
    },
  },
  mcp: {
    input: "./openapi.json",
    output: {
      mode: "single",
      client: "mcp",
      baseUrl: "https://api.govinfo.gov",
      target: "./src/mcp/handlers.ts",
      schemas: "./src/mcp/http-schemas",
      clean: true,
    },
  },
});
