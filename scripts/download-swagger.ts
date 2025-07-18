#!/usr/bin/env bun

import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const API_URL = 'https://www.ecfr.gov/developers/documentation/api/v1.json';
const OUTPUT_DIR = path.join(process.cwd(), 'docs');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'v1.json');

// Default to GitHub Actions service container, fallback to local
const CDP_URL = process.env.CDP_URL || 'http://chrome:9222';
const FALLBACK_CDP_URL = 'http://localhost:9222';

async function downloadWithBrowser(cdpUrl?: string) {
  let browser: any;
  let context: any;
  let page: any;

  try {
    console.log('🌐 Using headless browser to download Swagger documentation...');
    
    if (cdpUrl) {
      console.log('🔗 Connecting to:', cdpUrl);
      // Construct WebSocket endpoint from CDP URL
      const host = cdpUrl.replace('http://', '').replace('https://', '');
      const wsEndpoint = `ws://${host}`;
      console.log('🔗 WebSocket endpoint:', wsEndpoint);

      // Connect to browser instance using WebSocket
      browser = await puppeteer.connect({
        browserWSEndpoint: wsEndpoint,
      });
    } else {
      console.log('🚀 Launching Chrome browser...');
      // Launch Chrome directly (for GitHub Actions)
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
        ],
      });
    }

    // Create a new page
    if (cdpUrl) {
      // Create a new browser context (for remote browser)
      context = await browser.createBrowserContext();
      page = await context.newPage();
    } else {
      // Create page directly (for launched browser)
      page = await browser.newPage();
    }

    // Set user agent to mimic a real browser
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );

    // Set additional headers to appear more like a regular browser
    await page.setExtraHTTPHeaders({
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    });

    console.log('📄 Navigating to:', API_URL);

    let swaggerData = null;

    // Set up response handler before navigation
    page.on('response', async (response) => {
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
      waitUntil: 'networkidle2',
      timeout: 60000, // 60 seconds
    });

    // If we didn't capture it from network, try to get it from page content
    if (!swaggerData) {
      console.log('⏳ Waiting for dynamic content...');
      await new Promise((resolve) => setTimeout(resolve, 3000));

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
        if (cdpUrl) {
          await browser.disconnect();
        } else {
          await browser.close();
        }
      } catch (e) {
        // Ignore disconnect/close errors
      }
    }
  }
}

async function main() {
  let success = false;

  // If CDP_URL is set, try to connect to remote browser
  if (process.env.CDP_URL) {
    console.log('🔗 Connecting to remote browser...');
    success = await downloadWithBrowser(process.env.CDP_URL);
    
    // If failed and not already using localhost, try fallback
    if (!success && !process.env.CDP_URL.includes('localhost')) {
      console.log('\n🔄 Trying fallback CDP URL...');
      success = await downloadWithBrowser(FALLBACK_CDP_URL);
    }
  }

  // If no CDP_URL or remote connection failed, launch Chrome directly
  if (!success) {
    console.log('\n🚀 Launching Chrome directly...');
    success = await downloadWithBrowser();
  }

  if (!success) {
    console.error('\n📝 To download manually:');
    console.error('1. Run a headless Chrome browser:');
    console.error(
      '   docker run -d --name chrome -p 9222:9222 --shm-size="2g" browserless/chrome:latest',
    );
    console.error('2. Visit: https://www.ecfr.gov/developers/documentation/api/v1.json');
    console.error('3. Save the JSON content to: docs/v1.json');
    process.exit(1);
  }
}

main().catch(console.error);
