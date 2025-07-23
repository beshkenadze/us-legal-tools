# Scalar UI - API Documentation Hub

Interactive API documentation for US Legal Tools SDKs using Scalar.

## Overview

This package provides a unified interface to view and interact with API documentation for all US Legal Tools SDKs:

- **eCFR API** - Electronic Code of Federal Regulations
- **DOL API** - Department of Labor data and statistics
- **Federal Register API** - Federal agency documents and notices
- **GovInfo API** - Government publications and documents
- **CourtListener API** - Legal documents and case law

## Development

### Prerequisites

- Bun runtime
- Local OpenAPI/Swagger specification files

### Installation

```bash
bun install
```

### Running the Server

```bash
bun run dev
```

The server will start on http://localhost:3000 by default.

### Available Routes

- `/` - Home page with links to all API documentation
- `/ecfr` - eCFR API documentation
- `/dol` - Department of Labor API documentation
- `/federal-register` - Federal Register API documentation
- `/govinfo` - GovInfo API documentation
- `/courtlistener` - CourtListener API documentation
- `/health` - Health check endpoint

### Configuration

API configurations are defined in `src/api-configs.ts`. Each API can be configured with:

- `name` - Display name for the API
- `path` - URL path for the documentation
- `specUrl` - Remote URL for the OpenAPI spec (optional)
- `specPath` - Local path to the OpenAPI spec file (optional)
- `theme` - Scalar theme color
- `description` - Brief description of the API

### Building for Production

```bash
bun run build
bun run start
```

### Environment Variables

- `PORT` - Server port (default: 3000)

## Features

- **Interactive Documentation** - Powered by Scalar's modern UI
- **Try It Out** - Test API endpoints directly from the documentation
- **Multiple Themes** - Each API has its own color theme
- **Local Spec Files** - Serves OpenAPI specs from local files
- **Responsive Design** - Works on desktop and mobile devices

## Adding New APIs

1. Add the OpenAPI specification file to the appropriate SDK package
2. Update `src/api-configs.ts` with the new API configuration
3. Restart the server to see the changes

## Troubleshooting

### Spec File Not Found

Ensure that the OpenAPI specification files exist at the paths specified in `api-configs.ts`. The paths are relative to the scalar-ui package directory.

### YAML Parsing Errors

The server automatically detects and serves YAML files with the correct content type. If you encounter parsing errors, validate your OpenAPI spec using tools like [Swagger Editor](https://editor.swagger.io/).

## Docker Deployment

### Build and Run with Docker

```bash
# Build the image
docker build -t scalar-ui -f packages/scalar-ui/Dockerfile .

# Run the container
docker run -p 3000:3000 scalar-ui
```

### Using Docker Compose

```bash
# From the scalar-ui directory
docker-compose up

# Or build and run
docker-compose up --build
```

## Integration Examples

Check the `src/examples` directory for integration examples:

- `dynamic-config.ts` - Example of dynamic configuration with Hono

## API Specifications

The package expects OpenAPI/Swagger specifications to be available at these locations:

- **eCFR**: `../ecfr-sdk/docs/v1-openapi3.json`
- **DOL**: `../dol-sdk/openapi-v4.yaml`
- **Federal Register**: `../federal-register-sdk/openapi.json`
- **GovInfo**: `../govinfo-sdk/openapi.json`
- **CourtListener**: `../courtlistener-sdk/courtlistener-openapi.json`

Make sure these files exist or update the paths in `src/api-configs.ts`.

## License

Part of the US Legal Tools project.