---
name: "Bug report 🐛"
about: MCP generator creates incorrect import for request body schemas
title: "[BUG] MCP generator imports '{OperationName}Body' instead of actual schema name from OpenAPI spec"
labels: bug, mcp
assignees: ''

---

## Describe the bug
The MCP generator enforces a strict naming convention for request body schemas, expecting them to follow a `{OperationName}Body` pattern when generating imports. However, it then uses the actual schema name from the OpenAPI spec in the type definition. This causes TypeScript compilation errors when the actual schema name doesn't match the expected pattern.

While this pattern works for query parameters (which often do follow the `{OperationName}Params` convention), it's too restrictive for request bodies where schemas might have domain-specific names like `SearchRequest`, `CreateUserRequest`, `UpdateOrderPayload`, etc.

### What are the steps to reproduce this issue?

1. Create an OpenAPI spec with a POST operation that has a request body referencing a schema that doesn't follow the `{OperationName}Body` pattern:
```yaml
paths:
  /search:
    post:
      operationId: search
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/SearchRequest"  # Note: Not "SearchBody"
```

2. Configure Orval to generate MCP client:
```typescript
export default defineConfig({
  'govinfo-mcp': {
    input: './openapi.json',
    output: {
      mode: 'single',
      client: 'mcp',
      target: './src/mcp/handlers.ts',
      schemas: './src/mcp/http-schemas',
    },
  },
});
```

3. Run orval to generate the code
4. Observe the generated `handlers.ts` file

### What happens?
The generated code imports `SearchBody` (which doesn't exist) but uses `SearchRequest` in the type:

```typescript
import {
  SearchBody,  // ❌ This import doesn't exist
  // ...
} from './http-schemas';

export type searchArgs = {
  bodyParams: SearchRequest;  // ✅ Uses correct schema name
}
```

### What were you expecting to happen?
The import should use the actual schema name from the OpenAPI spec:

```typescript
import {
  SearchRequest,  // ✅ Should import the actual schema name
  // ...
} from './http-schemas';

export type searchArgs = {
  bodyParams: SearchRequest;  // ✅ Uses correct schema name
}
```

### What versions are you using?
- **Orval version**: 7.10.0
- **Node.js version**: 20.10.0
- **TypeScript version**: 5.6.2
- **Operating System**: macOS

### Code Analysis
The bug is in the Orval source code at `packages/mcp/src/index.ts`:

**Line 63** in `getMcpHeader` function:
```typescript
if (verbOption.body.definition) {
  imports.push(`${pascalOperationName}Body`);  // ❌ Hardcoded "Body" suffix
}
```

**Line 115** in `generateMcp` function uses the actual definition:
```typescript
if (verbOption.body.definition) {
  handlerArgsTypes.push(`  bodyParams: ${verbOption.body.definition};`);  // ✅ Uses actual schema name
}
```

**Line 180** in `generateServer` function also hardcodes the Body suffix:
```typescript
if (verbOption.body.definition)
  imputSchemaTypes.push(`  bodyParams: ${verbOption.operationName}Body`);  // ❌ Hardcoded "Body" suffix
```

**Line 205** in `generateServer` function for imports:
```typescript
if (verbOption.body.definition)
  imports.push(`  ${verbOption.operationName}Body`);  // ❌ Hardcoded "Body" suffix
```

### Suggested Fix
All occurrences should use the actual schema name from `verbOption.body.definition` instead of constructing an artificial name:

1. **Line 63** in `getMcpHeader`:
```typescript
if (verbOption.body.definition) {
  imports.push(verbOption.body.definition);  // Use actual schema name
}
```

2. **Line 180** in `generateServer`:
```typescript
if (verbOption.body.definition)
  imputSchemaTypes.push(`  bodyParams: ${verbOption.body.definition}`);  // Use actual schema name
```

3. **Line 205** in `generateServer`:
```typescript
if (verbOption.body.definition)
  imports.push(`  ${verbOption.body.definition}`);  // Use actual schema name
```

### Additional context
- This issue only affects the MCP client generator
- Other client generators (axios, fetch, etc.) correctly handle request body schema names
- The issue causes TypeScript compilation errors due to missing imports
- According to OpenAPI best practices:
  - The [OpenAPI Specification v3.1.0](https://spec.openapis.org/oas/v3.1.0) does not mandate specific naming conventions for request body schemas
  - [Watson Developer Cloud API Guidelines](https://github.com/watson-developer-cloud/api-guidelines/blob/master/swagger-coding-style.md) state: "Elements should always start with an upper-case letter" but don't require specific suffixes
  - [Network.nt OpenAPI Best Practices](https://www.networknt.com/development/best-practices/openapi3/) recommends: "schemas be defined globally in the components/schemas section with unique names" without mandating suffix patterns
  - Common patterns in practice include `{Operation}Request`, `{Operation}Payload`, `{Resource}Input`, or simply `{Resource}` - not just `{Operation}Body`
- The MCP generator's rigid assumption of a `{OperationName}Body` pattern doesn't align with the flexibility allowed by the OpenAPI specification