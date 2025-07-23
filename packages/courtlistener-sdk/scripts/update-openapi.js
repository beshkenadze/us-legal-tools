#!/usr/bin/env bun
/**
 * CourtListener OpenAPI Specification Generator
 * 
 * This script automates the process of scraping CourtListener API documentation
 * and generating a comprehensive OpenAPI 3.0.3 specification.
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { chromium } from 'playwright';

const URLS = {
  apiRoot: 'https://www.courtlistener.com/api/rest/v4/?format=json',
  searchOperators: 'https://www.courtlistener.com/help/search-operators/',
  citationLookup: 'https://www.courtlistener.com/help/api/rest/citation-lookup/',
  search: 'https://www.courtlistener.com/help/api/rest/search/',
  caseLaw: 'https://www.courtlistener.com/help/api/rest/case-law/',
  judges: 'https://www.courtlistener.com/help/api/rest/judges/',
  financialDisclosures: 'https://www.courtlistener.com/help/api/rest/financial-disclosures/',
  oralArguments: 'https://www.courtlistener.com/help/api/rest/oral-arguments/',
  pacer: 'https://www.courtlistener.com/help/api/rest/pacer/'
};

class OpenAPIGenerator {
  constructor() {
    this.browser = null;
    this.page = null;
    this.apiData = {};
    this.openApiSpec = {
      openapi: '3.0.3',
      info: {
        title: 'CourtListener REST API',
        description: 'Comprehensive API for accessing court data, case law, judicial information, and legal documents',
        version: '4.0.0',
        contact: {
          name: 'CourtListener',
          url: 'https://www.courtlistener.com/',
          email: 'info@courtlistener.com'
        },
        license: {
          name: 'BSD 2-Clause License',
          url: 'https://github.com/freelawproject/courtlistener/blob/main/LICENSE'
        }
      },
      servers: [
        {
          url: 'https://www.courtlistener.com/api/rest/v4',
          description: 'CourtListener REST API v4'
        }
      ],
      security: [
        {
          TokenAuth: []
        }
      ],
      components: {
        securitySchemes: {
          TokenAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Token-based authentication. Use format: "Token <your-token>"'
          }
        },
        schemas: {},
        parameters: {
          cursor: {
            name: 'cursor',
            in: 'query',
            description: 'Cursor for pagination',
            required: false,
            schema: {
              type: 'string'
            }
          },
          ordering: {
            name: 'ordering',
            in: 'query',
            description: 'Field to order results by',
            required: false,
            schema: {
              type: 'string'
            }
          }
        }
      },
      paths: {},
      tags: [
        { name: 'Search', description: 'Search operations across all content types' },
        { name: 'Citations', description: 'Citation lookup and normalization' },
        { name: 'Case Law', description: 'Court opinions, dockets, and case clusters' },
        { name: 'Judges', description: 'Judicial information and biographies' },
        { name: 'Oral Arguments', description: 'Audio recordings and transcripts' },
        { name: 'Financial Disclosures', description: 'Judicial financial disclosure documents' },
        { name: 'PACER', description: 'PACER integration and data' },
        { name: 'Courts', description: 'Court information and hierarchy' }
      ]
    };
  }

  async init() {
    console.log('🚀 Starting OpenAPI generation...');
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();

    // Set user agent to avoid blocking
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    });
  }

  async fetchApiRoot() {
    console.log('📡 Fetching API root...');
    try {
      await this.page.goto(URLS.apiRoot, { waitUntil: 'networkidle' });
      const apiRoot = await this.page.evaluate(() => {
        return JSON.parse(document.body.innerText);
      });

      this.apiData.root = apiRoot;
      console.log(`✅ Found ${Object.keys(apiRoot).length} root endpoints`);

      // Explore each endpoint to get schema information
      for (const [key, url] of Object.entries(apiRoot)) {
        if (typeof url === 'string' && url.includes('courtlistener.com')) {
          await this.exploreEndpoint(key, url);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching API root:', error.message);
    }
  }

  async exploreEndpoint(name, url) {
    try {
      console.log(`🔍 Exploring endpoint: ${name}`);
      await this.page.goto(`${url}?format=json`, { waitUntil: 'networkidle' });
      const data = await this.page.evaluate(() => {
        try {
          return JSON.parse(document.body.innerText);
        } catch {
          return null;
        }
      });

      if (data) {
        this.apiData[name] = data;
        console.log(`✅ Collected data for ${name}`);
      }
    } catch (error) {
      console.log(`⚠️ Could not explore ${name}: ${error.message}`);
    }
  }

  async scrapeDocumentationPage(url, pageName) {
    console.log(`📖 Scraping documentation: ${pageName}`);
    try {
      await this.page.goto(url, { waitUntil: 'networkidle' });

      const content = await this.page.evaluate(() => {
        // Extract main content from the documentation page
        const main = document.querySelector('main, .content, #content, .documentation');
        return main ? main.innerText : document.body.innerText;
      });

      this.apiData[`docs_${pageName}`] = content;
      console.log(`✅ Scraped ${pageName} documentation`);
    } catch (error) {
      console.error(`❌ Error scraping ${pageName}:`, error.message);
    }
  }

  async scrapeAllDocumentation() {
    console.log('📚 Scraping all documentation pages...');

    const pages = [
      { url: URLS.searchOperators, name: 'search_operators' },
      { url: URLS.citationLookup, name: 'citation_lookup' },
      { url: URLS.search, name: 'search' },
      { url: URLS.caseLaw, name: 'case_law' },
      { url: URLS.judges, name: 'judges' },
      { url: URLS.financialDisclosures, name: 'financial_disclosures' },
      { url: URLS.oralArguments, name: 'oral_arguments' },
      { url: URLS.pacer, name: 'pacer' }
    ];

    for (const page of pages) {
      await this.scrapeDocumentationPage(page.url, page.name);
      // Add delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  generateSearchEndpoints() {
    console.log('🔍 Generating search endpoints...');

    this.openApiSpec.paths['/search/'] = {
      get: {
        tags: ['Search'],
        summary: 'Universal search across all content types',
        description: `Search across opinions, oral arguments, judges, and other content types.
        
Supports advanced query operators:
- AND, OR, NOT operators
- Quoted phrases for exact matches
- Wildcards (*) and fuzzy search (~)
- Field-specific searches (caseName:, court_id:, dateFiled:, etc.)
- Date ranges and numeric ranges
- Boolean combinations

Search Types:
- o: Opinions
- r: Oral Arguments
- rd: Oral Argument Recordings  
- d: Dockets
- p: People (Judges)
- oa: Oral Arguments (alternate)`,
        parameters: [
          {
            name: 'q',
            in: 'query',
            description: 'Search query with optional operators and field specifications',
            required: false,
            schema: { type: 'string' },
            example: 'caseName:"Brown v Board" AND dateFiled:[1950 TO 1960]'
          },
          {
            name: 'type',
            in: 'query',
            description: 'Content type to search',
            required: false,
            schema: {
              type: 'string',
              enum: ['o', 'r', 'rd', 'd', 'p', 'oa'],
              default: 'o'
            }
          },
          {
            name: 'order_by',
            in: 'query',
            description: 'Field to order results by',
            required: false,
            schema: { type: 'string' },
            example: 'dateFiled desc'
          },
          {
            name: 'highlight',
            in: 'query',
            description: 'Enable search term highlighting',
            required: false,
            schema: {
              type: 'string',
              enum: ['on', 'off'],
              default: 'off'
            }
          },
          { $ref: '#/components/parameters/cursor' }
        ],
        responses: {
          '200': {
            description: 'Search results',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    count: { type: 'integer' },
                    next: { type: 'string', nullable: true },
                    previous: { type: 'string', nullable: true },
                    results: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/SearchResult' }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Bad request - invalid query syntax'
          },
          '429': {
            description: 'Rate limit exceeded'
          }
        }
      }
    };
  }

  generateCitationEndpoints() {
    console.log('📑 Generating citation endpoints...');

    this.openApiSpec.paths['/citations/lookup/'] = {
      post: {
        tags: ['Citations'],
        summary: 'Lookup and normalize citations',
        description: `Lookup citations either from text blob or specific volume/reporter/page.
        
Rate Limits:
- 60 citations per minute
- 250 citations per request maximum
        
Returns normalized citation data with links to full text when available.`,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    type: 'object',
                    properties: {
                      text: {
                        type: 'string',
                        description: 'Text blob containing citations to extract'
                      }
                    },
                    required: ['text']
                  },
                  {
                    type: 'object',
                    properties: {
                      volume: { type: 'string' },
                      reporter: { type: 'string' },
                      page: { type: 'string' }
                    },
                    required: ['volume', 'reporter', 'page']
                  }
                ]
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Citation lookup results',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/CitationResult' }
                }
              }
            }
          },
          '300': {
            description: 'Multiple citations found - disambiguation needed'
          },
          '400': {
            description: 'Invalid citation format'
          },
          '404': {
            description: 'Citation not found'
          },
          '429': {
            description: 'Rate limit exceeded',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    detail: { type: 'string' },
                    wait_util: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      }
    };
  }

  generateCommonSchemas() {
    console.log('📋 Generating common schemas...');

    this.openApiSpec.components.schemas = {
      SearchResult: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          absolute_url: { type: 'string', format: 'uri' },
          caseName: { type: 'string' },
          court: { type: 'string' },
          dateFiled: { type: 'string', format: 'date' },
          snippet: { type: 'string' },
          score: { type: 'number', format: 'float' },
          highlight: {
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      },

      CitationResult: {
        type: 'object',
        properties: {
          citation: { type: 'string' },
          normalized_citation: { type: 'string' },
          absolute_url: { type: 'string', format: 'uri' },
          cluster_id: { type: 'integer' },
          opinion_id: { type: 'integer' },
          court: { type: 'string' },
          caseName: { type: 'string' },
          dateFiled: { type: 'string', format: 'date' }
        }
      },

      Opinion: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          resource_uri: { type: 'string', format: 'uri' },
          absolute_url: { type: 'string', format: 'uri' },
          cluster: { type: 'string', format: 'uri' },
          author: { type: 'string', format: 'uri', nullable: true },
          joined_by: {
            type: 'array',
            items: { type: 'string', format: 'uri' }
          },
          type: { type: 'string' },
          sha1: { type: 'string' },
          page_count: { type: 'integer', nullable: true },
          download_url: { type: 'string', format: 'uri', nullable: true },
          local_path: { type: 'string', nullable: true },
          plain_text: { type: 'string' },
          html: { type: 'string' },
          html_lawbox: { type: 'string' },
          html_columbia: { type: 'string' },
          html_anon_2020: { type: 'string' },
          xml_harvard: { type: 'string' },
          html_with_citations: { type: 'string' },
          extracted_by_ocr: { type: 'boolean' },
          date_created: { type: 'string', format: 'date-time' },
          date_modified: { type: 'string', format: 'date-time' }
        }
      },

      Cluster: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          resource_uri: { type: 'string', format: 'uri' },
          absolute_url: { type: 'string', format: 'uri' },
          panel: {
            type: 'array',
            items: { type: 'string', format: 'uri' }
          },
          non_participating_judges: {
            type: 'array',
            items: { type: 'string', format: 'uri' }
          },
          judges: { type: 'string' },
          date_created: { type: 'string', format: 'date-time' },
          date_modified: { type: 'string', format: 'date-time' },
          date_filed: { type: 'string', format: 'date' },
          date_filed_is_approximate: { type: 'boolean' },
          slug: { type: 'string' },
          case_name_short: { type: 'string' },
          case_name: { type: 'string' },
          case_name_full: { type: 'string' },
          scdb_id: { type: 'string' },
          scdb_decision_direction: { type: 'integer', nullable: true },
          scdb_votes_majority: { type: 'integer', nullable: true },
          scdb_votes_minority: { type: 'integer', nullable: true },
          source: { type: 'string' },
          procedural_history: { type: 'string' },
          attorneys: { type: 'string' },
          nature_of_suit: { type: 'string' },
          posture: { type: 'string' },
          syllabus: { type: 'string' },
          headnotes: { type: 'string' },
          summary: { type: 'string' },
          disposition: { type: 'string' },
          history: { type: 'string' },
          other_dates: { type: 'string' },
          cross_reference: { type: 'string' },
          correction: { type: 'string' },
          citation_count: { type: 'integer' },
          precedential_status: { type: 'string' },
          date_blocked: { type: 'string', format: 'date', nullable: true },
          blocked: { type: 'boolean' },
          docket: { type: 'string', format: 'uri' },
          citations: {
            type: 'array',
            items: { type: 'string', format: 'uri' }
          },
          sub_opinions: {
            type: 'array',
            items: { type: 'string', format: 'uri' }
          }
        }
      },

      Court: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          resource_uri: { type: 'string', format: 'uri' },
          url: { type: 'string', format: 'uri' },
          full_name: { type: 'string' },
          short_name: { type: 'string' },
          citation_string: { type: 'string' },
          in_use: { type: 'boolean' },
          has_opinion_scraper: { type: 'boolean' },
          has_oral_argument_scraper: { type: 'boolean' },
          position: { type: 'number', format: 'float' },
          start_date: { type: 'string', format: 'date', nullable: true },
          end_date: { type: 'string', format: 'date', nullable: true },
          jurisdiction: { type: 'string' },
          date_created: { type: 'string', format: 'date-time' },
          date_modified: { type: 'string', format: 'date-time' }
        }
      },

      Person: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          resource_uri: { type: 'string', format: 'uri' },
          absolute_url: { type: 'string', format: 'uri' },
          name_first: { type: 'string' },
          name_middle: { type: 'string' },
          name_last: { type: 'string' },
          name_suffix: { type: 'string' },
          date_dob: { type: 'string', format: 'date', nullable: true },
          date_granularity_dob: { type: 'string' },
          date_dod: { type: 'string', format: 'date', nullable: true },
          date_granularity_dod: { type: 'string' },
          slug: { type: 'string' },
          gender: { type: 'string' },
          religion: { type: 'string' },
          ftm_total_received: { type: 'number', format: 'float', nullable: true },
          ftm_eid: { type: 'string' },
          has_photo: { type: 'boolean' },
          date_created: { type: 'string', format: 'date-time' },
          date_modified: { type: 'string', format: 'date-time' },
          positions: {
            type: 'array',
            items: { type: 'string', format: 'uri' }
          }
        }
      },

      Audio: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          resource_uri: { type: 'string', format: 'uri' },
          absolute_url: { type: 'string', format: 'uri' },
          case_name: { type: 'string' },
          case_name_short: { type: 'string' },
          case_name_full: { type: 'string' },
          judges: { type: 'string' },
          docket: { type: 'string', format: 'uri' },
          source: { type: 'string' },
          sha1: { type: 'string' },
          download_url: { type: 'string', format: 'uri', nullable: true },
          local_path_mp3: { type: 'string', nullable: true },
          local_path_original_file: { type: 'string', nullable: true },
          filepath_ia: { type: 'string' },
          ia_upload_failure_count: { type: 'integer', nullable: true },
          duration: { type: 'integer', nullable: true },
          processing_complete: { type: 'boolean' },
          date_created: { type: 'string', format: 'date-time' },
          date_modified: { type: 'string', format: 'date-time' },
          blocked: { type: 'boolean' },
          date_blocked: { type: 'string', format: 'date', nullable: true }
        }
      },

      PaginatedResponse: {
        type: 'object',
        properties: {
          count: {
            type: 'integer',
            description: 'Total number of results'
          },
          next: {
            type: 'string',
            format: 'uri',
            nullable: true,
            description: 'URL for next page of results'
          },
          previous: {
            type: 'string',
            format: 'uri',
            nullable: true,
            description: 'URL for previous page of results'
          },
          results: {
            type: 'array',
            description: 'Array of result objects'
          }
        },
        required: ['count', 'results']
      }
    };
  }

  generateEndpointsFromApiRoot() {
    console.log('🛠️ Generating endpoints from API root...');

    if (!this.apiData.root) return;

    const commonEndpoints = [
      'clusters', 'opinions', 'dockets', 'courts', 'people',
      'audio', 'positions', 'citations', 'originating-court-information'
    ];

    commonEndpoints.forEach(endpoint => {
      if (this.apiData.root[endpoint]) {
        this.generateCRUDEndpoint(endpoint);
      }
    });
  }

  generateCRUDEndpoint(endpoint) {
    const endpointName = `/${endpoint}/`;
    const itemName = `/${endpoint}/{id}/`;

    // Determine the appropriate tag
    let tag = 'Case Law';
    if (endpoint.includes('people') || endpoint.includes('position')) tag = 'Judges';
    if (endpoint.includes('audio')) tag = 'Oral Arguments';
    if (endpoint.includes('court')) tag = 'Courts';
    if (endpoint.includes('citation')) tag = 'Citations';

    // List endpoint
    this.openApiSpec.paths[endpointName] = {
      get: {
        tags: [tag],
        summary: `List ${endpoint}`,
        description: `Retrieve a paginated list of ${endpoint}`,
        parameters: [
          { $ref: '#/components/parameters/cursor' },
          { $ref: '#/components/parameters/ordering' }
        ],
        responses: {
          '200': {
            description: `List of ${endpoint}`,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' }
              }
            }
          }
        }
      }
    };

    // Detail endpoint
    this.openApiSpec.paths[itemName] = {
      get: {
        tags: [tag],
        summary: `Get ${endpoint.slice(0, -1)} details`,
        description: `Retrieve detailed information for a specific ${endpoint.slice(0, -1)}`,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: `Unique identifier for the ${endpoint.slice(0, -1)}`
          }
        ],
        responses: {
          '200': {
            description: `${endpoint.slice(0, -1)} details`,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: `Detailed ${endpoint.slice(0, -1)} object`
                }
              }
            }
          },
          '404': {
            description: `${endpoint.slice(0, -1)} not found`
          }
        }
      }
    };
  }

  async generateOpenAPISpec() {
    console.log('📝 Generating complete OpenAPI specification...');

    // Generate different sections
    this.generateSearchEndpoints();
    this.generateCitationEndpoints();
    this.generateCommonSchemas();
    this.generateEndpointsFromApiRoot();

    console.log('✅ OpenAPI specification generated successfully');
  }

  async saveSpecification() {
    const outputPath = join(process.cwd(), 'courtlistener-openapi.json');

    console.log('💾 Saving OpenAPI specification...');
    writeFileSync(outputPath, JSON.stringify(this.openApiSpec, null, 2));
    console.log(`✅ Saved to: ${outputPath}`);

    // Also save collected API data for reference
    const dataPath = join(process.cwd(), 'api-data.json');
    writeFileSync(dataPath, JSON.stringify(this.apiData, null, 2));
    console.log(`📊 API data saved to: ${dataPath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.init();
      await this.fetchApiRoot();
      await this.scrapeAllDocumentation();
      await this.generateOpenAPISpec();
      await this.saveSpecification();

      console.log('🎉 OpenAPI generation completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Validate the OpenAPI spec at https://editor.swagger.io/');
      console.log('2. Review the generated endpoints and schemas');
      console.log('3. Update SDK generation if needed');

    } catch (error) {
      console.error('❌ Error during OpenAPI generation:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Run the generator
const generator = new OpenAPIGenerator();
generator.run().catch(console.error);