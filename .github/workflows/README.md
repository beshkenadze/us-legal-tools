# GitHub Actions Workflows

This directory contains automated workflows for the US Legal Tools monorepo project.

## Workflows

### 1. Validate (`validate.yml`)

**Trigger**: On pull request to main branch or push to main

**Purpose**: Comprehensive validation and testing workflow with parallel jobs:

1. **Lint & Format**
   - Runs Biome format and lint checks
   - Validates code style and quality
   - Ensures consistent formatting

2. **Test** (Matrix strategy: unit, integration, e2e)
   - Unit tests run on every PR
   - Integration tests with API keys
   - E2E tests with Playwright

3. **Verify MCP Servers**
   - Tests each MCP server can start
   - Validates tool listings
   - Ensures server functionality

4. **Bundle Size Check**
   - Monitors package bundle sizes
   - Fails if any package exceeds 5MB
   - Reports size metrics

5. **PR Checks** (PR only)
   - Checks for changesets
   - Comments if changeset missing
   - Provides automated feedback

### 2. Release (`release.yml`)

**Trigger**: Push to main with changes in packages/*, changesets/*, or config files

**Purpose**: Automated release workflow using changesets:

1. **Check for Changesets**
   - Verifies if there are pending changesets
   - Skips release if no changesets found

2. **Release Process**
   - Runs full test suite
   - Creates release PR or publishes packages
   - Updates changelogs
   - Publishes to NPM and GitHub Packages
   - Creates GitHub releases with notes

### 3. Manual Release (`manual-release.yml`)

**Trigger**: Manual workflow dispatch

**Purpose**: Allows manual releases with custom control:

- Choose version bump type (patch/minor/major)
- Add custom release notes
- Target specific packages
- Force version updates
- Bypass changeset requirements

### 4. Deploy Documentation (`docs.yml`)

**Trigger**: Push to main, PR to main, or manual dispatch

**Purpose**: Generates and deploys documentation to GitHub Pages:

1. **Generate SDKs**
   - Uses Turborepo to generate all SDKs
   - Leverages caching for performance

2. **Generate Documentation**
   - Runs TypeDoc with GitHub theme
   - Creates API documentation for each SDK
   - Generates unified documentation site

3. **Deploy to GitHub Pages**
   - Uses peaceiris/actions-gh-pages
   - Deploys only on main branch pushes
   - Enables Jekyll for better GitHub Pages support

## Workflow Features

### Turborepo Integration
- Local caching with `.turbo` directory
- Optimized task orchestration
- Parallel job execution
- Dependency-aware builds

### Testing Strategy
- Unit tests: Always run
- Integration tests: Require API keys
- E2E tests: Full browser testing
- MCP server validation

### Caching Strategy
- Bun dependencies cached
- Turbo build cache
- GitHub Actions cache for performance

### PR Automation
- Automated check results
- Bundle size reporting
- Changeset validation
- Summary comments on PRs

## Configuration

### Required Secrets
- `NPM_TOKEN`: NPM authentication token for publishing
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- `GOV_INFO_API_KEY`: GovInfo API key for integration tests
- `DOL_API_KEY`: Department of Labor API key for tests
- `COURTLISTENER_API_TOKEN`: CourtListener API token (optional)

### Environment Variables
- `SKIP_INTEGRATION_TESTS`: Skip integration tests (default: true)
- `SKIP_E2E_TESTS`: Skip E2E tests (default: true)

## Badges

Add these badges to your README:

```markdown
![Validate](https://github.com/beshkenadze/us-legal-tools/workflows/Validate/badge.svg)
![Release](https://github.com/beshkenadze/us-legal-tools/workflows/Release/badge.svg)
![Deploy Documentation](https://github.com/beshkenadze/us-legal-tools/workflows/Deploy%20Documentation/badge.svg)
```

## Manual Triggers

### Run Validation
```bash
gh workflow run validate.yml
```

### Manual Release
```bash
gh workflow run manual-release.yml --field version=minor --field message="New features added"
```

### Deploy Documentation
```bash
gh workflow run docs.yml
```

## Troubleshooting

### Workflow Failures

1. **Test failures**: Check logs for specific test errors
2. **Build failures**: Ensure dependencies are installed
3. **NPM publish failures**: Verify NPM_TOKEN is valid
4. **Documentation failures**: Check TypeDoc configuration

### Common Issues

- **Cache misses**: Turbo cache key may have changed
- **Type errors**: Run `turbo check` locally
- **Bundle size**: Check for accidental dependency additions
- **MCP server issues**: Validate server implementations

### Local Testing

Test workflows locally using [act](https://github.com/nektos/act):

```bash
# Test validate workflow
act push -j lint --platform linux/arm64

# Test docs workflow
act push -j docs --platform linux/arm64

# Test with specific event
act pull_request -j pr-checks --platform linux/arm64
```

## Maintenance

### Updating Dependencies
- Run `bun update` in root directory
- Test all workflows after updates
- Update lockfile in PR

### Adding New Packages
- Ensure package has proper scripts
- Add to Turborepo pipeline if needed
- Update workflow matrices if required