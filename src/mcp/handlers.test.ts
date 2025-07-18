import { describe, expect, it, mock, beforeEach } from 'bun:test';
import * as handlers from './handlers';
import * as httpClient from './http-client';

// Mock the http-client module
mock.module('./http-client', () => ({
  getApiAdminV1AgenciesJson: mock(() => Promise.resolve({ agencies: [] })),
  getApiAdminV1CorrectionsJson: mock(() => Promise.resolve({ ecfr_corrections: [] })),
  getApiAdminV1CorrectionsTitleTitleJson: mock(() => Promise.resolve({ ecfr_corrections: [] })),
  getApiSearchV1Results: mock(() => Promise.resolve({ results: [] })),
  getApiSearchV1Count: mock(() => Promise.resolve({ count: 0 })),
  getApiSearchV1Summary: mock(() => Promise.resolve({ summary: {} })),
  getApiSearchV1CountsDaily: mock(() => Promise.resolve({ counts: [] })),
  getApiSearchV1CountsTitles: mock(() => Promise.resolve({ counts: [] })),
  getApiSearchV1CountsHierarchy: mock(() => Promise.resolve({ counts: [] })),
  getApiSearchV1Suggestions: mock(() => Promise.resolve({ suggestions: [] })),
  getApiVersionerV1AncestryDateTitleTitleJson: mock(() => Promise.resolve({ ancestry: [] })),
  getApiVersionerV1FullDateTitleTitleXml: mock(() => Promise.resolve('<xml></xml>')),
  getApiVersionerV1StructureDateTitleTitleJson: mock(() => Promise.resolve({ structure: {} })),
  getApiVersionerV1TitlesJson: mock(() => Promise.resolve({ titles: [] })),
  getApiVersionerV1VersionsTitleTitleJson: mock(() => Promise.resolve({ versions: [] })),
}));

describe('MCP Handlers', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mock.restore();
  });

  describe('getApiAdminV1AgenciesJsonHandler', () => {
    it('should return agencies data as text content', async () => {
      const mockData = {
        agencies: [
          {
            name: 'Test Agency',
            short_name: 'TA',
            slug: 'test-agency',
            children: [],
          },
        ],
      };

      mock.module('./http-client', () => ({
        getApiAdminV1AgenciesJson: mock(() => Promise.resolve(mockData)),
      }));

      const result = await handlers.getApiAdminV1AgenciesJsonHandler();

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockData),
          },
        ],
      });
    });
  });

  describe('getApiAdminV1CorrectionsJsonHandler', () => {
    it('should return corrections data with query params', async () => {
      const mockData = {
        ecfr_corrections: [
          {
            id: 1,
            title: 7,
            corrective_action: 'Amended',
            error_corrected: '2023-01-01',
          },
        ],
      };

      const queryParams = {
        date: '2023-01-01',
        title: '7',
      };

      mock.module('./http-client', () => ({
        getApiAdminV1CorrectionsJson: mock(() => Promise.resolve(mockData)),
      }));

      const result = await handlers.getApiAdminV1CorrectionsJsonHandler({
        queryParams,
      });

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockData),
          },
        ],
      });
    });
  });

  describe('getApiAdminV1CorrectionsTitleTitleJsonHandler', () => {
    it('should return corrections for specific title', async () => {
      const mockData = {
        ecfr_corrections: [
          {
            id: 1,
            title: 7,
            corrective_action: 'Amended',
          },
        ],
      };

      mock.module('./http-client', () => ({
        getApiAdminV1CorrectionsTitleTitleJson: mock(() => Promise.resolve(mockData)),
      }));

      const result = await handlers.getApiAdminV1CorrectionsTitleTitleJsonHandler({
        pathParams: { title: '7' },
      });

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockData),
          },
        ],
      });
    });
  });

  describe('getApiSearchV1ResultsHandler', () => {
    it('should return search results', async () => {
      const mockData = {
        results: [
          {
            title: 'Test Result',
            url: 'https://example.com',
          },
        ],
      };

      const queryParams = {
        q: 'test query',
      };

      mock.module('./http-client', () => ({
        getApiSearchV1Results: mock(() => Promise.resolve(mockData)),
      }));

      const result = await handlers.getApiSearchV1ResultsHandler({
        queryParams,
      });

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockData),
          },
        ],
      });
    });
  });

  describe('getApiSearchV1CountHandler', () => {
    it('should return search count', async () => {
      const mockData = { count: 42 };

      const queryParams = {
        q: 'test query',
      };

      mock.module('./http-client', () => ({
        getApiSearchV1Count: mock(() => Promise.resolve(mockData)),
      }));

      const result = await handlers.getApiSearchV1CountHandler({
        queryParams,
      });

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockData),
          },
        ],
      });
    });
  });

  describe('getApiSearchV1SummaryHandler', () => {
    it('should return search summary', async () => {
      const mockData = {
        summary: {
          total: 100,
          pages: 10,
        },
      };

      const queryParams = {
        q: 'test query',
      };

      mock.module('./http-client', () => ({
        getApiSearchV1Summary: mock(() => Promise.resolve(mockData)),
      }));

      const result = await handlers.getApiSearchV1SummaryHandler({
        queryParams,
      });

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockData),
          },
        ],
      });
    });
  });

  describe('getApiSearchV1CountsDailyHandler', () => {
    it('should return daily search counts', async () => {
      const mockData = {
        counts: [
          {
            date: '2023-01-01',
            count: 10,
          },
        ],
      };

      const queryParams = {
        q: 'test query',
      };

      mock.module('./http-client', () => ({
        getApiSearchV1CountsDaily: mock(() => Promise.resolve(mockData)),
      }));

      const result = await handlers.getApiSearchV1CountsDailyHandler({
        queryParams,
      });

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockData),
          },
        ],
      });
    });
  });

  describe('getApiVersionerV1AncestryDateTitleTitleJsonHandler', () => {
    it('should return ancestry data', async () => {
      const mockData = {
        ancestry: [
          {
            level: 'title',
            identifier: '7',
            label: 'Title 7',
          },
        ],
      };

      const pathParams = {
        date: '2023-01-01',
        title: '7',
      };

      const queryParams = {
        part: '1',
      };

      mock.module('./http-client', () => ({
        getApiVersionerV1AncestryDateTitleTitleJson: mock(() => Promise.resolve(mockData)),
      }));

      const result = await handlers.getApiVersionerV1AncestryDateTitleTitleJsonHandler({
        pathParams,
        queryParams,
      });

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockData),
          },
        ],
      });
    });
  });

  describe('getApiVersionerV1FullDateTitleTitleXmlHandler', () => {
    it('should return XML data', async () => {
      const mockData = '<xml><title>Test Title</title></xml>';

      const pathParams = {
        date: '2023-01-01',
        title: '7',
      };

      const queryParams = {
        part: '1',
      };

      mock.module('./http-client', () => ({
        getApiVersionerV1FullDateTitleTitleXml: mock(() => Promise.resolve(mockData)),
      }));

      const result = await handlers.getApiVersionerV1FullDateTitleTitleXmlHandler({
        pathParams,
        queryParams,
      });

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockData),
          },
        ],
      });
    });
  });

  describe('getApiVersionerV1StructureDateTitleTitleJsonHandler', () => {
    it('should return structure data', async () => {
      const mockData = {
        structure: {
          title: 'Title 7',
          children: [],
        },
      };

      const pathParams = {
        date: '2023-01-01',
        title: '7',
      };

      mock.module('./http-client', () => ({
        getApiVersionerV1StructureDateTitleTitleJson: mock(() => Promise.resolve(mockData)),
      }));

      const result = await handlers.getApiVersionerV1StructureDateTitleTitleJsonHandler({
        pathParams,
      });

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockData),
          },
        ],
      });
    });
  });

  describe('getApiVersionerV1TitlesJsonHandler', () => {
    it('should return titles data', async () => {
      const mockData = {
        titles: [
          {
            title: '7',
            name: 'Agriculture',
            reserved: false,
          },
        ],
      };

      mock.module('./http-client', () => ({
        getApiVersionerV1TitlesJson: mock(() => Promise.resolve(mockData)),
      }));

      const result = await handlers.getApiVersionerV1TitlesJsonHandler();

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockData),
          },
        ],
      });
    });
  });

  describe('getApiVersionerV1VersionsTitleTitleJsonHandler', () => {
    it('should return versions data', async () => {
      const mockData = {
        versions: [
          {
            identifier: '7.1',
            amendment_date: '2023-01-01',
            issue_date: '2023-01-01',
          },
        ],
      };

      const pathParams = {
        title: '7',
      };

      const queryParams = {
        on: '2023-01-01',
      };

      mock.module('./http-client', () => ({
        getApiVersionerV1VersionsTitleTitleJson: mock(() => Promise.resolve(mockData)),
      }));

      const result = await handlers.getApiVersionerV1VersionsTitleTitleJsonHandler({
        pathParams,
        queryParams,
      });

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockData),
          },
        ],
      });
    });
  });
});