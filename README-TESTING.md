# Testing GitHub Actions Locally

This guide explains how to test the GitHub Actions workflows locally using `act`.

## Prerequisites

1. Install `act`:
   ```bash
   # macOS
   brew install act
   
   # Linux
   curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
   
   # Or see: https://github.com/nektos/act#installation
   ```

2. Install Docker (required by act and Lightpanda)

## Setup

1. Copy the secrets template:
   ```bash
   cp .secrets .secrets.local
   ```

2. Edit `.secrets.local` with your actual tokens:
   - `GITHUB_TOKEN`: Your GitHub personal access token
   - `NPM_TOKEN`: Your npm authentication token (if testing publishing)

## Running Tests

Use the test script:
```bash
./scripts/test-with-act.sh
```

The script will:
1. Start Chrome browser in a Docker container
2. Present you with test options:
   - Test CI workflow (on push)
   - Test update-and-publish workflow (scheduled)
   - Test update-and-publish workflow (manual with cache skip)
   - Test just the download step

## Manual Testing

### Start Chrome manually:
```bash
docker-compose -f docker-compose.test.yml up -d
```

### Run specific workflows:
```bash
# Test CI workflow
act push --secret-file .secrets.local -W .github/workflows/update-and-publish.yml --job ci

# Test scheduled update
act schedule --secret-file .secrets.local -W .github/workflows/update-and-publish.yml --job update-and-publish

# Test with workflow dispatch
act workflow_dispatch --secret-file .secrets.local -W .github/workflows/update-and-publish.yml --job update-and-publish
```

### Test download script directly:
```bash
# With Chrome running locally
CDP_URL=http://localhost:9222 bun run scripts/download-swagger.ts
```

## Troubleshooting

### Chrome not connecting
- Check if Docker is running
- Verify port 9222 is not in use: `lsof -i :9222`
- Check container logs: `docker-compose -f docker-compose.test.yml logs`

### Act issues
- Use `--verbose` flag for detailed output
- Check act documentation: https://github.com/nektos/act

### Network issues in act
If the workflow can't connect to Chrome:
1. Use host networking: `act --network host`
2. Or modify the workflow to use `localhost:9222` instead of service names

## Cleanup

Stop Chrome:
```bash
docker-compose -f docker-compose.test.yml down
```