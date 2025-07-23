/**
 * DOL API Code Examples
 * 
 * This file contains comprehensive examples for using the Department of Labor (DOL) API.
 * Before running these examples, make sure to:
 * 1. Register at https://dataportal.dol.gov/registration
 * 2. Get your API key
 * 3. Replace 'YOUR_API_KEY' with your actual API key
 */

// Example base URL
const API_BASE_URL = 'https://apiprod.dol.gov/v4';
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

/**
 * 1. GET /datasets - List Available Datasets
 * This endpoint does not require authentication
 */

// Basic example without authentication
async function listDatasets() {
  try {
    const response = await fetch(`${API_BASE_URL}/datasets`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Available datasets:', data.datasets);
    
    return data.datasets;
  } catch (error) {
    console.error('Error fetching datasets:', error);
    throw error;
  }
}

// Example parsing the response to find specific datasets
async function findDatasetsByAgency(targetAgency: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/datasets`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter datasets by agency
    const agencyDatasets = data.datasets.filter(
      (dataset: any) => dataset.agency === targetAgency
    );
    
    console.log(`Found ${agencyDatasets.length} datasets for ${targetAgency}:`);
    agencyDatasets.forEach((dataset: any) => {
      console.log(`- ${dataset.name} (${dataset.api_url})`);
      console.log(`  Description: ${dataset.description}`);
    });
    
    return agencyDatasets;
  } catch (error) {
    console.error('Error finding datasets:', error);
    throw error;
  }
}

/**
 * 2. GET /get/{agency}/{endpoint}/{format} - Retrieve Data
 */

// Basic example with API key
async function getBasicData() {
  const agency = 'osha';
  const endpoint = 'inspection';
  const format = 'json';
  
  try {
    const url = `${API_BASE_URL}/get/${agency}/${endpoint}/${format}?X-API-KEY=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error} - ${errorData.details}`);
    }
    
    const data = await response.json();
    console.log(`Retrieved ${data.metadata.returned_records} records`);
    console.log('First record:', data.data[0]);
    
    return data;
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
}

// Example with pagination (limit/offset)
async function getDataWithPagination(page: number = 1, pageSize: number = 100) {
  const agency = 'msha';
  const endpoint = 'accidents';
  const format = 'json';
  const offset = (page - 1) * pageSize;
  
  try {
    const url = new URL(`${API_BASE_URL}/get/${agency}/${endpoint}/${format}`);
    url.searchParams.append('X-API-KEY', API_KEY);
    url.searchParams.append('limit', pageSize.toString());
    url.searchParams.append('offset', offset.toString());
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error} - ${errorData.details}`);
    }
    
    const data = await response.json();
    const totalPages = Math.ceil(data.metadata.total_records / pageSize);
    
    console.log(`Page ${page} of ${totalPages}`);
    console.log(`Records ${offset + 1} to ${offset + data.metadata.returned_records}`);
    console.log(`Total records: ${data.metadata.total_records}`);
    
    return {
      data: data.data,
      metadata: {
        ...data.metadata,
        currentPage: page,
        totalPages,
        pageSize
      }
    };
  } catch (error) {
    console.error('Error retrieving paginated data:', error);
    throw error;
  }
}

// Example with field selection
async function getDataWithFieldSelection() {
  const agency = 'ebsa';
  const endpoint = 'compliance_assistance';
  const format = 'json';
  const fields = ['case_identifier', 'naics_code', 'back_wages', 'year'];
  
  try {
    const url = new URL(`${API_BASE_URL}/get/${agency}/${endpoint}/${format}`);
    url.searchParams.append('X-API-KEY', API_KEY);
    url.searchParams.append('fields', fields.join(','));
    url.searchParams.append('limit', '50');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error} - ${errorData.details}`);
    }
    
    const data = await response.json();
    console.log('Retrieved records with selected fields:');
    console.log('Fields requested:', fields);
    console.log('Sample record:', data.data[0]);
    
    return data;
  } catch (error) {
    console.error('Error retrieving data with field selection:', error);
    throw error;
  }
}

// Example with sorting
async function getDataWithSorting() {
  const agency = 'osha';
  const endpoint = 'inspection';
  const format = 'json';
  
  try {
    const url = new URL(`${API_BASE_URL}/get/${agency}/${endpoint}/${format}`);
    url.searchParams.append('X-API-KEY', API_KEY);
    url.searchParams.append('sort_by', 'inspection_date');
    url.searchParams.append('sort', 'desc'); // Get most recent inspections first
    url.searchParams.append('limit', '20');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error} - ${errorData.details}`);
    }
    
    const data = await response.json();
    console.log('Most recent inspections:');
    data.data.forEach((record: any, index: number) => {
      console.log(`${index + 1}. Date: ${record.inspection_date}, ID: ${record.activity_nr}`);
    });
    
    return data;
  } catch (error) {
    console.error('Error retrieving sorted data:', error);
    throw error;
  }
}

// Example with simple filtering
async function getDataWithSimpleFilter() {
  const agency = 'msha';
  const endpoint = 'accidents';
  const format = 'json';
  
  // Filter for accidents in manufacturing industry
  const filter = {
    field: 'industry',
    operator: 'eq',
    value: 'Manufacturing'
  };
  
  try {
    const url = new URL(`${API_BASE_URL}/get/${agency}/${endpoint}/${format}`);
    url.searchParams.append('X-API-KEY', API_KEY);
    url.searchParams.append('filter_object', JSON.stringify(filter));
    url.searchParams.append('limit', '50');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error} - ${errorData.details}`);
    }
    
    const data = await response.json();
    console.log(`Found ${data.metadata.returned_records} accidents in manufacturing`);
    
    return data;
  } catch (error) {
    console.error('Error retrieving filtered data:', error);
    throw error;
  }
}

// Example with complex filtering (AND/OR conditions)
async function getDataWithComplexFilter() {
  const agency = 'osha';
  const endpoint = 'inspection';
  const format = 'json';
  
  // Complex filter: Year 2021 AND (Industry A OR Industry C)
  const complexFilter = {
    and: [
      {
        field: 'year',
        operator: 'eq',
        value: '2021'
      },
      {
        or: [
          {
            field: 'industry',
            operator: 'eq',
            value: 'A'
          },
          {
            field: 'industry',
            operator: 'eq',
            value: 'C'
          }
        ]
      }
    ]
  };
  
  try {
    const url = new URL(`${API_BASE_URL}/get/${agency}/${endpoint}/${format}`);
    url.searchParams.append('X-API-KEY', API_KEY);
    url.searchParams.append('filter_object', JSON.stringify(complexFilter));
    url.searchParams.append('limit', '100');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error} - ${errorData.details}`);
    }
    
    const data = await response.json();
    console.log(`Found ${data.metadata.returned_records} inspections matching complex filter`);
    
    // Group results by industry
    const byIndustry = data.data.reduce((acc: any, record: any) => {
      acc[record.industry] = (acc[record.industry] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Results by industry:', byIndustry);
    
    return data;
  } catch (error) {
    console.error('Error retrieving data with complex filter:', error);
    throw error;
  }
}

// Example for different formats (JSON)
async function getDataAsJSON() {
  const agency = 'osha';
  const endpoint = 'inspection';
  const format = 'json';
  
  try {
    const url = new URL(`${API_BASE_URL}/get/${agency}/${endpoint}/${format}`);
    url.searchParams.append('X-API-KEY', API_KEY);
    url.searchParams.append('limit', '10');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error} - ${errorData.details}`);
    }
    
    const data = await response.json();
    console.log('JSON Response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error retrieving JSON data:', error);
    throw error;
  }
}

// Example for different formats (XML)
async function getDataAsXML() {
  const agency = 'osha';
  const endpoint = 'inspection';
  const format = 'xml';
  
  try {
    const url = new URL(`${API_BASE_URL}/get/${agency}/${endpoint}/${format}`);
    url.searchParams.append('X-API-KEY', API_KEY);
    url.searchParams.append('limit', '10');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${errorText}`);
    }
    
    const xmlData = await response.text();
    console.log('XML Response (first 500 chars):', xmlData.substring(0, 500));
    
    // Note: In a real application, you would parse the XML
    // Example using DOMParser in browser or xml2js in Node.js
    
    return xmlData;
  } catch (error) {
    console.error('Error retrieving XML data:', error);
    throw error;
  }
}

// Example for different formats (CSV)
async function getDataAsCSV() {
  const agency = 'osha';
  const endpoint = 'inspection';
  const format = 'csv';
  
  try {
    const url = new URL(`${API_BASE_URL}/get/${agency}/${endpoint}/${format}`);
    url.searchParams.append('X-API-KEY', API_KEY);
    url.searchParams.append('limit', '10');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${errorText}`);
    }
    
    const csvData = await response.text();
    console.log('CSV Response (first 5 lines):');
    const lines = csvData.split('\n').slice(0, 5);
    lines.forEach(line => console.log(line));
    
    // Note: In a real application, you would parse the CSV
    // Example using papaparse or csv-parse libraries
    
    return csvData;
  } catch (error) {
    console.error('Error retrieving CSV data:', error);
    throw error;
  }
}

/**
 * 3. GET /get/{agency}/{endpoint}/{format}/metadata - Get Metadata
 */

// Example retrieving field information
async function getMetadata() {
  const agency = 'msha';
  const endpoint = 'accidents';
  const format = 'json';
  
  try {
    const url = new URL(`${API_BASE_URL}/get/${agency}/${endpoint}/${format}/metadata`);
    url.searchParams.append('X-API-KEY', API_KEY);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error} - ${errorData.details}`);
    }
    
    const metadata = await response.json();
    
    console.log('Dataset Information:');
    console.log(`- Name: ${metadata.dataset_info.name}`);
    console.log(`- Description: ${metadata.dataset_info.description}`);
    console.log(`- Last Updated: ${metadata.dataset_info.last_updated}`);
    console.log(`- Total Records: ${metadata.dataset_info.record_count}`);
    
    console.log('\nField Information:');
    metadata.fields.forEach((field: any) => {
      console.log(`\n- ${field.field_name}`);
      console.log(`  Type: ${field.data_type}`);
      console.log(`  Description: ${field.description}`);
      console.log(`  Nullable: ${field.is_nullable}`);
      if (field.max_length) {
        console.log(`  Max Length: ${field.max_length}`);
      }
    });
    
    return metadata;
  } catch (error) {
    console.error('Error retrieving metadata:', error);
    throw error;
  }
}

// Example using metadata to understand dataset structure
async function analyzeDatasetStructure() {
  const agency = 'ebsa';
  const endpoint = 'compliance_assistance';
  const format = 'json';
  
  try {
    // First, get the metadata
    const metadataUrl = new URL(`${API_BASE_URL}/get/${agency}/${endpoint}/${format}/metadata`);
    metadataUrl.searchParams.append('X-API-KEY', API_KEY);
    
    const metadataResponse = await fetch(metadataUrl.toString());
    
    if (!metadataResponse.ok) {
      const errorData = await metadataResponse.json();
      throw new Error(`API Error: ${errorData.error} - ${errorData.details}`);
    }
    
    const metadata = await metadataResponse.json();
    
    // Analyze field types
    const fieldTypes = metadata.fields.reduce((acc: any, field: any) => {
      acc[field.data_type] = (acc[field.data_type] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Field Type Distribution:');
    Object.entries(fieldTypes).forEach(([type, count]) => {
      console.log(`- ${type}: ${count} fields`);
    });
    
    // Find numeric fields for potential aggregation
    const numericFields = metadata.fields
      .filter((field: any) => ['integer', 'number', 'decimal'].includes(field.data_type))
      .map((field: any) => field.field_name);
    
    console.log('\nNumeric fields (suitable for aggregation):', numericFields);
    
    // Find date fields for temporal analysis
    const dateFields = metadata.fields
      .filter((field: any) => ['date', 'datetime', 'timestamp'].includes(field.data_type))
      .map((field: any) => field.field_name);
    
    console.log('Date fields (suitable for time-based analysis):', dateFields);
    
    // Now get a sample of actual data to verify
    const dataUrl = new URL(`${API_BASE_URL}/get/${agency}/${endpoint}/${format}`);
    dataUrl.searchParams.append('X-API-KEY', API_KEY);
    dataUrl.searchParams.append('limit', '5');
    
    const dataResponse = await fetch(dataUrl.toString());
    const data = await dataResponse.json();
    
    console.log('\nSample data record:');
    console.log(JSON.stringify(data.data[0], null, 2));
    
    return {
      metadata,
      fieldTypes,
      numericFields,
      dateFields,
      sampleData: data.data
    };
  } catch (error) {
    console.error('Error analyzing dataset structure:', error);
    throw error;
  }
}

/**
 * Advanced Examples - Combining Multiple Features
 */

// Advanced example: Paginated data retrieval with filtering and sorting
async function advancedDataRetrieval() {
  const agency = 'osha';
  const endpoint = 'inspection';
  const format = 'json';
  
  // Configuration
  const pageSize = 100;
  const maxPages = 5;
  
  // Filter for inspections with violations in 2021
  const filter = {
    and: [
      {
        field: 'year',
        operator: 'eq',
        value: '2021'
      },
      {
        field: 'total_violations',
        operator: 'gt',
        value: 0
      }
    ]
  };
  
  const allRecords: any[] = [];
  
  try {
    for (let page = 1; page <= maxPages; page++) {
      const url = new URL(`${API_BASE_URL}/get/${agency}/${endpoint}/${format}`);
      url.searchParams.append('X-API-KEY', API_KEY);
      url.searchParams.append('limit', pageSize.toString());
      url.searchParams.append('offset', ((page - 1) * pageSize).toString());
      url.searchParams.append('filter_object', JSON.stringify(filter));
      url.searchParams.append('sort_by', 'total_violations');
      url.searchParams.append('sort', 'desc');
      url.searchParams.append('fields', 'activity_nr,inspection_date,establishment_name,total_violations,total_penalty');
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error} - ${errorData.details}`);
      }
      
      const data = await response.json();
      allRecords.push(...data.data);
      
      console.log(`Retrieved page ${page}: ${data.data.length} records`);
      
      // Stop if we've retrieved all records
      if (data.data.length < pageSize) {
        break;
      }
    }
    
    // Analyze the results
    const totalViolations = allRecords.reduce((sum, record) => sum + record.total_violations, 0);
    const totalPenalty = allRecords.reduce((sum, record) => sum + (record.total_penalty || 0), 0);
    
    console.log(`\nAnalysis of ${allRecords.length} inspections with violations in 2021:`);
    console.log(`- Total violations: ${totalViolations}`);
    console.log(`- Total penalty: $${totalPenalty.toLocaleString()}`);
    console.log(`- Average violations per inspection: ${(totalViolations / allRecords.length).toFixed(2)}`);
    console.log(`- Average penalty per inspection: $${(totalPenalty / allRecords.length).toFixed(2)}`);
    
    // Top 5 inspections by violations
    console.log('\nTop 5 inspections by violation count:');
    allRecords.slice(0, 5).forEach((record, index) => {
      console.log(`${index + 1}. ${record.establishment_name}`);
      console.log(`   Violations: ${record.total_violations}, Penalty: $${(record.total_penalty || 0).toLocaleString()}`);
    });
    
    return allRecords;
  } catch (error) {
    console.error('Error in advanced data retrieval:', error);
    throw error;
  }
}

// Utility function to handle rate limiting and retries
async function fetchWithRetry(url: string, maxRetries: number = 3): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      // If rate limited, wait and retry
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000 * attempt;
        
        console.log(`Rate limited. Waiting ${waitTime / 1000} seconds before retry ${attempt}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const waitTime = 2000 * attempt;
        console.log(`Network error. Waiting ${waitTime / 1000} seconds before retry ${attempt}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

// Example usage of all functions
async function runAllExamples() {
  console.log('=== DOL API Examples ===\n');
  
  try {
    // 1. List datasets
    console.log('1. Listing all datasets...');
    await listDatasets();
    console.log('\n');
    
    // 2. Find OSHA datasets
    console.log('2. Finding OSHA datasets...');
    await findDatasetsByAgency('OSHA');
    console.log('\n');
    
    // 3. Get basic data
    console.log('3. Getting basic inspection data...');
    await getBasicData();
    console.log('\n');
    
    // 4. Get paginated data
    console.log('4. Getting paginated accident data...');
    await getDataWithPagination(1, 50);
    console.log('\n');
    
    // 5. Get data with field selection
    console.log('5. Getting data with selected fields...');
    await getDataWithFieldSelection();
    console.log('\n');
    
    // 6. Get sorted data
    console.log('6. Getting sorted inspection data...');
    await getDataWithSorting();
    console.log('\n');
    
    // 7. Get filtered data
    console.log('7. Getting filtered accident data...');
    await getDataWithSimpleFilter();
    console.log('\n');
    
    // 8. Get data with complex filter
    console.log('8. Getting data with complex filter...');
    await getDataWithComplexFilter();
    console.log('\n');
    
    // 9. Get metadata
    console.log('9. Getting dataset metadata...');
    await getMetadata();
    console.log('\n');
    
    // 10. Analyze dataset structure
    console.log('10. Analyzing dataset structure...');
    await analyzeDatasetStructure();
    console.log('\n');
    
    // 11. Advanced data retrieval
    console.log('11. Advanced data retrieval with multiple features...');
    await advancedDataRetrieval();
    
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Export all functions for use in other modules
export {
  listDatasets,
  findDatasetsByAgency,
  getBasicData,
  getDataWithPagination,
  getDataWithFieldSelection,
  getDataWithSorting,
  getDataWithSimpleFilter,
  getDataWithComplexFilter,
  getDataAsJSON,
  getDataAsXML,
  getDataAsCSV,
  getMetadata,
  analyzeDatasetStructure,
  advancedDataRetrieval,
  fetchWithRetry,
  runAllExamples
};