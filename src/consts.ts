// Site-wide constants
export const SITE_TITLE = 'Fibrecat.org';
export const SITE_DESCRIPTION = 'Personal website of David Groves - Network Architect, Software Engineer, Platform Engineer, Traveler, and Greyhound Lover';
export const SITE_URL = 'https://www.fibrecat.org';

// Social links
export const SOCIAL_LINKS = {
  bluesky: 'https://bsky.app/profile/fibrecat.org',
  twitter: 'https://twitter.com/pumplekin',
  github: 'https://github.com/davidgroves',
  linkedin: 'https://www.linkedin.com/in/david-groves-09827536/',
} as const;

// Navigation items
export const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/blog', label: 'Blog', icon: 'blog' },
  { href: '/photos', label: 'Photos', icon: 'photos' },
  { href: '/dogs', label: 'Dogs', icon: 'dogs' },
  { href: '/presentations', label: 'Presentations', icon: 'presentations' },
] as const;
