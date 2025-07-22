---
description: Use Bun instead of Node.js, npm, pnpm, or vite.
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";

// import .css files directly and it works
import './index.css';

import { createRoot } from "react-dom/client";

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.md`.

## Release Workflow

The release workflow for this project follows a testing -> version -> tag -> release pattern:

### 1. Testing Phase

Before releasing, ensure all tests pass:

```bash
# Run all tests
bun test

# Run specific test suites
bun test src/api/client.test.ts
bun test src/mcp/handlers.test.ts

# Run integration tests
SKIP_INTEGRATION_TESTS=false bun test src

# Run e2e tests
SKIP_E2E_TESTS=false bun test tests/e2e
```

### 2. Version Update

Use Bun's version command to update the package version:

```bash
# Patch release (1.0.0 -> 1.0.1)
bun version patch

# Minor release (1.0.0 -> 1.1.0)
bun version minor

# Major release (1.0.0 -> 2.0.0)
bun version major

# Pre-release versions
bun version prerelease --preid=alpha  # 1.0.0 -> 1.0.1-alpha.0
bun version prerelease --preid=beta   # 1.0.0 -> 1.0.1-beta.0
```

This command will:
- Update the version in package.json
- Run the `version` script (builds the project)
- Create a git commit with the version change
- Create a git tag (e.g., v1.0.1)

### 3. Push Changes and Tag

After versioning, push the changes and tag to trigger the release:

```bash
# Push changes and tags (done automatically by postversion script)
git push && git push --tags

# Or manually push a specific tag
git push origin v1.0.1
```

### 4. Automated Release Process

Once the tag is pushed, the GitHub Actions release workflow automatically:

1. **Installs dependencies** - Sets up Bun and installs packages
2. **Downloads OpenAPI spec** - Uses Playwright to fetch the latest eCFR API spec
3. **Generates SDK** - Runs orval to generate TypeScript code
4. **Runs tests** - Executes the test suite to ensure quality
5. **Builds the package** - Creates distribution files
6. **Creates GitHub Release** - Publishes release notes
7. **Publishes to NPM** - Makes the package available on npm registry
8. **Publishes to GitHub Packages** - Also publishes to GitHub's package registry

### Important Notes

- **Always run tests before releasing** - The release workflow will fail if tests don't pass
- **Version in package.json must match the tag** - The workflow uses the package.json version
- **Semantic versioning** - Follow semver conventions for version numbers
- **Release notes** - Are automatically generated but can be edited on GitHub after release
- **Rollback** - If a release fails, delete the tag and fix issues before retrying

### Manual Release (if needed)

If you need to manually publish:

```bash
# Ensure you're logged in to npm
npm login

# Publish to npm
npm publish --access public

# For GitHub Packages, ensure you have a .npmrc file
echo "@beshkenadze:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc

# Then publish
npm publish --registry=https://npm.pkg.github.com
```

### Troubleshooting Releases

- **Tag already exists**: Delete the tag with `git tag -d v1.0.1` and `git push origin :refs/tags/v1.0.1`
- **NPM publish fails**: Check your NPM_TOKEN secret in GitHub settings
- **Tests fail in CI**: Run tests locally with the same environment to debug
- **Build fails**: Ensure all generated files are properly excluded from TypeScript build

## Project-Specific Commands

When working on this eCFR SDK project:

### Development Commands
- `bun run dev` - Start development server
- `bun run generate` - Regenerate SDK from OpenAPI spec
- `bun run format` - Format code with Biome
- `bun run lint` - Lint code with Biome
- `bun run check` - Run all checks (format + lint)

### Testing Commands
- `bun test` - Run all tests
- `bun test:watch` - Run tests in watch mode
- `bun test:integration` - Run integration tests
- `bun test:e2e` - Run end-to-end tests

### Build Commands
- `bun run build` - Build the complete SDK
- `bun run build:clean` - Clean build directory
- `bun run build:js` - Build JavaScript files
- `bun run build:types` - Generate TypeScript declarations

### MCP Server Commands
- `bun run mcp:server` - Run MCP server locally
- `bun run docker:build` - Build Docker image
- `bun run docker:run` - Run Docker container

## Coding Principles

- It's forbidden to change files with header like `Generated by` & `Do not edit manually`