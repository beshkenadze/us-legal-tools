import { createOrvalConfig } from '@us-legal-tools/orval-config';
import { defineConfig } from 'orval';

export default defineConfig(createOrvalConfig('./openapi.json', 'https://api.govinfo.gov'));
