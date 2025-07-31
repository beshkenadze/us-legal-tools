import { createOrvalConfig } from '@us-legal-tools/orval-config';

export default createOrvalConfig('./openapi.json', 'https://api.govinfo.gov');
