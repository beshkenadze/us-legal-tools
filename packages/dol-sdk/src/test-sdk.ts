/**
 * Test script for DOL SDK
 * Run with: bun run dev
 */

import { getDolsdk } from './api/generated/endpoints';

async function testSDK() {
  console.log('DOL SDK Test Script');
  console.log('===================\n');

  const client = getDolsdk();

  try {
    console.log('Testing getDatasets...');
    const datasets = await client.getDatasets();
    console.log(`Found ${datasets.data?.datasets?.length || 0} datasets`);
    console.log('First few datasets:', datasets.data?.datasets?.slice(0, 3));

    // Test with a specific dataset if we have any
    if (datasets.data?.datasets?.length) {
      const firstDataset = datasets.data.datasets[0];
      const [agency, endpoint] = firstDataset.api_url.split('/');
      
      console.log(`\nTesting data retrieval for ${firstDataset.name}...`);
      const data = await client.getGetAgencyEndpointFormat(
        agency,
        endpoint,
        'json',
        { limit: 5 }
      );
      console.log('Data response:', data.data);

      console.log(`\nTesting metadata retrieval for ${firstDataset.name}...`);
      const metadata = await client.getGetAgencyEndpointFormatMetadata(
        agency,
        endpoint,
        'json'
      );
      console.log('Metadata response:', metadata.data);
    }

  } catch (error) {
    console.error('Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testSDK();