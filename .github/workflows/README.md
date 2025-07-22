# GitHub Actions Workflows

This directory contains automated workflows for the eCFR SDK project.

## Workflows

### 1. Update SDK and Publish (`update-and-publish.yml`)

**Trigger**: Daily at 3 AM UTC, on push to main, or manual dispatch

**Purpose**: Main CI/CD workflow that handles the complete automation flow:

1. **Download Documentation** 
   - Downloads latest Swagger specs from eCFR API
   - Uses browserless/chrome service for reliable downloads
   - Caches specs to avoid unnecessary regeneration

2. **Check for Changes**
   - Compares downloaded specs with cached version
   - Determines if SDK needs regeneration
   - Calculates version bump (minor for API changes, patch for others)

3. **Build SDK**
   - Converts Swagger to OpenAPI 3.0
   - Generates TypeScript SDK using Orval
   - Generates MCP server handlers
   - Runs linter and formatter

4. **Run Tests**
   - Executes unit tests
   - Runs integration tests if API changed
   - Ensures SDK quality before deployment

5. **Deploy New Version**
   - Updates version in package.json
   - Creates git tag and GitHub release
   - Publishes to NPM registry
   - Generates comprehensive changelog

### 2. PR Checks (`pr-checks.yml`)

**Trigger**: On pull request to main branch

**Purpose**: Validates pull requests before merge:

- Runs linter and formatter checks
- Executes unit tests
- Builds SDK to ensure no build errors
- Checks bundle size limits
- Tests MCP server startup
- Validates swagger download process
- Comments results on PR

### 3. Manual Release (`manual-release.yml`)

**Trigger**: Manual workflow dispatch

**Purpose**: Allows manual releases with version control:

- Choose version bump type (patch/minor/major)
- Add custom release message
- Runs full test suite
- Generates changelog from commits
- Creates GitHub release
- Publishes to NPM

## Workflow Features

### Version Management
- Automatic version bumping based on changes
- Semantic versioning (major.minor.patch)
- Git tags for all releases

### Testing Strategy
- Unit tests run on every workflow
- Integration tests run when API changes
- E2E tests available but skipped by default

### Caching
- Swagger specs cached to avoid unnecessary downloads
- Cache invalidated when specs change
- Manual cache override available

### Notifications
- PR comments with check results
- Success/failure notifications in workflow logs
- Release URLs provided after publish

## Configuration

### Required Secrets
- `NPM_TOKEN`: NPM authentication token for publishing
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- `GOV_INFO_API_KEY`: GovInfo API key for govinfo-sdk tests (get from https://api.data.gov/signup/)

### Environment Variables
- `CDP_URL`: Chrome DevTools Protocol URL (default: http://chrome:9222)
- `SKIP_INTEGRATION_TESTS`: Skip integration tests (default: true)
- `SKIP_E2E_TESTS`: Skip E2E tests (default: true)

## Badges

Add these badges to your README:

```markdown
![Update SDK](https://github.com/yourusername/ecfr-sdk/workflows/Update%20SDK%20and%20Publish/badge.svg)
![PR Checks](https://github.com/yourusername/ecfr-sdk/workflows/PR%20Checks/badge.svg)
[![npm version](https://badge.fury.io/js/ecfr-sdk.svg)](https://www.npmjs.com/package/ecfr-sdk)
```

## Manual Triggers

### Force SDK Update
```bash
gh workflow run update-and-publish.yml --field skip_cache=true
```

### Manual Release
```bash
gh workflow run manual-release.yml --field version=minor --field message="New features added"
```

## Troubleshooting

### Workflow Failures

1. **Download failures**: Check Chrome service is running
2. **Test failures**: Review test logs, may need to update snapshots
3. **NPM publish failures**: Verify NPM_TOKEN is valid
4. **Version conflicts**: Ensure no duplicate versions exist

### Common Issues

- **Cache issues**: Use `skip_cache=true` to force regeneration
- **Chrome timeouts**: Check CDP_URL configuration
- **NPM permissions**: Ensure package has public access