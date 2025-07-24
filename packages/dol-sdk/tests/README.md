# DOL SDK Tests

This directory contains end-to-end (e2e) tests for the Department of Labor (DOL) SDK.

## Prerequisites

1. **DOL API Key**: You need to register at https://dataportal.dol.gov/registration to get an API key.

2. **Environment Setup**: Add your API key to the `.env` file in the project root:
   ```
   DOL_API_KEY=your_api_key_here
   ```

## Running Tests

### Run all tests
```bash
bun test
```

### Run only e2e tests
```bash
bun test:e2e
```

Or if you don't have the API key in .env:
```bash
DOL_API_KEY=your_api_key bun test:e2e
```

### Run specific test
```bash
bun test tests/e2e/api.e2e.test.ts -t "should list all available datasets"
```

## Test Structure

The e2e tests cover:

1. **Datasets API** - Lists available datasets (no API key required)
2. **Data Retrieval API** - Fetches data from specific datasets
3. **Metadata API** - Retrieves dataset metadata
4. **API Key Authentication** - Validates API key usage
5. **Complex Queries** - Tests filtering, sorting, and pagination

## Important Notes

- The `/datasets` endpoint does NOT require an API key
- All other endpoints require the API key as a query parameter: `?X-API-KEY=your_key`
- Rate limits apply: up to 5MB of data or 10,000 records per request
- You may encounter 429 (rate limit) errors if running tests too frequently

## Troubleshooting

### "DOL_API_KEY not set" warning
- Ensure your `.env` file contains the `DOL_API_KEY` variable
- Make sure you're in the correct directory when running tests
- Bun should automatically load .env files from the project root

### 401 Unauthorized errors
- Verify your API key is valid
- Check that the API key is being passed as a query parameter, not a header

### 500 Server errors
- Some dataset names may have changed or be temporarily unavailable
- Check the available datasets using the `/datasets` endpoint first

### 429 Rate limit errors
- Wait a few minutes before running tests again
- The DOL API has rate limiting in place to prevent abuse