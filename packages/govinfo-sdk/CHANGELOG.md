# @beshkenadze/govinfo-sdk

## 0.4.1

### Patch Changes

- [`179069e`](https://github.com/beshkenadze/us-legal-tools/commit/179069ecf7ce58d3b17da75497a17fa37a332159) Thanks [@beshkenadze](https://github.com/beshkenadze)! - Fix TypeScript declaration file generation for all packages

  - Resolved missing .d.ts files in published packages
  - Updated build scripts to use bunx tsc for consistent TypeScript versions
  - Fixed tsconfig.build.json configuration for proper declaration generation
  - All packages now include complete TypeScript type definitions

## 0.4.0

### Minor Changes

- [#4](https://github.com/beshkenadze/us-legal-tools/pull/4) [`c8d0749`](https://github.com/beshkenadze/us-legal-tools/commit/c8d0749b85fc7b89ca269953e3a3ea3298f6229c) Thanks [@beshkenadze](https://github.com/beshkenadze)! - fix: resolve TypeScript declaration generation issues

## 0.3.0

### Minor Changes

- [`2510a08`](https://github.com/beshkenadze/us-legal-tools/commit/2510a08f87d35c7cf37ebc6197045d562e34a314) Thanks [@beshkenadze](https://github.com/beshkenadze)! - - Configure Changesets for automated per-package releases
  - Add publishConfig for public npm access to all SDK packages
  - Set up GitHub changelog generation with PR links
  - Ensure each package can be released independently

## 0.2.0

### Minor Changes

- b67400f: Minor version bump for all packages with the following improvements:

  - Fix DOL SDK package name to use @beshkenadze namespace
  - Update npm badges to shields.io for better GitHub compatibility
  - Add missing GovInfo SDK and DOL SDK documentation
  - Update CI workflow to use MCP Inspector with bunx
  - Fix import ordering and linting issues across all packages
  - Add API wrapper functions for e2e tests
  - Improve test reliability and skip tests when API keys are missing
