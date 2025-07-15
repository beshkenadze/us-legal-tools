#!/bin/bash

# Script to test GitHub Actions locally with act

echo "🚀 Testing GitHub Actions with act..."

# Check if act is installed
if ! command -v act &> /dev/null; then
    echo "❌ act is not installed. Please install it first:"
    echo "   brew install act (macOS)"
    echo "   or visit: https://github.com/nektos/act"
    exit 1
fi

# Check if .secrets.local exists
if [ ! -f ".secrets.local" ]; then
    echo "⚠️  .secrets.local not found. Creating from template..."
    cp .secrets .secrets.local
    echo "📝 Please edit .secrets.local with your actual tokens"
    exit 1
fi

# Start Chrome browser
echo "🌐 Starting Chrome browser..."
docker-compose -f docker-compose.test.yml up -d

# Wait for Chrome to be ready
echo "⏳ Waiting for Chrome to be ready..."
sleep 5

# Check if Chrome is running
if ! curl -s http://localhost:9222/json/version > /dev/null 2>&1; then
    echo "❌ Chrome is not responding on port 9222"
    docker-compose -f docker-compose.test.yml logs
    exit 1
fi

echo "✅ Chrome is ready!"

# Run act with different scenarios
echo ""
echo "Choose what to test:"
echo "1) Test CI workflow (on push)"
echo "2) Test update-and-publish workflow (scheduled)"
echo "3) Test update-and-publish workflow (manual with cache skip)"
echo "4) Test just the download step"
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🧪 Testing CI workflow..."
        act push --secret-file .secrets.local -W .github/workflows/update-and-publish.yml --job ci
        ;;
    2)
        echo "🧪 Testing scheduled update workflow..."
        act schedule --secret-file .secrets.local -W .github/workflows/update-and-publish.yml --job update-and-publish
        ;;
    3)
        echo "🧪 Testing manual update workflow with cache skip..."
        act workflow_dispatch --secret-file .secrets.local -W .github/workflows/update-and-publish.yml --job update-and-publish -e <(echo '{"inputs":{"skip_cache":"true"}}')
        ;;
    4)
        echo "🧪 Testing download step only..."
        # Run a simplified workflow
        cat > .github/workflows/test-download.yml << 'EOF'
name: Test Download
on: push
jobs:
  test-download:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - name: Test download
        env:
          CDP_URL: http://localhost:9222
        run: bun run scripts/download-swagger.ts
EOF
        act push --secret-file .secrets.local -W .github/workflows/test-download.yml
        rm .github/workflows/test-download.yml
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

# Cleanup
echo ""
read -p "Stop Chrome browser? (y/n): " stop
if [ "$stop" = "y" ]; then
    echo "🛑 Stopping Chrome..."
    docker-compose -f docker-compose.test.yml down
fi

echo "✅ Done!"