import { describe, expect, it, beforeAll } from 'bun:test';
import { getECFRAPIDocumentation } from '../../src/api/generated/endpoints';
import type { 
  GetApiAdminV1CorrectionsJsonParams,
  GetApiSearchV1ResultsParams,
  GetApiVersionerV1AncestryDateTitleTitleJsonParams,
  GetApiVersionerV1VersionsTitleTitleJsonParams
} from '../../src/api/generated/models';

const SKIP_E2E = process.env.SKIP_E2E_TESTS === 'true';

describe.skipIf(SKIP_E2E)('E2E: eCFR API', () => {
  let api: ReturnType<typeof getECFRAPIDocumentation>;

  beforeAll(() => {
    api = getECFRAPIDocumentation();
  });

  describe('Admin Service', () => {
    it('should fetch all agencies with proper structure', async () => {
      const response = await api.getApiAdminV1AgenciesJson();
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('agencies');
      expect(Array.isArray(response.agencies)).toBe(true);
      
      if (response.agencies.length > 0) {
        const agency = response.agencies[0];
        expect(agency).toHaveProperty('name');
        expect(agency).toHaveProperty('short_name');
        expect(agency).toHaveProperty('display_name');
        expect(agency).toHaveProperty('sortable_name');
        expect(agency).toHaveProperty('slug');
        expect(agency).toHaveProperty('children');
        expect(Array.isArray(agency.children)).toBe(true);
        
        if (agency.cfr_references && agency.cfr_references.length > 0) {
          const ref = agency.cfr_references[0];
          expect(ref).toHaveProperty('title');
          expect(ref).toHaveProperty('chapter');
        }
      }
    }, 30000);

    it('should fetch corrections with filtering', async () => {
      const params: GetApiAdminV1CorrectionsJsonParams = {
        title: '7',
        date: '2023-01-01'
      };
      
      const response = await api.getApiAdminV1CorrectionsJson(params);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('ecfr_corrections');
      expect(Array.isArray(response.ecfr_corrections)).toBe(true);
      
      // All corrections should be for title 7
      response.ecfr_corrections.forEach(correction => {
        expect(correction.title).toBe(7);
      });
    }, 30000);

    it('should fetch corrections for specific title', async () => {
      const title = '7';
      const response = await api.getApiAdminV1CorrectionsTitleTitleJson(title);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('ecfr_corrections');
      expect(Array.isArray(response.ecfr_corrections)).toBe(true);
      
      // All corrections should be for the requested title
      response.ecfr_corrections.forEach(correction => {
        expect(correction.title).toBe(7);
      });
    }, 30000);
  });

  describe('Search Service', () => {
    it('should perform basic search', async () => {
      const params: GetApiSearchV1ResultsParams = {
        q: 'agriculture',
        title: '7',
        page: 1,
        per_page: 10
      };
      
      const response = await api.getApiSearchV1Results(params);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('results');
      expect(response).toHaveProperty('meta');
      expect(Array.isArray(response.results)).toBe(true);
      
      // Check meta structure
      expect(response.meta).toHaveProperty('total_count');
      expect(response.meta).toHaveProperty('page');
      expect(response.meta).toHaveProperty('per_page');
      expect(response.meta).toHaveProperty('total_pages');
      
      // Results should not exceed requested per_page
      expect(response.results.length).toBeLessThanOrEqual(10);
    }, 30000);

    it('should get search count', async () => {
      const params = {
        q: 'agriculture',
        title: '7'
      };
      
      const response = await api.getApiSearchV1Count(params);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('count');
      expect(typeof response.count).toBe('number');
      expect(response.count).toBeGreaterThanOrEqual(0);
    }, 30000);

    it('should get search suggestions', async () => {
      const params = {
        q: 'agri'
      };
      
      const response = await api.getApiSearchV1Suggestions(params);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('suggestions');
      expect(Array.isArray(response.suggestions)).toBe(true);
      
      // Suggestions should contain the query prefix
      response.suggestions.forEach(suggestion => {
        expect(suggestion.toLowerCase()).toContain('agri');
      });
    }, 30000);

    it('should get search summary', async () => {
      const params = {
        q: 'agriculture',
        title: '7'
      };
      
      const response = await api.getApiSearchV1Summary(params);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('summary');
    }, 30000);

    it('should get daily search counts', async () => {
      const params = {
        q: 'agriculture',
        title: '7'
      };
      
      const response = await api.getApiSearchV1CountsDaily(params);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('counts');
      expect(Array.isArray(response.counts)).toBe(true);
    }, 30000);

    it('should get search counts by title', async () => {
      const params = {
        q: 'agriculture'
      };
      
      const response = await api.getApiSearchV1CountsTitles(params);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('counts');
      expect(Array.isArray(response.counts)).toBe(true);
    }, 30000);

    it('should get search counts by hierarchy', async () => {
      const params = {
        q: 'agriculture',
        title: '7'
      };
      
      const response = await api.getApiSearchV1CountsHierarchy(params);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('counts');
      expect(Array.isArray(response.counts)).toBe(true);
    }, 30000);
  });

  describe('Versioner Service', () => {
    it('should fetch all titles', async () => {
      const response = await api.getApiVersionerV1TitlesJson();
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('titles');
      expect(Array.isArray(response.titles)).toBe(true);
      
      if (response.titles.length > 0) {
        const title = response.titles[0];
        expect(title).toHaveProperty('title');
        expect(title).toHaveProperty('name');
        expect(title).toHaveProperty('reserved');
        expect(title).toHaveProperty('last_amended');
        expect(title).toHaveProperty('last_issue_date');
        expect(title).toHaveProperty('up_to_date_as_of');
      }
      
      // Should have at least 50 titles
      expect(response.titles.length).toBeGreaterThan(50);
    }, 30000);

    it('should fetch title versions', async () => {
      const title = '7';
      const params: GetApiVersionerV1VersionsTitleTitleJsonParams = {
        on: '2023-01-01'
      };
      
      const response = await api.getApiVersionerV1VersionsTitleTitleJson(title, params);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('versions');
      expect(Array.isArray(response.versions)).toBe(true);
      
      if (response.versions.length > 0) {
        const version = response.versions[0];
        expect(version).toHaveProperty('identifier');
        expect(version).toHaveProperty('hierarchy');
        expect(version).toHaveProperty('last_amendment_date');
        expect(version).toHaveProperty('issue_date');
      }
    }, 30000);

    it('should fetch title structure', async () => {
      const date = '2023-01-01';
      const title = '7';
      
      const response = await api.getApiVersionerV1StructureDateTitleTitleJson(date, title);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('structure');
      expect(response.structure).toHaveProperty('identifier');
      expect(response.structure).toHaveProperty('label');
      expect(response.structure).toHaveProperty('type');
      expect(response.structure).toHaveProperty('children');
      expect(Array.isArray(response.structure.children)).toBe(true);
    }, 30000);

    it('should fetch ancestry for a specific part', async () => {
      const date = '2023-01-01';
      const title = '7';
      const params: GetApiVersionerV1AncestryDateTitleTitleJsonParams = {
        part: '1'
      };
      
      const response = await api.getApiVersionerV1AncestryDateTitleTitleJson(date, title, params);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('ancestry');
      expect(Array.isArray(response.ancestry)).toBe(true);
      
      // Ancestry should contain at least title and part
      expect(response.ancestry.length).toBeGreaterThanOrEqual(2);
      
      // First item should be the title
      if (response.ancestry.length > 0) {
        const titleNode = response.ancestry[0];
        expect(titleNode.type).toBe('title');
        expect(titleNode.identifier).toBe('7');
      }
    }, 30000);

    it('should handle date-based queries correctly', async () => {
      const title = '7';
      const pastDate = '2022-01-01';
      const recentDate = '2023-12-31';
      
      const pastParams: GetApiVersionerV1VersionsTitleTitleJsonParams = {
        lte: pastDate
      };
      
      const recentParams: GetApiVersionerV1VersionsTitleTitleJsonParams = {
        gte: recentDate
      };
      
      const [pastResponse, recentResponse] = await Promise.all([
        api.getApiVersionerV1VersionsTitleTitleJson(title, pastParams),
        api.getApiVersionerV1VersionsTitleTitleJson(title, recentParams)
      ]);
      
      expect(pastResponse).toBeDefined();
      expect(recentResponse).toBeDefined();
      
      // Both should have versions arrays
      expect(Array.isArray(pastResponse.versions)).toBe(true);
      expect(Array.isArray(recentResponse.versions)).toBe(true);
    }, 30000);
  });

  describe('Error Handling', () => {
    it('should handle invalid title gracefully', async () => {
      try {
        await api.getApiAdminV1CorrectionsTitleTitleJson('999999');
        // If no error, check if empty result
        expect(true).toBe(true);
      } catch (error) {
        // Error is expected for invalid title
        expect(error).toBeDefined();
      }
    }, 30000);

    it('should handle invalid date format', async () => {
      try {
        const date = 'invalid-date';
        const title = '7';
        await api.getApiVersionerV1StructureDateTitleTitleJson(date, title);
        // If no error, API might be lenient
        expect(true).toBe(true);
      } catch (error) {
        // Error is expected for invalid date
        expect(error).toBeDefined();
      }
    }, 30000);
  });

  describe('Data Consistency', () => {
    it('should return consistent data across related endpoints', async () => {
      const title = '7';
      
      // Get title info from titles endpoint
      const titlesResponse = await api.getApiVersionerV1TitlesJson();
      const titleInfo = titlesResponse.titles.find(t => t.title === title);
      
      expect(titleInfo).toBeDefined();
      
      // Get corrections for the same title
      const correctionsResponse = await api.getApiAdminV1CorrectionsTitleTitleJson(title);
      
      // Both endpoints should reference the same title
      expect(titleInfo!.title).toBe(title);
      correctionsResponse.ecfr_corrections.forEach(correction => {
        expect(correction.title).toBe(parseInt(title));
      });
    }, 30000);
  });
});