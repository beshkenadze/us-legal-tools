/**
 * Test script for DOL SDK
 * Run with: bun run dev
 */

import {
  getDatasets,
  getAgencyEndpointDataJson,
  getAgencyEndpointMetadataJson
} from './api/generated/endpoints';
import type { Dataset, PaginationMetadata } from './api/generated/model';

async function testSDK() {
  console.log('DOL SDK Test Script');
  console.log('===================\n');

  try {
    console.log('Testing getDatasets...');
    const datasetsResponse = await getDatasets();
    
    // The response is an array where the last element is pagination metadata
    const datasets = datasetsResponse.slice(0, -1) as Dataset[];
    const pagination = datasetsResponse[datasetsResponse.length - 1] as PaginationMetadata;
    
    console.log(`Found ${datasets.length} datasets on page ${pagination?.current_page || 1}`);
    console.log('First few datasets:', datasets.slice(0, 3));

    // Test with a specific dataset if we have any
    if (datasets.length > 0) {
      const firstDataset = datasets[0];
      
      if (firstDataset && 'name' in firstDataset && 'agency' in firstDataset && 'api_url' in firstDataset) {
        const dataset = firstDataset as Dataset;
        if (dataset.name && dataset.agency?.abbr && dataset.api_url) {
          console.log(`\nTesting data retrieval for ${dataset.name}...`);
          const data = await getAgencyEndpointDataJson(
            dataset.agency.abbr.toLowerCase(),
            dataset.api_url,
            { limit: 5 }
          );
          console.log('Data response:', data);

          console.log(`\nTesting metadata retrieval for ${dataset.name}...`);
          const metadata = await getAgencyEndpointMetadataJson(
            dataset.agency.abbr.toLowerCase(),
            dataset.api_url
          );
          console.log('Metadata response:', metadata);
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as any;
      console.error('Response data:', axiosError.response?.data);
      console.error('Response status:', axiosError.response?.status);
    }
  }
}

testSDK();