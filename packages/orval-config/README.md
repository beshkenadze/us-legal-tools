# @us-legal-tools/orval-config

Shared Orval and TypeScript configurations for US Legal Tools SDK packages.

## Installation

```bash
bun add -D @us-legal-tools/orval-config
```

## Usage

### Orval Configuration

Create an `orval.config.ts` file in your package:

```typescript
import { defineConfig } from "orval";
import { createOrvalConfig } from "@us-legal-tools/orval-config";

export default defineConfig(
  createOrvalConfig(
    {
      // SDK configuration
      input: "./openapi.json",
      baseUrl: "https://api.example.com",
      mutator: {
        path: "./src/api/client.ts",
        name: "customInstance",
      },
    },
    {
      // MCP configuration
      input: "./openapi.json",
      baseUrl: "https://api.example.com",
    }
  )
);
```

### TypeScript Configuration

Extend the shared TypeScript configurations in your package:

**tsconfig.json:**
```json
{
  "extends": "@us-legal-tools/orval-config/tsconfig.sdk.json"
}
```

**tsconfig.build.json:**
```json
{
  "extends": "@us-legal-tools/orval-config/tsconfig.build.json"
}
```

**tsconfig.mcp.json:**
```json
{
  "extends": "@us-legal-tools/orval-config/tsconfig.mcp.json"
}
```

**typedoc.json:**
```json
{
  "extends": "@us-legal-tools/orval-config/typedoc.json"
}
```

## Configuration Files

- `tsconfig.sdk.json` - Main TypeScript configuration for SDK packages
- `tsconfig.build.json` - Build-specific TypeScript configuration
- `tsconfig.mcp.json` - MCP server TypeScript configuration
- `typedoc.json` - TypeDoc documentation configuration