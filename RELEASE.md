# Release Strategy

This monorepo uses [Changesets](https://github.com/changesets/changesets) for version management and release automation.

## Release Workflow Overview

### 1. Automatic Releases (Recommended)

The release workflow runs automatically when:
- Changes are pushed to the `main` branch
- The changes affect packages, changesets, or configuration files
- There are pending changesets to release

**Process:**
1. Developers create changesets during development
2. PR merges to main trigger the release workflow
3. Changesets creates a "Version Packages" PR
4. Merging the version PR publishes packages to npm and GitHub Packages

### 2. Manual Releases

Use the manual release workflow when you need to:
- Force a release without changesets
- Release specific packages
- Create prerelease versions

**Trigger via GitHub Actions:**
1. Go to Actions → Manual Release
2. Click "Run workflow"
3. Select release type and packages

### 3. Pull Request Checks

All PRs run:
- Linting and formatting checks
- Unit, integration, and e2e tests
- Build verification
- Changeset requirement check (skipped for chore/docs/ci/build PRs)

## Creating Changesets

### During Development

```bash
# Create a changeset
bun changeset

# Follow the prompts to:
# 1. Select packages to release
# 2. Choose version bump type (patch/minor/major)
# 3. Write a summary of changes
```

### Changeset Types

- **patch**: Bug fixes and minor updates (0.0.x)
- **minor**: New features, backward compatible (0.x.0)
- **major**: Breaking changes (x.0.0)

### Examples

```bash
# Bug fix in ecfr-sdk
bun changeset
# Select: @us-legal-tools/ecfr-sdk
# Type: patch
# Summary: Fix API endpoint URL generation

# New feature across multiple packages
bun changeset
# Select: @us-legal-tools/ecfr-sdk, @us-legal-tools/federal-register-sdk
# Type: minor
# Summary: Add pagination support to search endpoints

# Breaking change
bun changeset
# Select: @us-legal-tools/govinfo-sdk
# Type: major
# Summary: Refactor client API to use async/await pattern
```

## Release Process Best Practices

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/add-new-endpoint

# Make changes
# ... edit files ...

# Create changeset
bun changeset

# Commit everything
git add .
git commit -m "feat: add new endpoint with changeset"

# Push and create PR
git push origin feature/add-new-endpoint
```

### 2. Version Packages PR

When changesets accumulate on main, the workflow creates a "Version Packages" PR that:
- Updates package versions
- Updates changelogs
- Updates dependencies

**Review the PR to ensure:**
- Version bumps are correct
- Changelog entries are clear
- No unexpected changes

### 3. Publishing

Merging the "Version Packages" PR:
1. Publishes packages to npm
2. Creates git tags
3. Publishes to GitHub Packages
4. Creates GitHub releases

## Prerelease Workflow

For testing releases:

```bash
# Create prerelease changeset
bun changeset pre enter beta

# Make changes and create changesets as normal
bun changeset

# Version as prerelease
bun changeset version

# When ready to exit prerelease
bun changeset pre exit
```

## Troubleshooting

### No Release Triggered

Check:
1. Are there pending changesets? Run `bun changeset status`
2. Did the push affect watched paths?
3. Check workflow logs for errors

### Failed Publish

Common issues:
1. **NPM auth**: Verify NPM_TOKEN secret
2. **Build errors**: Check package builds locally
3. **Test failures**: Run tests locally

### Version Conflicts

If versions get out of sync:
```bash
# Reset versions to match npm
bun changeset version --snapshot-prerelease-template=""

# Or manually fix in package.json files
```

## Configuration

### Changeset Config (`.changeset/config.json`)

```json
{
  "$schema": "https://changesets.com/config.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch"
}
```

### Workflow Triggers

- **Automatic**: Push to main with changes in packages/
- **Manual**: Workflow dispatch with options
- **PR Checks**: All pull requests

## Package Publishing Order

Packages are published in dependency order:
1. Packages with no dependencies
2. Packages that depend on (1)
3. And so on...

This ensures dependent packages always have their dependencies available.

## Monitoring Releases

- **npm**: https://www.npmjs.com/~beshkenadze
- **GitHub Packages**: https://github.com/beshkenadze/us-legal-tools/packages
- **GitHub Releases**: https://github.com/beshkenadze/us-legal-tools/releases

## Emergency Procedures

### Reverting a Release

```bash
# Revert the merge commit
git revert -m 1 <merge-commit-sha>

# Create changeset for the fix
bun changeset

# Push to trigger new release
git push origin main
```

### Unpublishing from npm

```bash
# Within 72 hours
npm unpublish @us-legal-tools/package-name@version

# After 72 hours - deprecate instead
npm deprecate @us-legal-tools/package-name@version "Critical bug, use version x.x.x"
```