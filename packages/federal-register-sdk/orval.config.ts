import { createOrvalConfig } from '@us-legal-tools/orval-config';

export default createOrvalConfig('./openapi.json', 'https://www.federalregister.gov/api/v1');
