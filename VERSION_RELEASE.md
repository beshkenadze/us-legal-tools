# Release Process for Federal Legal APIs Monorepo

This monorepo uses Changesets for automated version management and releases to npm/GitHub Packages.

## Quick Release Steps:

1. **Create a changeset during development:**
   ```bash
   bun changeset
   # Select packages, version type (patch/minor/major), and describe changes
   ```

2. **Commit and push to your feature branch:**
   ```bash
   git add .
   git commit -m "feat: your feature with changeset"
   git push origin feature/your-feature
   ```

3. **Merge PR to main** - This triggers the automated release workflow

4. **Review and merge the "Version Packages" PR** that Changesets creates automatically

## Key Commands:

- `bun changeset` - Create a new changeset
- `bun changeset status` - Check pending changesets
- `bun version-packages` - Update versions locally
- `turbo build` - Build all packages

## Release Types:

- **Automatic**: Merging to main with changesets triggers release workflow
- **Manual**: Use GitHub Actions → Manual Release for forced/prerelease versions

## Version Bumps:

- **patch** (0.0.x): Bug fixes
- **minor** (0.x.0): New features (backward compatible)
- **major** (x.0.0): Breaking changes

## The workflow handles:
- Building and testing all packages
- Publishing to npm with proper dependency order
- Creating GitHub releases and tags
- Publishing to GitHub Packages

No manual version bumping needed - Changesets handles everything automatically!