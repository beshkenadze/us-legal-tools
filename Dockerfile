# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

# Copy application files
FROM base AS release
COPY --from=install /app/node_modules node_modules
COPY package.json ./
COPY src/mcp ./src/mcp

# Run the MCP server
CMD ["bun", "run", "src/mcp/server.ts"]