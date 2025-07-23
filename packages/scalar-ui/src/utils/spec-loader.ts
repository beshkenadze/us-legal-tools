import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadLocalSpec(specPath: string): Promise<string | null> {
  try {
    // Resolve path relative to the scalar-ui package directory
    const fullPath = join(__dirname, "../..", specPath);
    const file = Bun.file(fullPath);

    if (await file.exists()) {
      return await file.text();
    }

    console.error(`Spec file not found: ${fullPath}`);
    return null;
  } catch (error) {
    console.error(`Error loading spec file: ${specPath}`, error);
    return null;
  }
}

export function getContentType(filePath: string): string {
  if (filePath.endsWith(".yaml") || filePath.endsWith(".yml")) {
    return "application/x-yaml";
  }
  return "application/json";
}

export async function validateSpec(
  content: string,
  contentType: string
): Promise<boolean> {
  try {
    if (contentType === "application/json") {
      JSON.parse(content);
    }
    // For YAML, we rely on Scalar to handle parsing
    return true;
  } catch (error) {
    console.error("Invalid specification format:", error);
    return false;
  }
}
