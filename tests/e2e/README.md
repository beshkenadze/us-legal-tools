# E2E Tests for eCFR SDK

This directory contains end-to-end tests for the eCFR SDK, verifying the complete integration from API calls through the MCP server.

## Test Structure

### `api.e2e.test.ts`
Tests the eCFR API endpoints directly through the SDK:
- **Admin Service**: Agencies, Corrections
- **Search Service**: Search results, counts, suggestions
- **Versioner Service**: Titles, versions, structure, ancestry
- **Error Handling**: Invalid inputs, edge cases
- **Data Consistency**: Cross-endpoint validation

### `mcp-server.e2e.test.ts`
Tests the MCP server functionality:
- **Server Lifecycle**: Initialization, tool listing
- **Tool Execution**: All MCP tools with various parameters
- **Complex Workflows**: Sequential tool calls, multiple parameter types
- **Error Handling**: Invalid methods, missing parameters

### `full-integration.e2e.test.ts`
Tests the complete SDK to MCP integration:
- **SDK to MCP Handler**: Data flow from API to handler formatting
- **Complex Queries**: Date ranges, hierarchical navigation
- **Real-World Use Cases**: Finding regulations, tracking changes
- **Performance**: Pagination, large result sets

## Running E2E Tests

```bash
# Run all E2E tests
bun run test:e2e

# Run specific E2E test suites
bun run test:e2e:api    # API endpoint tests
bun run test:e2e:mcp    # MCP server tests
bun run test:e2e:full   # Full integration tests

# Run all tests including unit and E2E
bun run test:all
```

## Configuration

E2E tests are skipped by default to speed up development. They require:
- Network connectivity to the eCFR API
- Longer timeouts (30s per test)
- More resources than unit tests

To enable E2E tests:
```bash
SKIP_E2E_TESTS=false bun test tests/e2e
```

## Writing E2E Tests

When adding new E2E tests:

1. **Use realistic scenarios**: Test actual use cases users might encounter
2. **Set appropriate timeouts**: API calls may take time, use 30s timeouts
3. **Handle failures gracefully**: APIs may be down or return different data
4. **Validate thoroughly**: Check structure, types, and relationships
5. **Clean up resources**: Ensure processes are killed in afterAll hooks

## Common Issues

### Timeout Errors
- Increase timeout in test: `}, 60000);`
- Check network connectivity
- Verify API is accessible

### MCP Server Tests Failing
- Ensure no other process is using the MCP server
- Check server startup time in beforeAll
- Verify message parsing in server communication

### Data Validation Failures
- API data may change over time
- Use flexible assertions (e.g., `toBeGreaterThan(0)` instead of exact counts)
- Focus on structure rather than specific values

## CI/CD Integration

For CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run E2E tests
  run: bun run test:e2e
  env:
    SKIP_E2E_TESTS: false
  timeout-minutes: 10
```

## Performance Considerations

- E2E tests make real API calls - be mindful of rate limits
- Tests run in parallel by default - may need to serialize for stability
- Consider caching API responses for faster subsequent runs
- Use smaller datasets (e.g., `per_page: 5`) to reduce load