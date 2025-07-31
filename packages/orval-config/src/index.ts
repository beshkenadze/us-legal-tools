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
        workspace: './src/api',
        mode: 'split',
        allParamsOptional: true,
        target: './endpoints.ts',
        schemas: './model',
        mock: true,
        clean: true,
        baseUrl: baseUrl,
        client: 'axios-functions',
        httpClient: 'axios',
        prettier: false,
        indexFiles: true,
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
        indexFiles: true,
      },
    },
  });
}
