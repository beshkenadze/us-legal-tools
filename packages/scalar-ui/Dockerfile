FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY tsconfig.json ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy application code
COPY src ./src

# Copy OpenAPI specs from other packages (adjust paths as needed)
COPY ../ecfr-sdk/docs ./specs/ecfr-sdk/docs
COPY ../dol-sdk/openapi-v4.yaml ./specs/dol-sdk/
COPY ../federal-register-sdk/openapi.json ./specs/federal-register-sdk/
COPY ../govinfo-sdk/openapi.json ./specs/govinfo-sdk/
COPY ../courtlistener-sdk/courtlistener-openapi.json ./specs/courtlistener-sdk/

# Expose port
EXPOSE 3000

# Start the server
CMD ["bun", "run", "src/server.ts"]