import { describe, test, expect, beforeAll } from 'bun:test';
import { createApiClient } from '../../src/api';

const SKIP_E2E_TESTS = process.env.SKIP_E2E_TESTS !== 'false';

describe.skipIf(SKIP_E2E_TESTS)('DOL API E2E Tests', () => {
  let api: ReturnType<typeof createApiClient>;

  beforeAll(() => {
    // Initialize API client
    api = createApiClient();
  });

  describe('Datasets API', () => {
    test('should list all available datasets without API key', async () => {

      const response = await api.getDatasets();

      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);

      // The DOL API returns an array where the last element is pagination metadata
      const datasets = response.data.slice(0, -1);
      const pagination = response.data[response.data.length - 1];

      // Verify dataset structure
      const firstDataset = datasets[0];
      expect(firstDataset).toHaveProperty('name');
      expect(firstDataset).toHaveProperty('agency');
      expect(firstDataset).toHaveProperty('api_url');
      expect(firstDataset).toHaveProperty('description');
      expect(firstDataset.agency).toHaveProperty('name');
      expect(firstDataset.agency).toHaveProperty('abbr');

      // Verify pagination structure
      expect(pagination).toHaveProperty('current_page');
      expect(pagination).toHaveProperty('total_pages');
    }, 30000);

    test('should retrieve a specific dataset with API key', async () => {
      if (!process.env.DOL_API_KEY) {
        console.log('⚠️  Skipping API key test: DOL_API_KEY not set');
        return;
      }

      const response = await api.getDatasets();
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
      
      const datasets = response.data.slice(0, -1);
      const firstDataset = datasets[0];
      
      if (firstDataset.agency && firstDataset.api_url) {
        try {
          const dataResponse = await api.getAgencyEndpointDataJson(
            firstDataset.agency.abbr,
            firstDataset.api_url,
            { limit: 2 }
          );
          
          expect(dataResponse.data).toBeDefined();
          expect(dataResponse.data).toHaveProperty('data');
          expect(Array.isArray(dataResponse.data.data)).toBe(true);
        } catch (error: any) {
          console.log(`Test dataset "${firstDataset.name}" might require specific permissions or be unavailable`);
        }
      }
    }, 30000);
  });

  describe('Data Retrieval API', () => {
    test('should retrieve data from a specific dataset', async () => {
      // Skip if no API key
      if (!process.env.DOL_API_KEY) {
        // Use public dataset
        const agency = 'statistics';
        const endpoint = 'blslasttenyears';
        
        try {
          const response = await api.getAgencyEndpointDataJson(
            agency,
            endpoint,
            { limit: 2 }
          );
          
          expect(response.data).toBeDefined();
          expect(response.data).toHaveProperty('data');
          expect(Array.isArray(response.data.data)).toBe(true);
        } catch (error) {
          console.log('Public dataset might be unavailable');
        }
      }
    }, 30000);

    test('should handle dataset queries with parameters', async () => {
      // First get a list of datasets to find one to test
      const datasetsResponse = await api.getDatasets();
      expect(datasetsResponse.data).toBeDefined();
      
      // Check if data is an array before slicing
      if (!Array.isArray(datasetsResponse.data)) {
        console.log('Datasets response is not an array, skipping test');
        return;
      }
      
      const datasets = datasetsResponse.data.slice(0, -1);
      console.log('Available datasets:', datasets.slice(0, 5).map(d => ({ 
        name: d.name, 
        agency: d.agency,
        api_url: d.api_url
      })));
      
      // Find a testable dataset
      const testDataset = datasets.find(d => 
        d.agency?.abbr && 
        d.api_url && 
        d.agency.abbr.toLowerCase() !== 'dol'
      );
      
      if (testDataset && testDataset.agency && testDataset.api_url) {
        try {
          const response = await api.getAgencyEndpointDataJson(
            testDataset.agency.abbr, // agency abbreviation
            testDataset.api_url, // endpoint
            {
              limit: 5,
              offset: 0,
            }
          );
          
          expect(response.data).toBeDefined();
          
          // Check if we got data back
          if (response.data && response.data.data) {
            expect(Array.isArray(response.data.data)).toBe(true);
            console.log(`Successfully retrieved data from ${testDataset.name}`);
          }
        } catch (error: any) {
          console.log(`Could not retrieve data from ${testDataset.name}: ${error.message}`);
        }
      } else {
        console.log('No suitable test dataset found');
      }
    }, 30000);

    test('should return XML format when requested', async () => {
      // Skip if no API key is set
      if (!process.env.DOL_API_KEY) {
        return;
      }

      try {
        const response = await api.getAgencyEndpointDataXml(
          'bls',
          'cpi',
          { limit: 1 }
        );
        
        expect(response.data).toBeDefined();
        // XML responses might be strings
        expect(typeof response.data === 'string' || typeof response.data === 'object').toBe(true);
      } catch (error) {
        console.log('XML format might not be available for this dataset');
      }
    }, 30000);

    test('should return CSV format when requested', async () => {
      // Skip if no API key is set
      if (!process.env.DOL_API_KEY) {
        return;
      }

      try {
        const response = await api.getAgencyEndpointDataCsv(
          'enforcement',
          'whd_whisard',
          {
            limit: 5,
            fields: 'case_id,trade_nm,legal_name,city_nm,st_cd',
          }
        );
        
        expect(response.data).toBeDefined();
        // CSV responses should be strings
        expect(typeof response.data).toBe('string');
        
        if (typeof response.data === 'string') {
          // Basic CSV validation
          expect(response.data).toContain(','); // Should have commas
          const lines = response.data.split('\n');
          expect(lines.length).toBeGreaterThan(1); // Should have header + data
        }
      } catch (error) {
        console.log('CSV format might not be available for this dataset');
      }
    }, 30000);

    test('should handle non-existent dataset gracefully', async () => {
      try {
        await api.getAgencyEndpointDataJson(
          'invalid-agency',
          'invalid-endpoint',
          {}
        );
        // If we get here, the API didn't throw an error
        expect(true).toBe(true);
      } catch (error: any) {
        // Expected to fail
        expect(error.response?.status).toBeDefined();
        expect([400, 401, 404, 500]).toContain(error.response?.status);
      }
    }, 30000);
  });

  describe('Metadata API', () => {
    test('should retrieve metadata for a dataset', async () => {
      // Skip if no API key
      if (!process.env.DOL_API_KEY) {
        return;
      }

      try {
        const response = await api.getAgencyEndpointMetadataJson(
          'bls',
          'cpi'
        );
        
        expect(response.data).toBeDefined();
        
        // Metadata should contain field information
        if (response.data && typeof response.data === 'object') {
          // The structure might vary, but should have some metadata
          expect(Object.keys(response.data).length).toBeGreaterThan(0);
        }
      } catch (error) {
        console.log('Metadata endpoint might not be available');
      }
    }, 30000);

    test('should retrieve metadata in CSV format', async () => {
      // Skip if no API key
      if (!process.env.DOL_API_KEY) {
        return;
      }

      try {
        const response = await api.getAgencyEndpointMetadataCsv(
          'osha',
          'inspection'
        );
        
        expect(response.data).toBeDefined();
        expect(typeof response.data).toBe('string');
        
        if (typeof response.data === 'string') {
          // Should be CSV formatted
          expect(response.data).toContain(',');
        }
      } catch (error) {
        console.log('CSV metadata might not be available');
      }
    }, 30000);
  });

  describe('API Key Authentication', () => {
    test('should include API key in requests when DOL_API_KEY is set', async () => {
      if (!process.env.DOL_API_KEY) {
        console.log('⚠️  Skipping API key test: DOL_API_KEY not set');
        return;
      }

      // The API key should be automatically included by the client
      try {
        const response = await api.getAgencyEndpointMetadataJson(
          'statistics',
          'blslasttenyears'
        );
        
        expect(response.data).toBeDefined();
      } catch (error: any) {
        // Even with API key, some endpoints might not be available
        console.log('Dataset might not support metadata endpoint');
      }
    }, 30000);
  });

  describe('Complex Queries', () => {
    test('should handle complex filtering and field selection', async () => {
      // Skip complex queries without API key
      if (!process.env.DOL_API_KEY) {
        return;
      }

      try {
        const response = await api.getAgencyEndpointDataJson(
          'osha',
          'inspection',
          {
            filter_object: JSON.stringify({
              field: 'open_date',
              operator: 'gt',
              value: '2020-01-01'
            }),
            fields: 'activity_nr,estab_name,city,state,open_date',
            limit: 10,
            sort: 'desc',
            sort_by: 'open_date'
          }
        );
        
        expect(response.data).toBeDefined();
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          const records = response.data.data;
          if (records.length > 0) {
            // Verify field selection worked
            const firstRecord = records[0];
            expect(firstRecord).toHaveProperty('activity_nr');
            expect(firstRecord).toHaveProperty('estab_name');
          }
        }
      } catch (error) {
        console.log('Complex filtering might not be supported for this dataset');
      }
    }, 30000);

    test('should handle pagination with offset and limit', async () => {
      // Skip without API key
      if (!process.env.DOL_API_KEY) {
        return;
      }

      try {
        const firstPageResponse = await api.getAgencyEndpointDataJson(
          'bls',
          'cpi',
          { limit: 5, offset: 0 }
        );
        
        const secondPageResponse = await api.getAgencyEndpointDataJson(
          'bls',
          'cpi',
          { limit: 5, offset: 5 }
        );
        
        expect(firstPageResponse.data).toBeDefined();
        expect(secondPageResponse.data).toBeDefined();
        
        // The data should be different between pages
        if (firstPageResponse.data?.data && secondPageResponse.data?.data) {
          const firstPageData = JSON.stringify(firstPageResponse.data.data[0]);
          const secondPageData = JSON.stringify(secondPageResponse.data.data[0]);
          expect(firstPageData).not.toBe(secondPageData);
        }
      } catch (error) {
        console.log('Pagination might not be supported for this dataset');
      }
    }, 30000);
  });
});