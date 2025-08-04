import { createOrvalConfig } from '@us-legal-tools/orval-config';

export default createOrvalConfig(
  './courtlistener-openapi.json',
  'https://www.courtlistener.com/api/rest/v4',
);
