/**
 * Manual list of Google Photos album share URLs (photos.google.com/share/...).
 *
 * Workflow:
 * 1. Add or edit URLs in photoAlbumUrls below.
 * 2. Run: npm run fetch-albums
 * 3. Build/deploy: npm run build
 *
 * The fetch script writes title, date range, and cover image for each URL
 * into src/data/albums.json; the Photos page uses that for the gallery.
 *
 * Entries can be a plain URL string or { url, title? } to override the fetched title.
 */
export type PhotoAlbumUrl =
  | string
  | { url: string; title?: string };

export const photoAlbumUrls: PhotoAlbumUrl[] = [
  'https://photos.google.com/share/AF1QipOYvfVG1tsg_ISVJMdXpMpXDMpQrf6X66P4sEl4NK1K-fxGXb9geK6cchvgZgpY0w?key=MG16ZlBqMkRCRUc0RFJORzdqVWNfbkV5NHRPRXpn',
  'https://photos.google.com/share/AF1QipP5KfdScpR7qUKwxheg3e3LH4C7kLpjvYUygcCY3I-nuLttXXZp-d2EUae8sSyBGQ?key=LWlHeERyZjNIYnJiN191M0s0RGgySTBycVVHQjV3',
  // Add more Google Photos share URLs here.
];
