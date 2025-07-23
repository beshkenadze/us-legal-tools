export interface ApiConfig {
  name: string;
  path: string;
  specUrl?: string;
  specPath?: string;
  theme?: string;
  description?: string;
}

export const apiConfigs: ApiConfig[] = [
  {
    name: 'eCFR API',
    path: '/ecfr',
    specPath: '../ecfr-sdk/v1-openapi3.json',
    theme: 'purple',
    description: 'Electronic Code of Federal Regulations API - Access to federal regulations'
  },
  {
    name: 'DOL API',
    path: '/dol',
    specPath: '../dol-sdk/openapi-v4.yaml',
    theme: 'blue',
    description: 'Department of Labor API - Access to labor statistics and employment data'
  },
  {
    name: 'Federal Register API',
    path: '/federal-register',
    specPath: '../federal-register-sdk/openapi.json',
    theme: 'green',
    description: 'Federal Register API - Access to federal agency documents and notices'
  },
  {
    name: 'GovInfo API',
    path: '/govinfo',
    specPath: '../govinfo-sdk/openapi.json',
    theme: 'orange',
    description: 'GovInfo API - Access to government publications and documents'
  },
  {
    name: 'CourtListener API',
    path: '/courtlistener',
    specPath: '../courtlistener-sdk/courtlistener-openapi.json',
    theme: 'red',
    description: 'CourtListener API - Access to legal documents, case law, and court information'
  }
];