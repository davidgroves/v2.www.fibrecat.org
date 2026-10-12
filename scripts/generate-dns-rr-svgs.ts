/**
 * Generate http.cat-style SVG placeholders for DNS RR types that lack photos.
 * Usage: bun scripts/generate-dns-rr-svgs.ts
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PHOTO_SLUGS = new Set(['a', 'mx', 'https', 'soa']);

// Minimal list of slug + label for SVG generation; kept in sync with dns-rrs.ts
// by reading type names from argv or regenerating from a hardcoded IANA set.
const TYPES: { slug: string; label: string; code: number }[] = [
  { slug: 'a', label: 'A', code: 1 },
  { slug: 'ns', label: 'NS', code: 2 },
  { slug: 'md', label: 'MD', code: 3 },
  { slug: 'mf', label: 'MF', code: 4 },
  { slug: 'cname', label: 'CNAME', code: 5 },
  { slug: 'soa', label: 'SOA', code: 6 },
  { slug: 'mb', label: 'MB', code: 7 },
  { slug: 'mg', label: 'MG', code: 8 },
  { slug: 'mr', label: 'MR', code: 9 },
  { slug: 'null', label: 'NULL', code: 10 },
  { slug: 'wks', label: 'WKS', code: 11 },
  { slug: 'ptr', label: 'PTR', code: 12 },
  { slug: 'hinfo', label: 'HINFO', code: 13 },
  { slug: 'minfo', label: 'MINFO', code: 14 },
  { slug: 'mx', label: 'MX', code: 15 },
  { slug: 'txt', label: 'TXT', code: 16 },
  { slug: 'rp', label: 'RP', code: 17 },
  { slug: 'afsdb', label: 'AFSDB', code: 18 },
  { slug: 'x25', label: 'X25', code: 19 },
  { slug: 'isdn', label: 'ISDN', code: 20 },
  { slug: 'rt', label: 'RT', code: 21 },
  { slug: 'nsap', label: 'NSAP', code: 22 },
  { slug: 'nsap-ptr', label: 'NSAP-PTR', code: 23 },
  { slug: 'sig', label: 'SIG', code: 24 },
  { slug: 'key', label: 'KEY', code: 25 },
  { slug: 'px', label: 'PX', code: 26 },
  { slug: 'gpos', label: 'GPOS', code: 27 },
  { slug: 'aaaa', label: 'AAAA', code: 28 },
  { slug: 'loc', label: 'LOC', code: 29 },
  { slug: 'nxt', label: 'NXT', code: 30 },
  { slug: 'eid', label: 'EID', code: 31 },
  { slug: 'nimloc', label: 'NIMLOC', code: 32 },
  { slug: 'srv', label: 'SRV', code: 33 },
  { slug: 'atma', label: 'ATMA', code: 34 },
  { slug: 'naptr', label: 'NAPTR', code: 35 },
  { slug: 'kx', label: 'KX', code: 36 },
  { slug: 'cert', label: 'CERT', code: 37 },
  { slug: 'a6', label: 'A6', code: 38 },
  { slug: 'dname', label: 'DNAME', code: 39 },
  { slug: 'sink', label: 'SINK', code: 40 },
  { slug: 'opt', label: 'OPT', code: 41 },
  { slug: 'apl', label: 'APL', code: 42 },
  { slug: 'ds', label: 'DS', code: 43 },
  { slug: 'sshfp', label: 'SSHFP', code: 44 },
  { slug: 'ipseckey', label: 'IPSECKEY', code: 45 },
  { slug: 'rrsig', label: 'RRSIG', code: 46 },
  { slug: 'nsec', label: 'NSEC', code: 47 },
  { slug: 'dnskey', label: 'DNSKEY', code: 48 },
  { slug: 'dhcid', label: 'DHCID', code: 49 },
  { slug: 'nsec3', label: 'NSEC3', code: 50 },
  { slug: 'nsec3param', label: 'NSEC3PARAM', code: 51 },
  { slug: 'tlsa', label: 'TLSA', code: 52 },
  { slug: 'smimea', label: 'SMIMEA', code: 53 },
  { slug: 'hip', label: 'HIP', code: 55 },
  { slug: 'ninfo', label: 'NINFO', code: 56 },
  { slug: 'rkey', label: 'RKEY', code: 57 },
  { slug: 'talink', label: 'TALINK', code: 58 },
  { slug: 'cds', label: 'CDS', code: 59 },
  { slug: 'cdnskey', label: 'CDNSKEY', code: 60 },
  { slug: 'openpgpkey', label: 'OPENPGPKEY', code: 61 },
  { slug: 'csync', label: 'CSYNC', code: 62 },
  { slug: 'zonemd', label: 'ZONEMD', code: 63 },
  { slug: 'svcb', label: 'SVCB', code: 64 },
  { slug: 'https', label: 'HTTPS', code: 65 },
  { slug: 'dsync', label: 'DSYNC', code: 66 },
  { slug: 'hhit', label: 'HHIT', code: 67 },
  { slug: 'brid', label: 'BRID', code: 68 },
  { slug: 'unece', label: 'UNECE', code: 69 },
  { slug: 'iso', label: 'ISO', code: 70 },
  { slug: 'spf', label: 'SPF', code: 99 },
  { slug: 'uinfo', label: 'UINFO', code: 100 },
  { slug: 'uid', label: 'UID', code: 101 },
  { slug: 'gid', label: 'GID', code: 102 },
  { slug: 'unspec', label: 'UNSPEC', code: 103 },
  { slug: 'nid', label: 'NID', code: 104 },
  { slug: 'l32', label: 'L32', code: 105 },
  { slug: 'l64', label: 'L64', code: 106 },
  { slug: 'lp', label: 'LP', code: 107 },
  { slug: 'eui48', label: 'EUI48', code: 108 },
  { slug: 'eui64', label: 'EUI64', code: 109 },
  { slug: 'nxname', label: 'NXNAME', code: 128 },
  { slug: 'tkey', label: 'TKEY', code: 249 },
  { slug: 'tsig', label: 'TSIG', code: 250 },
  { slug: 'ixfr', label: 'IXFR', code: 251 },
  { slug: 'axfr', label: 'AXFR', code: 252 },
  { slug: 'mailb', label: 'MAILB', code: 253 },
  { slug: 'maila', label: 'MAILA', code: 254 },
  { slug: 'any', label: '*', code: 255 },
  { slug: 'uri', label: 'URI', code: 256 },
  { slug: 'caa', label: 'CAA', code: 257 },
  { slug: 'avc', label: 'AVC', code: 258 },
  { slug: 'doa', label: 'DOA', code: 259 },
  { slug: 'amtrelay', label: 'AMTRELAY', code: 260 },
  { slug: 'resinfo', label: 'RESINFO', code: 261 },
  { slug: 'wallet', label: 'WALLET', code: 262 },
  { slug: 'cla', label: 'CLA', code: 263 },
  { slug: 'ipn', label: 'IPN', code: 264 },
  { slug: 'ta', label: 'TA', code: 32768 },
  { slug: 'dlv', label: 'DLV', code: 32769 },
];

function hueFor(code: number): number {
  return (code * 47) % 360;
}

function svgFor(label: string, code: number): string {
  const hue = hueFor(code);
  const bg = `hsl(${hue} 28% 14%)`;
  const accent = `hsl(${hue} 55% 55%)`;
  const fontSize = label.length > 6 ? 72 : label.length > 4 ? 96 : 128;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="${bg}"/>
  <text x="64" y="160" fill="#fff" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="${fontSize}" font-weight="700">${escapeXml(label)}</text>
  <text x="64" y="220" fill="${accent}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="28">TYPE ${code}</text>
  <!-- simple cat silhouette -->
  <g transform="translate(280 320)" fill="#f5f0e8" opacity="0.92">
    <ellipse cx="232" cy="280" rx="180" ry="140"/>
    <circle cx="232" cy="140" r="110"/>
    <polygon points="140,80 120,10 190,70"/>
    <polygon points="324,80 344,10 274,70"/>
    <ellipse cx="190" cy="130" rx="14" ry="20" fill="${bg}"/>
    <ellipse cx="274" cy="130" rx="14" ry="20" fill="${bg}"/>
    <ellipse cx="232" cy="165" rx="10" ry="7" fill="${accent}"/>
    <path d="M200 190 Q232 210 264 190" fill="none" stroke="${bg}" stroke-width="6" stroke-linecap="round"/>
  </g>
  <text x="64" y="960" fill="#ffffff88" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="24">fibrecat.org/dns/rr</text>
</svg>
`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const outDir = join(import.meta.dir, '..', 'public', 'dns', 'rr');
mkdirSync(outDir, { recursive: true });

let written = 0;
for (const t of TYPES) {
  if (PHOTO_SLUGS.has(t.slug)) continue;
  const path = join(outDir, `${t.slug}.svg`);
  writeFileSync(path, svgFor(t.label, t.code));
  written++;
}

console.log(`Wrote ${written} SVGs to ${outDir} (skipped ${PHOTO_SLUGS.size} photo slugs)`);
if (!existsSync(join(outDir, 'a.jpg'))) {
  console.warn('Warning: a.jpg missing — photos may not be present');
}
