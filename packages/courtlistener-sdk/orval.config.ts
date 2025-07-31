import { createOrvalConfig } from '@us-legal-tools/orval-config';
import { defineConfig } from 'orval';

export default defineConfig(
  createOrvalConfig('./courtlistener-openapi.json', 'https://www.courtlistener.com'),
);
