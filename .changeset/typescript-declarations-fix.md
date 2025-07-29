---
"@beshkenadze/ecfr-sdk": patch
"@beshkenadze/federal-register-sdk": patch
"@beshkenadze/courtlistener-sdk": patch
"@beshkenadze/govinfo-sdk": patch
"@beshkenadze/dol-sdk": patch
---

Fix TypeScript declaration file generation for all packages

- Resolved missing .d.ts files in published packages
- Updated build scripts to use bunx tsc for consistent TypeScript versions
- Fixed tsconfig.build.json configuration for proper declaration generation
- All packages now include complete TypeScript type definitions