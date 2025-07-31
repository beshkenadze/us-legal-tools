export function createOrvalConfig(
  inputFile: string,
  baseUrl: string,
  mutatorPath: string = "./src/api/client.ts",
  mutatorName: string = "customInstance"
) {
  return {
    sdk: {
      input: {
        target: inputFile,
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
        baseUrl: baseUrl,
        client: "axios-functions",
        httpClient: "axios",
        prettier: false,
        override: {
          mutator: {
            path: mutatorPath,
            name: mutatorName,
          },
        },
      },
    },
    mcp: {
      input: {
        target: inputFile,
      },
      output: {
        mode: "single",
        client: "mcp",
        baseUrl: baseUrl,
        target: "./src/mcp/handlers.ts",
        schemas: "./src/mcp/http-schemas",
        clean: true,
      },
    },
  };
}