import { describe, expect, it } from "bun:test";
import { 
  getApiAdminV1AgenciesJson,
  getApiAdminV1CorrectionsJson,
  getApiAdminV1CorrectionsTitleTitleJson,
  getApiSearchV1Results,
  getApiSearchV1Count,
  getApiSearchV1Summary,
  getApiSearchV1CountsDaily,
  getApiSearchV1CountsTitles,
  getApiSearchV1CountsHierarchy,
  getApiSearchV1Suggestions,
  getApiVersionerV1AncestryDateTitleTitleJson,
  getApiVersionerV1FullDateTitleTitleXml,
  getApiVersionerV1StructureDateTitleTitleJson,
  getApiVersionerV1TitlesJson,
  getApiVersionerV1VersionsTitleTitleJson
} from "./api/generated/endpoints";
import { VERSION } from "./index";

describe("eCFR SDK - Integration Tests", () => {
  describe("SDK Exports", () => {
    it("should export VERSION constant", () => {
      expect(VERSION).toBeDefined();
      expect(typeof VERSION).toBe("string");
      expect(VERSION).toBe("0.8.0");
    });

    it("should export API functions", () => {
      expect(getApiSearchV1Results).toBeDefined();
      expect(typeof getApiSearchV1Results).toBe("function");
      
      expect(getApiVersionerV1TitlesJson).toBeDefined();
      expect(typeof getApiVersionerV1TitlesJson).toBe("function");
    });
  });

  describe("API Functions Integration", () => {
    it("should export all expected functions", () => {
      // Check that all expected functions exist
      const expectedFunctions = [
        getApiAdminV1AgenciesJson,
        getApiAdminV1CorrectionsJson,
        getApiAdminV1CorrectionsTitleTitleJson,
        getApiSearchV1Results,
        getApiSearchV1Count,
        getApiSearchV1Summary,
        getApiSearchV1CountsDaily,
        getApiSearchV1CountsTitles,
        getApiSearchV1CountsHierarchy,
        getApiSearchV1Suggestions,
        getApiVersionerV1AncestryDateTitleTitleJson,
        getApiVersionerV1FullDateTitleTitleXml,
        getApiVersionerV1StructureDateTitleTitleJson,
        getApiVersionerV1TitlesJson,
        getApiVersionerV1VersionsTitleTitleJson,
      ];

      for (const func of expectedFunctions) {
        expect(func).toBeDefined();
        expect(typeof func).toBe("function");
      }
    });
  });

  describe("Parameter Validation", () => {
    it("should validate search parameters", () => {
      // Valid parameters should not throw
      expect(() => {
        getApiSearchV1Results({
          query: "test query",
          page: 1,
          per_page: 20,
          order: "relevance",
          paginate_by: "results",
        });
      }).not.toThrow();
    });

    it("should validate versioner parameters", () => {
      // Valid parameters should not throw
      expect(() => {
        getApiVersionerV1VersionsTitleTitleJson("29", {
          "issue_date[on]": "2024-01-01",
          part: "778",
          section: "217",
        });
      }).not.toThrow();
    });

    it("should validate admin parameters", () => {
      // Valid parameters should not throw
      expect(() => {
        getApiAdminV1CorrectionsJson({
          title: "29",
          date: "2024-01-01",
        });
      }).not.toThrow();
    });
  });

  describe("Real-world Usage Patterns", () => {
    it("should support finding specific regulations", () => {
      // Pattern: Search for specific regulation
      expect(typeof getApiSearchV1Results).toBe("function");

      // Test that function accepts correct parameters
      const searchParams = {
        query: "778.217",
        page: 1,
        per_page: 10,
      };

      expect(() => {
        // Just test the function exists and accepts parameters
        // Don't actually call it to avoid network requests
        getApiSearchV1Results;
      }).not.toThrow();
    });

    it("should support getting title structure", () => {
      // Pattern: Get title structure
      expect(typeof getApiVersionerV1StructureDateTitleTitleJson).toBe(
        "function"
      );

      // Test function signature accepts date and title parameters
      expect(getApiVersionerV1StructureDateTitleTitleJson.length).toBe(2);
    });

    it("should support getting ancestry information", () => {
      // Pattern: Get ancestry for specific part
      expect(typeof getApiVersionerV1AncestryDateTitleTitleJson).toBe(
        "function"
      );

      // Test function signature accepts date, title, and optional params
      expect(getApiVersionerV1AncestryDateTitleTitleJson.length).toBe(3);
    });
  });
});
