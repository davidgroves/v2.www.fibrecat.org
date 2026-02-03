/**
 * Build-time script: fetches title, date range, and cover image from each
 * Google Photos album URL and writes albums.json.
 *
 * URL source (first found):
 * - src/data/photo-album-links.txt (one URL per line)
 * - src/data/photo-album-urls.ts (photoAlbumUrls array)
 *
 * Run: npm run fetch-albums (or npm run build, which runs this via prebuild)
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { photoAlbumUrls, type PhotoAlbumUrl } from '../src/data/photo-album-urls';

const OUTPUT_FILE = path.join(process.cwd(), 'src/data/albums.json');
const LINKS_TXT = path.join(process.cwd(), 'src/data/photo-album-links.txt');

interface FetchedAlbum {
  title: string;
  shareUrl: string;
  coverImageUrl: string | null;
  dateRange: string | null;
}

interface AlbumsData {
  lastUpdated: string;
  albums: FetchedAlbum[];
}

function normalizeUrls(): { url: string; titleOverride?: string }[] {
  if (fs.existsSync(LINKS_TXT)) {
    const text = fs.readFileSync(LINKS_TXT, 'utf-8');
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#'))
      .map((url) => ({ url }));
  }
  return photoAlbumUrls.map((entry) =>
    typeof entry === 'string'
      ? { url: entry }
      : { url: entry.url, titleOverride: entry.title }
  );
}

async function fetchAlbumMetadata(
  page: import('playwright').Page,
  url: string,
  titleOverride?: string
): Promise<FetchedAlbum> {
  const result: FetchedAlbum = {
    title: titleOverride ?? 'Untitled Album',
    shareUrl: url,
    coverImageUrl: null,
    dateRange: null,
  };

  try {
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForTimeout(3000);

    const meta = await page.evaluate((override) => {
      const title =
        override ??
        ((document.title || '').replace(/\s*-\s*Google Photos\s*$/i, '').trim() || 'Untitled Album');

      let dateRange: string | null = null;
      const bodyText = document.body?.innerText ?? '';
      const datePatterns = [
        /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s*[–—-]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+)?\d{1,2},?\s*\d{4}\b/g,
        /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s*[–—-]\s*\d{1,2},?\s*\d{4}\b/g,
      ];
      for (const re of datePatterns) {
        const m = bodyText.match(re);
        if (m && m[0]) {
          dateRange = m[0].trim();
          break;
        }
      }

      // Album cover: skip small avatar images (s32/s48/s64); prefer large imgs or background-image
      let coverImageUrl: string | null = null;
      let bestSize = 0;

      const imgs = document.querySelectorAll('img[src*="googleusercontent"], img[src*="ggpht"]');
      for (const img of imgs) {
        const src = (img as HTMLImageElement).src;
        if (!src) continue;
        const sM = src.match(/=s(\d+)/);
        const wM = src.match(/=w(\d+)/);
        const size = sM ? parseInt(sM[1], 10) : wM ? parseInt(wM[1], 10) : 0;
        if (size < 80) continue;
        if (size > bestSize) {
          bestSize = size;
          coverImageUrl = src;
        }
      }

      const withBg = document.querySelectorAll('[style*="background-image"], [style*="background:"]');
      for (const el of withBg) {
        const style = (el as HTMLElement).getAttribute('style') || '';
        const urlM = style.match(/url\(['"]?([^'")]+)['"]?\)/);
        if (!urlM || !urlM[1]) continue;
        const url = urlM[1].trim();
        if (!url.includes('googleusercontent') && !url.includes('ggpht')) continue;
        const sM2 = url.match(/=s(\d+)/);
        const wM2 = url.match(/=w(\d+)/);
        const size = sM2 ? parseInt(sM2[1], 10) : wM2 ? parseInt(wM2[1], 10) : 0;
        if (size < 80) continue;
        if (size > bestSize) {
          bestSize = size;
          coverImageUrl = url;
        }
      }

      return { title, dateRange, coverImageUrl };
    }, titleOverride ?? undefined);

      result.title = meta.title;
    result.dateRange = meta.dateRange;
    result.coverImageUrl = meta.coverImageUrl
      ? meta.coverImageUrl.replace(/=s\d+(-p-no)?/, '=s400$1').replace(/=w\d+-h\d+/, '=w400-h300')
      : null;
  } catch (err) {
    console.warn(`  Failed to fetch ${url}:`, (err as Error).message);
  }

  return result;
}

async function main(): Promise<void> {
  const entries = normalizeUrls();
  if (entries.length === 0) {
    console.log('No album URLs in photo-album-urls.ts. Add URLs and run again.');
    process.exit(0);
  }

  console.log(`Fetching metadata for ${entries.length} album(s)...\n`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  const albums: FetchedAlbum[] = [];

  for (let i = 0; i < entries.length; i++) {
    const { url, titleOverride } = entries[i];
    console.log(`  [${i + 1}/${entries.length}] ${url.slice(0, 60)}...`);
    const album = await fetchAlbumMetadata(page, url, titleOverride);
    albums.push(album);
    console.log(`    → ${album.title}${album.dateRange ? ` (${album.dateRange})` : ''}`);
    await page.waitForTimeout(800);
  }

  await context.close();
  await browser.close();

  const data: AlbumsData = {
    lastUpdated: new Date().toISOString(),
    albums,
  };

  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));

  console.log(`\nWrote ${albums.length} album(s) to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
