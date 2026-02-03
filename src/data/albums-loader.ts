import * as fs from "fs";
import * as path from "path";
import { photoAlbums as fallbackAlbums, type PhotoAlbum } from "./photos";

// Album structure from fetched/scraped JSON (from fetch-album-metadata or scrape-albums)
interface StoredAlbum {
  title: string;
  shareUrl: string;
  coverImageUrl: string | null;
  photoCount?: number | null;
  dateRange?: string | null;
}

interface StoredData {
  lastUpdated: string;
  albums: StoredAlbum[];
}

// Unified album structure for the photos page
export interface Album {
  title: string;
  link: string;
  coverImageUrl: string | null;
  photoCount: number | null;
  dateRange: string | null;
  // Legacy fields from manual data (optional)
  year?: string;
  country?: string;
  location?: string;
}

// Try to load scraped albums, fall back to manual list
export function loadAlbums(): {
  albums: Album[];
  lastUpdated: string | null;
  source: "scraped" | "fallback";
} {
  const jsonPath = path.join(process.cwd(), "src/data/albums.json");

  // Try to load fetched/scraped data (from fetch-albums or scrape-albums)
  if (fs.existsSync(jsonPath)) {
    try {
      const rawData = fs.readFileSync(jsonPath, "utf-8");
      const storedData: StoredData = JSON.parse(rawData);

      if (storedData.albums && storedData.albums.length > 0) {
        const albums: Album[] = storedData.albums.map((album) => ({
          title: album.title,
          link: album.shareUrl,
          coverImageUrl: album.coverImageUrl,
          photoCount: album.photoCount ?? null,
          dateRange: album.dateRange ?? null,
        }));

        return {
          albums,
          lastUpdated: storedData.lastUpdated,
          source: "scraped",
        };
      }
    } catch (error) {
      console.warn(
        "Failed to load albums.json, falling back to manual list:",
        error
      );
    }
  }

  // Fall back to manual list (legacy photos.ts)
  const albums: Album[] = fallbackAlbums.map((album) => ({
    title: album.location,
    link: album.link,
    coverImageUrl: null,
    photoCount: null,
    dateRange: null,
    year: album.year,
    country: album.country,
    location: album.location,
  }));

  return {
    albums,
    lastUpdated: null,
    source: "fallback",
  };
}

// For static imports in Astro (since fs doesn't work at runtime in SSR)
// This function is called at build time
export function getAlbumsSync(): {
  albums: Album[];
  lastUpdated: string | null;
  source: "scraped" | "fallback";
} {
  return loadAlbums();
}
