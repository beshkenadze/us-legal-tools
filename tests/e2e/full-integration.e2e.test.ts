import { describe, expect, it, beforeAll } from 'bun:test';
import { getECFRAPIDocumentation } from '../../src/api/generated/endpoints';
import * as handlers from '../../src/mcp/handlers';

const SKIP_E2E = process.env.SKIP_E2E_TESTS === 'true';

describe.skipIf(SKIP_E2E)('E2E: Full Integration', () => {
  let api: ReturnType<typeof getECFRAPIDocumentation>;

  beforeAll(() => {
    api = getECFRAPIDocumentation();
  });

  describe('SDK to MCP Handler Integration', () => {
    it('should fetch agencies through SDK and format through MCP handler', async () => {
      // Fetch data through SDK
      const apiResponse = await api.getApiAdminV1AgenciesJson();
      
      expect(apiResponse).toBeDefined();
      expect(apiResponse.agencies).toBeDefined();

      // Process through MCP handler
      const handlerResponse = await handlers.getApiAdminV1AgenciesJsonHandler();
      
      expect(handlerResponse).toHaveProperty('content');
      expect(handlerResponse.content).toHaveLength(1);
      expect(handlerResponse.content[0].type).toBe('text');
      
      // Parse handler response
      const handlerData = JSON.parse(handlerResponse.content[0].text);
      expect(handlerData).toHaveProperty('agencies');
      expect(handlerData.agencies.length).toBeGreaterThan(0);
    }, 30000);

    it('should search and format results through complete pipeline', async () => {
      const searchParams = {
        q: 'agriculture',
        title: '7',
        page: 1,
        per_page: 5
      };

      // SDK call
      const apiResponse = await api.getApiSearchV1Results(searchParams);
      expect(apiResponse).toBeDefined();
      expect(apiResponse.results).toBeDefined();

      // MCP handler call
      const handlerResponse = await handlers.getApiSearchV1ResultsHandler({
        queryParams: searchParams
      });

      expect(handlerResponse).toHaveProperty('content');
      const handlerData = JSON.parse(handlerResponse.content[0].text);
      
      // Both should return similar structure
      expect(handlerData).toHaveProperty('results');
      expect(handlerData).toHaveProperty('meta');
      expect(handlerData.results.length).toBeLessThanOrEqual(5);
    }, 30000);
  });

  describe('Complex Query Scenarios', () => {
    it('should handle date range queries for versions', async () => {
      const title = '7';
      const startDate = '2022-01-01';
      const endDate = '2023-12-31';

      // Get versions within date range
      const versionsResponse = await api.getApiVersionerV1VersionsTitleTitleJson(title, {
        gte: startDate,
        lte: endDate
      });

      expect(versionsResponse).toBeDefined();
      expect(versionsResponse.versions).toBeDefined();
      expect(Array.isArray(versionsResponse.versions)).toBe(true);

      // All versions should be within the date range
      versionsResponse.versions.forEach(version => {
        const issueDate = new Date(version.issue_date);
        expect(issueDate >= new Date(startDate)).toBe(true);
        expect(issueDate <= new Date(endDate)).toBe(true);
      });
    }, 30000);

    it('should handle hierarchical navigation', async () => {
      const date = '2023-01-01';
      const title = '7';

      // Get title structure
      const structureResponse = await api.getApiVersionerV1StructureDateTitleTitleJson(date, title);
      expect(structureResponse.structure).toBeDefined();

      // Navigate to first part if available
      if (structureResponse.structure.children && structureResponse.structure.children.length > 0) {
        const firstChild = structureResponse.structure.children[0];
        
        if (firstChild.type === 'part' && firstChild.identifier) {
          // Get ancestry for this part
          const ancestryResponse = await api.getApiVersionerV1AncestryDateTitleTitleJson(
            date,
            title,
            { part: firstChild.identifier }
          );

          expect(ancestryResponse.ancestry).toBeDefined();
          expect(ancestryResponse.ancestry.length).toBeGreaterThanOrEqual(2);
          
          // Verify ancestry includes both title and part
          const ancestryTypes = ancestryResponse.ancestry.map(a => a.type);
          expect(ancestryTypes).toContain('title');
          expect(ancestryTypes).toContain('part');
        }
      }
    }, 30000);

    it('should cross-reference search results with structure', async () => {
      const searchQuery = 'definitions';
      const title = '7';
      const date = '2023-01-01';

      // Search for content
      const searchResponse = await api.getApiSearchV1Results({
        q: searchQuery,
        title: title,
        per_page: 10
      });

      expect(searchResponse.results).toBeDefined();

      if (searchResponse.results.length > 0) {
        // Get structure to verify search results exist in hierarchy
        const structureResponse = await api.getApiVersionerV1StructureDateTitleTitleJson(date, title);
        
        expect(structureResponse.structure).toBeDefined();
        
        // Search results should reference valid hierarchy paths
        searchResponse.results.forEach(result => {
          expect(result).toHaveProperty('hierarchy');
          expect(result.hierarchy).toHaveProperty('title');
          expect(result.hierarchy.title).toBe(title);
        });
      }
    }, 30000);
  });

  describe('Data Validation and Consistency', () => {
    it('should maintain consistency across corrections and versions', async () => {
      const title = '7';
      
      // Get corrections
      const correctionsResponse = await api.getApiAdminV1CorrectionsTitleTitleJson(title);
      
      if (correctionsResponse.ecfr_corrections.length > 0) {
        // Get a date from corrections
        const correction = correctionsResponse.ecfr_corrections[0];
        const correctionDate = correction.error_occurred;
        
        // Get versions around that date
        const versionsResponse = await api.getApiVersionerV1VersionsTitleTitleJson(title, {
          gte: correctionDate
        });
        
        expect(versionsResponse.versions).toBeDefined();
        
        // Versions should reflect updates after corrections
        if (versionsResponse.versions.length > 0) {
          const version = versionsResponse.versions[0];
          expect(new Date(version.last_amendment_date) >= new Date(correctionDate)).toBe(true);
        }
      }
    }, 30000);

    it('should validate agency references in structure', async () => {
      // Get agencies
      const agenciesResponse = await api.getApiAdminV1AgenciesJson();
      expect(agenciesResponse.agencies).toBeDefined();
      
      // Find an agency with CFR references
      const agencyWithRefs = agenciesResponse.agencies.find(
        agency => agency.cfr_references && agency.cfr_references.length > 0
      );
      
      if (agencyWithRefs) {
        const cfrRef = agencyWithRefs.cfr_references[0];
        const title = cfrRef.title.toString();
        
        // Verify the title exists
        const titlesResponse = await api.getApiVersionerV1TitlesJson();
        const titleExists = titlesResponse.titles.some(t => t.title === title);
        
        expect(titleExists).toBe(true);
      }
    }, 30000);
  });

  describe('Performance and Pagination', () => {
    it('should handle large result sets with pagination', async () => {
      const query = 'the'; // Common word for many results
      const perPage = 20;
      
      // Get first page
      const firstPageResponse = await api.getApiSearchV1Results({
        q: query,
        page: 1,
        per_page: perPage
      });
      
      expect(firstPageResponse.meta).toBeDefined();
      expect(firstPageResponse.meta.total_count).toBeGreaterThan(perPage);
      expect(firstPageResponse.results.length).toBeLessThanOrEqual(perPage);
      
      // Get second page if available
      if (firstPageResponse.meta.total_pages > 1) {
        const secondPageResponse = await api.getApiSearchV1Results({
          q: query,
          page: 2,
          per_page: perPage
        });
        
        expect(secondPageResponse.results).toBeDefined();
        expect(secondPageResponse.meta.page).toBe(2);
        
        // Results should be different
        const firstIds = firstPageResponse.results.map(r => r.hierarchy);
        const secondIds = secondPageResponse.results.map(r => r.hierarchy);
        
        // No overlap between pages
        const overlap = firstIds.filter(id => 
          secondIds.some(sid => JSON.stringify(sid) === JSON.stringify(id))
        );
        expect(overlap.length).toBe(0);
      }
    }, 30000);
  });

  describe('Real-World Use Cases', () => {
    it('should find and retrieve specific regulation content', async () => {
      // Search for a specific topic
      const searchResponse = await api.getApiSearchV1Results({
        q: 'organic certification',
        title: '7',
        per_page: 5
      });
      
      expect(searchResponse.results).toBeDefined();
      
      if (searchResponse.results.length > 0) {
        const result = searchResponse.results[0];
        const hierarchy = result.hierarchy;
        
        // Get the ancestry for this result
        const ancestryResponse = await api.getApiVersionerV1AncestryDateTitleTitleJson(
          '2023-01-01',
          hierarchy.title,
          {
            part: hierarchy.part,
            section: hierarchy.section
          }
        );
        
        expect(ancestryResponse.ancestry).toBeDefined();
        expect(ancestryResponse.ancestry.length).toBeGreaterThan(0);
        
        // The ancestry should provide full context
        const ancestryLabels = ancestryResponse.ancestry.map(a => a.label);
        expect(ancestryLabels.length).toBeGreaterThan(1);
      }
    }, 30000);

    it('should track regulatory changes over time', async () => {
      const title = '7';
      const historicalDate = '2022-01-01';
      const currentDate = '2023-12-31';
      
      // Get versions at two different dates
      const [historicalVersions, currentVersions] = await Promise.all([
        api.getApiVersionerV1VersionsTitleTitleJson(title, { on: historicalDate }),
        api.getApiVersionerV1VersionsTitleTitleJson(title, { on: currentDate })
      ]);
      
      expect(historicalVersions.versions).toBeDefined();
      expect(currentVersions.versions).toBeDefined();
      
      // There should be differences indicating updates
      if (historicalVersions.versions.length > 0 && currentVersions.versions.length > 0) {
        // Count of versions might differ
        console.log(`Historical versions: ${historicalVersions.versions.length}`);
        console.log(`Current versions: ${currentVersions.versions.length}`);
      }
    }, 30000);
  });
});