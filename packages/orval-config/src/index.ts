import { defineConfig } from 'orval';

export function createOrvalConfig(
  inputFile: string,
  baseUrl: string,
  mutatorPath: string = './src/api/client.ts',
  mutatorName: string = 'customInstance',
) {
  return defineConfig({
    sdk: {
      input: {
        target: inputFile,
      },
      output: {
        mode: 'split',
        allParamsOptional: true,
        target: './src/api/generated/endpoints.ts',
        schemas: './src/api/generated/model',
        mock: false,
        clean: true,
        baseUrl: baseUrl,
        client: 'axios-functions',
        httpClient: 'axios',
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
        workspace: './src/mcp',
        mode: 'single',
        client: 'mcp',
        baseUrl: baseUrl,
        target: './handlers.ts',
        schemas: './http-schemas',
        clean: true,
      },
    },
  });
}
