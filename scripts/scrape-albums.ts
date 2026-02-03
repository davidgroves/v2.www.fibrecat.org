import { chromium, type BrowserContext, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const USER_DATA_DIR = path.join(process.cwd(), '.playwright-session');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/albums.json');

interface Album {
  title: string;
  shareUrl: string;
  coverImageUrl: string | null;
  photoCount: number | null;
}

interface ScrapedData {
  lastUpdated: string;
  albums: Album[];
}

async function waitForUserLogin(page: Page): Promise<void> {
  console.log('\n========================================');
  console.log('Please log in to your Google account.');
  console.log('The script will continue once you reach the Google Photos sharing page.');
  console.log('========================================\n');
  
  // Wait for the user to complete login and reach the sharing page
  await page.waitForURL('**/photos.google.com/sharing**', { timeout: 300000 }); // 5 minute timeout
  console.log('Login detected! Continuing with scraping...\n');
}

async function scrollToLoadAllAlbums(page: Page): Promise<void> {
  console.log('Scrolling to load all albums...');
  
  let previousHeight = 0;
  let currentHeight = await page.evaluate(() => document.body.scrollHeight);
  let scrollAttempts = 0;
  const maxScrollAttempts = 50; // Prevent infinite scrolling
  
  while (previousHeight !== currentHeight && scrollAttempts < maxScrollAttempts) {
    previousHeight = currentHeight;
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Wait for content to load
    await page.waitForTimeout(1500);
    
    currentHeight = await page.evaluate(() => document.body.scrollHeight);
    scrollAttempts++;
    
    if (scrollAttempts % 5 === 0) {
      console.log(`  Scroll attempt ${scrollAttempts}, page height: ${currentHeight}px`);
    }
  }
  
  console.log(`Finished scrolling after ${scrollAttempts} attempts.\n`);
}

async function extractAlbums(page: Page): Promise<Album[]> {
  console.log('Extracting album data...');
  
  // Wait for album elements to be present
  await page.waitForSelector('a[href*="/share/"]', { timeout: 30000 }).catch(() => {
    console.log('No shared albums found with standard selector, trying alternative...');
  });
  
  const albums = await page.evaluate(() => {
    const albumElements: Album[] = [];
    
    // Google Photos shared albums are typically in anchor tags with /share/ in the href
    // The structure can vary, so we try multiple selectors
    const links = document.querySelectorAll('a[href*="/share/"]');
    
    links.forEach((link) => {
      const anchor = link as HTMLAnchorElement;
      const href = anchor.href;
      
      // Skip if not a valid album link
      if (!href.includes('/share/')) return;
      
      // Try to find the album title
      // Usually in a nearby text element or aria-label
      let title = anchor.getAttribute('aria-label') || '';
      
      // If no aria-label, try to find text content
      if (!title) {
        const textElement = anchor.querySelector('[data-tooltip]') || 
                           anchor.querySelector('div[style*="font"]') ||
                           anchor;
        title = textElement?.textContent?.trim() || 'Untitled Album';
      }
      
      // Try to find cover image
      let coverImageUrl: string | null = null;
      const img = anchor.querySelector('img');
      if (img) {
        coverImageUrl = img.src || img.getAttribute('data-src') || null;
      }
      
      // Try to extract photo count if visible
      let photoCount: number | null = null;
      const countMatch = anchor.textContent?.match(/(\d+)\s*(photos?|items?)/i);
      if (countMatch) {
        photoCount = parseInt(countMatch[1], 10);
      }
      
      albumElements.push({
        title: title.replace(/\s+/g, ' ').trim(),
        shareUrl: href,
        coverImageUrl,
        photoCount,
      });
    });
    
    return albumElements;
  });
  
  // Deduplicate by shareUrl
  const uniqueAlbums = albums.filter((album, index, self) =>
    index === self.findIndex((a) => a.shareUrl === album.shareUrl)
  );
  
  console.log(`Found ${uniqueAlbums.length} unique albums.\n`);
  return uniqueAlbums;
}

async function getShareLinks(page: Page, albums: Album[]): Promise<Album[]> {
  console.log('Extracting shareable links for each album...');
  
  const albumsWithShareLinks: Album[] = [];
  
  for (let i = 0; i < albums.length; i++) {
    const album = albums[i];
    console.log(`  Processing ${i + 1}/${albums.length}: ${album.title}`);
    
    try {
      // Navigate to the album
      await page.goto(album.shareUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      
      // Try to get the short share URL from the page
      // This is usually available in the browser URL after redirect or via share button
      const currentUrl = page.url();
      
      // Check if we got redirected to a photos.app.goo.gl URL or similar
      let shareUrl = album.shareUrl;
      if (currentUrl.includes('photos.google.com')) {
        // The album URL is the current URL - we can try to get the share link
        shareUrl = currentUrl;
      }
      
      // Try to get the album title from the page if we don't have it
      let title = album.title;
      if (title === 'Untitled Album' || !title) {
        const pageTitle = await page.title();
        if (pageTitle && !pageTitle.includes('Google Photos')) {
          title = pageTitle.replace(' - Google Photos', '').trim();
        }
      }
      
      // Get cover image from the album page
      let coverImageUrl = album.coverImageUrl;
      if (!coverImageUrl) {
        coverImageUrl = await page.evaluate(() => {
          const img = document.querySelector('img[src*="googleusercontent"]');
          return img ? (img as HTMLImageElement).src : null;
        });
      }
      
      albumsWithShareLinks.push({
        title,
        shareUrl,
        coverImageUrl,
        photoCount: album.photoCount,
      });
      
    } catch (error) {
      console.log(`    Error processing album: ${error}`);
      albumsWithShareLinks.push(album);
    }
    
    // Add a small delay to avoid rate limiting
    await page.waitForTimeout(500);
  }
  
  return albumsWithShareLinks;
}

async function saveAlbums(albums: Album[]): Promise<void> {
  const data: ScrapedData = {
    lastUpdated: new Date().toISOString(),
    albums,
  };
  
  // Ensure the output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`Saved ${albums.length} albums to ${OUTPUT_FILE}`);
}

async function main(): Promise<void> {
  const isLoginMode = process.argv.includes('--login');
  const forceHeadless = process.argv.includes('--headless');
  const forceHeaded = process.argv.includes('--headed');
  // Default: headless unless login mode (which needs interaction) or --headed flag
  const isHeadless = forceHeadless || (!isLoginMode && !forceHeaded);
  
  console.log(`Starting Google Photos Album Scraper`);
  console.log(`Mode: ${isLoginMode ? 'Login' : 'Scrape'}`);
  console.log(`Headless: ${isHeadless}`);
  console.log(`Session directory: ${USER_DATA_DIR}`);
  console.log('');
  
  // Check if remote debugging is requested
  const remoteDebugging = process.argv.includes('--remote-debug');
  const debugPort = 9222;
  
  const launchArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
  ];
  
  if (remoteDebugging) {
    launchArgs.push(`--remote-debugging-port=${debugPort}`);
    console.log(`\n========================================`);
    console.log(`Remote debugging enabled on port ${debugPort}`);
    console.log(`Open in your browser: chrome://inspect`);
    console.log(`Or visit: http://localhost:${debugPort}`);
    console.log(`========================================\n`);
  }
  
  // Launch browser with persistent context
  const context: BrowserContext = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: isHeadless,
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    args: launchArgs,
  });
  
  try {
    const page = await context.newPage();
    
    // Navigate to Google Photos sharing page
    await page.goto('https://photos.google.com/sharing', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    
    // Wait a bit for any redirects
    await page.waitForTimeout(3000);
    
    // Check if we need to log in
    const currentUrl = page.url();
    if (currentUrl.includes('accounts.google.com') || !currentUrl.includes('photos.google.com')) {
      if (isLoginMode) {
        await waitForUserLogin(page);
      } else {
        console.error('\n========================================');
        console.error('ERROR: Not logged in to Google Photos');
        console.error('========================================\n');
        console.error('Options to authenticate:\n');
        console.error('1. Run locally (recommended):');
        console.error('   - Clone this repo on your local machine');
        console.error('   - Run: npm run scrape:login');
        console.error('   - Log in when the browser opens');
        console.error('   - Copy .playwright-session/ folder to the devcontainer\n');
        console.error('2. Run in devcontainer with VNC (if available):');
        console.error('   - npm run scrape:login');
        console.error('   - Connect via VNC to see the browser\n');
        console.error('3. Use xvfb-run for virtual display:');
        console.error('   - xvfb-run npm run scrape:login');
        console.error('   - Note: You cannot interact with the login page this way\n');
        process.exit(1);
      }
    }
    
    if (isLoginMode) {
      console.log('\nLogin successful! Session saved.');
      console.log('You can now run the scraper without --login flag.\n');
      
      // Still do a quick scrape to verify everything works
      console.log('Performing a test scrape...\n');
    }
    
    // Make sure we're on the sharing page
    if (!page.url().includes('/sharing')) {
      await page.goto('https://photos.google.com/sharing', { 
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
      await page.waitForTimeout(2000);
    }
    
    // Scroll to load all albums
    await scrollToLoadAllAlbums(page);
    
    // Extract album data
    const albums = await extractAlbums(page);
    
    if (albums.length === 0) {
      console.log('No albums found. The page structure may have changed.');
      console.log('Current URL:', page.url());
      
      // Take a screenshot for debugging
      const screenshotPath = path.join(process.cwd(), 'debug-screenshot.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Debug screenshot saved to: ${screenshotPath}`);
    } else {
      // Save the albums
      await saveAlbums(albums);
    }
    
  } catch (error) {
    console.error('Error during scraping:', error);
    process.exit(1);
  } finally {
    await context.close();
  }
}

main();
