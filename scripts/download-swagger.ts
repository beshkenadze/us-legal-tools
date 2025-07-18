#!/usr/bin/env bun

import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const API_URL = 'https://www.ecfr.gov/developers/documentation/api/v1.json';
const OUTPUT_DIR = path.join(process.cwd(), 'docs');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'v1.json');

async function downloadWithBrowser() {
  let browser: any;
  let context: any;
  let page: any;

  try {
    console.log('🌐 Using Playwright browser to download Swagger documentation...');
    console.log('🚀 Launching Chromium browser...');

    // Launch Chromium using Playwright
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    // Create a new browser context with user agent
    context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    page = await context.newPage();

    console.log('📄 Navigating to:', API_URL);

    let swaggerData = null;

    // Set up response handler before navigation
    page.on('response', async (response: any) => {
      if (response.url() === API_URL && response.status() === 200) {
        try {
          const data = await response.json();
          if (data.swagger) {
            swaggerData = data;
            console.log('✅ Captured Swagger data from network response');
          }
        } catch (e) {
          // Not JSON or error parsing
        }
      }
    });

    // Navigate to the URL with longer timeout for slow government sites
    await page.goto(API_URL, {
      waitUntil: 'networkidle',
      timeout: 60000, // 60 seconds
    });

    // If we didn't capture it from network, try to get it from page content
    if (!swaggerData) {
      console.log('⏳ Waiting for dynamic content...');
      await page.waitForTimeout(3000);

      // Try to extract JSON from the page content
      try {
        const content = await page.content();

        // Try multiple ways to extract JSON
        // Method 1: Look for JSON in pre/code tags
        const jsonMatch = content.match(
          /<(pre|code)[^>]*>({[\s\S]*?"swagger"[\s\S]*?})<\/(pre|code)>/,
        );
        if (jsonMatch) {
          swaggerData = JSON.parse(jsonMatch[2]);
          console.log('✅ Extracted Swagger data from HTML element');
        } else {
          // Method 2: Try to get text content and parse it
          const bodyText = await page.evaluate(() => document.body.innerText);
          if (bodyText && bodyText.trim().startsWith('{')) {
            swaggerData = JSON.parse(bodyText.trim());
            console.log('✅ Extracted Swagger data from body text');
          }
        }
      } catch (e) {
        console.log('⚠️  Could not parse JSON from page content');
      }
    }

    if (swaggerData && swaggerData.swagger) {
      await fs.mkdir(OUTPUT_DIR, { recursive: true });
      await fs.writeFile(OUTPUT_FILE, JSON.stringify(swaggerData, null, 2));
      console.log('\n✅ Swagger documentation downloaded successfully!');
      console.log(`📁 Saved to: ${OUTPUT_FILE}`);
      console.log(`📖 API Version: ${swaggerData.info?.version || 'Unknown'}`);
      console.log(`📄 Title: ${swaggerData.info?.title || 'Unknown'}`);
      return true;
    } else {
      throw new Error('No valid Swagger data found on the page');
    }
  } catch (error) {
    console.error(
      '\n❌ Browser download failed:',
      error instanceof Error ? error.message : String(error),
    );
    return false;
  } finally {
    // Clean up resources
    if (page) {
      try {
        await page.close();
      } catch (e) {
        // Ignore close errors
      }
    }
    if (context) {
      try {
        await context.close();
      } catch (e) {
        // Ignore close errors
      }
    }
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        // Ignore close errors
      }
    }
  }
}

async function main() {
  // Use Playwright to download the Swagger documentation
  const success = await downloadWithBrowser();

  if (!success) {
    console.error('\n📝 To download manually:');
    console.error('1. Visit: https://www.ecfr.gov/developers/documentation/api/v1.json');
    console.error('2. Save the JSON content to: docs/v1.json');
    process.exit(1);
  }
}

main().catch(console.error);
