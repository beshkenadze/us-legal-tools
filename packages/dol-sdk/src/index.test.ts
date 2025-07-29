import { describe, expect, test } from "bun:test";
import { packageName, version } from "./index";

describe("DOL SDK", () => {
  test("should export version", () => {
    expect(version).toBe("0.1.0");
  });

  test("should export package name", () => {
    expect(packageName).toBe("@us-legal-tools/dol-sdk");
  });

  // Additional tests will be added after generating the API client
  test.todo("should export getAgencies function");
  test.todo("should export getDatasets function");
  test.todo("should export getStatistics function");
});
