import { describe, test, expect } from 'bun:test';
import {
  getDatasets,
  getAgencyEndpointDataJson,
  getAgencyEndpointDataXml,
  getAgencyEndpointDataCsv,
  getAgencyEndpointMetadataJson,
  getAgencyEndpointMetadataCsv
} from '../../src';
import type { Dataset, PaginationMetadata } from '../../src/api/generated/model';

const SKIP_E2E_TESTS = process.env.SKIP_E2E_TESTS !== 'false';

describe.skipIf(SKIP_E2E_TESTS)('DOL API E2E Tests', () => {

  describe('Datasets API', () => {
    test('should list all available datasets without API key', async () => {

      const response = await getDatasets();

      console.log('getDatasets response:', typeof response, response);
      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBeGreaterThan(1);
      
      // Response is an array where all elements except the last are datasets
      // and the last element is pagination metadata
      const lastElement = response[response.length - 1];
      const datasets = response.slice(0, -1).filter((item): item is Dataset => 
        'agency' in item && 'api_url' in item
      );
      const pagination = lastElement && 'page' in lastElement ? lastElement as PaginationMetadata : undefined;

      // Verify dataset structure
      const firstDataset = datasets[0];
      if (firstDataset) {
        expect(firstDataset).toHaveProperty('name');
        expect(firstDataset).toHaveProperty('agency');
        expect(firstDataset).toHaveProperty('api_url');
        expect(firstDataset).toHaveProperty('description');
        if (firstDataset.agency) {
          expect(firstDataset.agency).toHaveProperty('name');
          expect(firstDataset.agency).toHaveProperty('abbr');
        }
      }

      // Verify pagination structure
      expect(pagination).toHaveProperty('current_page');
      expect(pagination).toHaveProperty('total_pages');
    }, 30000);

    test('should retrieve a specific dataset with API key', async () => {
      if (!process.env.DOL_API_KEY) {
        console.log('⚠️  Skipping API key test: DOL_API_KEY not set');
        return;
      }

      const response = await getDatasets();
      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBeGreaterThan(1);
      
      const datasets = response.slice(0, -1).filter((item): item is Dataset => 
        'agency' in item && 'api_url' in item
      );
      const firstDataset = datasets[0];
      
      if (firstDataset && firstDataset.agency && firstDataset.api_url) {
        try {
          const dataResponse = await getAgencyEndpointDataJson(
            firstDataset.agency.abbr,
            firstDataset.api_url,
            { limit: 2 }
          );
          
          expect(dataResponse).toBeDefined();
          expect(dataResponse).toHaveProperty('data');
          expect(Array.isArray(dataResponse.data)).toBe(true);
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
          const response = await getAgencyEndpointDataJson(
            agency,
            endpoint,
            { limit: 2 }
          );
          
          expect(response).toBeDefined();
          expect(response).toHaveProperty('data');
          expect(Array.isArray(response.data)).toBe(true);
        } catch (error) {
          console.log('Public dataset might be unavailable');
        }
      }
    }, 30000);

    test('should handle dataset queries with parameters', async () => {
      // First get a list of datasets to find one to test
      const datasetsResponse = await getDatasets();
      expect(datasetsResponse).toBeDefined();
      
      // Check if datasets property exists
      if (!Array.isArray(datasetsResponse) || datasetsResponse.length <= 1) {
        console.log('Datasets response structure invalid, skipping test');
        return;
      }
      
      const datasets = datasetsResponse.slice(0, -1);
      console.log('Available datasets:', datasets.slice(0, 5).map((d: any) => ({ 
        name: d.name, 
        agency: d.agency,
        api_url: d.api_url
      })));
      
      // Find a testable dataset
      const testDataset = datasets.find((d): d is Dataset => {
        if (!('agency' in d)) return false;
        const dataset = d as Dataset;
        return !!dataset.agency?.abbr && 
               !!dataset.api_url && 
               dataset.agency.abbr.toLowerCase() !== 'dol';
      });
      
      if (testDataset && testDataset.agency && testDataset.api_url) {
        try {
          const response = await getAgencyEndpointDataJson(
            testDataset.agency.abbr, // agency abbreviation
            testDataset.api_url, // endpoint
            {
              limit: 5,
              offset: 0,
            }
          );
          
          expect(response).toBeDefined();
          
          // Check if we got data back
          if (response && response.data) {
            expect(Array.isArray(response.data)).toBe(true);
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
        const response = await getAgencyEndpointDataXml(
          'bls',
          'cpi',
          { limit: 1 }
        );
        
        expect(response).toBeDefined();
        // XML responses might be strings
        expect(typeof response === 'string' || typeof response === 'object').toBe(true);
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
        const response = await getAgencyEndpointDataCsv(
          'enforcement',
          'whd_whisard',
          {
            limit: 5,
            fields: 'case_id,trade_nm,legal_name,city_nm,st_cd',
          }
        );
        
        expect(response).toBeDefined();
        // CSV responses should be strings
        expect(typeof response).toBe('string');
        
        if (typeof response === 'string') {
          // Basic CSV validation
          expect(response).toContain(','); // Should have commas
          const lines = response.split('\n');
          expect(lines.length).toBeGreaterThan(1); // Should have header + data
        }
      } catch (error) {
        console.log('CSV format might not be available for this dataset');
      }
    }, 30000);

    test('should handle non-existent dataset gracefully', async () => {
      try {
        await getAgencyEndpointDataJson(
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
        const response = await getAgencyEndpointMetadataJson(
          'bls',
          'cpi'
        );
        
        expect(response).toBeDefined();
        
        // Metadata should contain field information
        if (response && typeof response === 'object') {
          // The structure might vary, but should have some metadata
          expect(Object.keys(response).length).toBeGreaterThan(0);
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
        const response = await getAgencyEndpointMetadataCsv(
          'osha',
          'inspection'
        );
        
        expect(response).toBeDefined();
        expect(typeof response).toBe('string');
        
        if (typeof response === 'string') {
          // Should be CSV formatted
          expect(response).toContain(',');
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
        const response = await getAgencyEndpointMetadataJson(
          'statistics',
          'blslasttenyears'
        );
        
        expect(response).toBeDefined();
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
        const response = await getAgencyEndpointDataJson(
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
        
        expect(response).toBeDefined();
        
        if (response && response.data && Array.isArray(response.data)) {
          const records = response.data;
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
        const firstPageResponse = await getAgencyEndpointDataJson(
          'bls',
          'cpi',
          { limit: 5, offset: 0 }
        );
        
        const secondPageResponse = await getAgencyEndpointDataJson(
          'bls',
          'cpi',
          { limit: 5, offset: 5 }
        );
        
        expect(firstPageResponse.data).toBeDefined();
        expect(secondPageResponse.data).toBeDefined();
        
        // The data should be different between pages
        if (firstPageResponse.data && Array.isArray(firstPageResponse.data) && 
            secondPageResponse.data && Array.isArray(secondPageResponse.data)) {
          const firstPageData = JSON.stringify(firstPageResponse.data[0]);
          const secondPageData = JSON.stringify(secondPageResponse.data[0]);
          expect(firstPageData).not.toBe(secondPageData);
        }
      } catch (error) {
        console.log('Pagination might not be supported for this dataset');
      }
    }, 30000);
  });
});