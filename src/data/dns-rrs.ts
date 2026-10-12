export interface DnsRrField {
  name: string;
  type: string;
  description: string;
  example?: string;
  children?: DnsRrField[];
}

export type DnsRrWarningLevel = 'deprecated' | 'obsolete' | 'experimental' | 'meta';

export interface DnsRr {
  slug: string;
  type: string;
  typeCode: number;
  title: string;
  tagline: string;
  synopsis: string;
  image: string;
  imageAlt: string;
  rfcs: { id: string; url: string }[];
  fields: DnsRrField[];
  /** Presentation-form examples; at least three per RR. */
  examples: [string, string, string, ...string[]];
  warning?: { level: DnsRrWarningLevel; message: string };
}

export const dnsRrs: DnsRr[] = [
  {
    slug: "a",
    type: "A",
    typeCode: 1,
    title: "A — Address",
    tagline: "Maps a name to an IPv4 address.",
    synopsis: "One 32-bit unsigned integer. Presented as dotted decimal (x.x.x.x).",
    image: "/dns/rr/a.jpg",
    imageAlt: "Cat studying an IPv4 address on a chalkboard, labelled A",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "ADDRESS",
        type: "32-bit unsigned integer",
        description: "IPv4 address. Four octets, dotted decimal in presentation form.",
        example: "192.0.2.1",
      }
    ],
    examples: [
      "example.com.          300  IN  A  192.0.2.1",
      "www.example.com.      300  IN  A  198.51.100.10",
      "origin.cdn.example.   60   IN  A  203.0.113.50"
    ],
  },
  {
    slug: "ns",
    type: "NS",
    typeCode: 2,
    title: "NS — Name Server",
    tagline: "Authoritative name server for a zone.",
    synopsis: "One domain name: the host name of an authoritative name server.",
    image: "/dns/rr/ns.jpg",
    imageAlt: "Cat meme labelled NS",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "NSDNAME",
        type: "domain-name",
        description: "Host name of a name server for the zone.",
        example: "ns1.example.com.",
      }
    ],
    examples: [
      "example.com.  86400  IN  NS  ns1.example.com.",
      "example.com.  86400  IN  NS  ns2.example.com.",
      "example.org.  3600   IN  NS  a.iana-servers.net."
    ],
  },
  {
    slug: "md",
    type: "MD",
    typeCode: 3,
    title: "MD — Mail Destination",
    tagline: "Obsolete mail destination.",
    synopsis: "One domain name. Obsolete; use MX.",
    image: "/dns/rr/md.jpg",
    imageAlt: "Cat meme labelled MD",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "MADNAME",
        type: "domain-name",
        description: "Mail agent domain name.",
        example: "mail.example.com.",
      }
    ],
    examples: [
      "example.com.  300  IN  MD  mail.example.com.",
      "legacy.example.  300  IN  MD  mx.legacy.example.",
      "old.example.net.  300  IN  MD  smtp.old.example.net."
    ],
    warning: { level: "obsolete", message: "Obsolete. Use MX." },
  },
  {
    slug: "mf",
    type: "MF",
    typeCode: 4,
    title: "MF — Mail Forwarder",
    tagline: "Obsolete mail forwarder.",
    synopsis: "One domain name. Obsolete; use MX.",
    image: "/dns/rr/mf.jpg",
    imageAlt: "Cat meme labelled MF",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "MADNAME",
        type: "domain-name",
        description: "Mail forwarder host name.",
        example: "fwd.example.com.",
      }
    ],
    examples: [
      "example.com.  300  IN  MF  fwd.example.com.",
      "legacy.example.  300  IN  MF  relay.legacy.example.",
      "old.example.net.  300  IN  MF  smtp.old.example.net."
    ],
    warning: { level: "obsolete", message: "Obsolete. Use MX." },
  },
  {
    slug: "cname",
    type: "CNAME",
    typeCode: 5,
    title: "CNAME — Canonical Name",
    tagline: "Alias of one name to another.",
    synopsis: "One domain name: the canonical (target) name.",
    image: "/dns/rr/cname.jpg",
    imageAlt: "Cat meme labelled CNAME",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "CNAME",
        type: "domain-name",
        description: "Canonical name this owner is an alias of.",
        example: "target.example.com.",
      }
    ],
    examples: [
      "www.example.com.  300  IN  CNAME  example.com.",
      "ftp.example.com.  300  IN  CNAME  files.example.net.",
      "cdn.example.com.  60   IN  CNAME  edge.cdn.example."
    ],
  },
  {
    slug: "soa",
    type: "SOA",
    typeCode: 6,
    title: "SOA — Start of Authority",
    tagline: "Zone authority and timers.",
    synopsis: "Primary name server, admin mailbox, serial, and four timers: refresh, retry, expire, minimum.",
    image: "/dns/rr/soa.jpg",
    imageAlt: "Authoritative cat on a throne with a crown, labelled SOA",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "MNAME",
        type: "domain-name",
        description: "Primary master name server.",
        example: "ns1.example.com.",
      },
      {
        name: "RNAME",
        type: "domain-name",
        description: "Admin mailbox as a domain name. First label is the local-part; hostmaster.example.com. means hostmaster@example.com.",
        example: "hostmaster.example.com.",
      },
      {
        name: "SERIAL",
        type: "32-bit unsigned integer",
        description: "Zone version. Secondaries refresh when this increases.",
        example: "2026101201",
      },
      {
        name: "REFRESH",
        type: "32-bit signed integer (seconds)",
        description: "Interval before a secondary checks for a zone update.",
        example: "7200",
      },
      {
        name: "RETRY",
        type: "32-bit signed integer (seconds)",
        description: "Wait after a failed refresh before retrying.",
        example: "3600",
      },
      {
        name: "EXPIRE",
        type: "32-bit signed integer (seconds)",
        description: "Time after which a secondary stops serving the zone if it cannot reach the primary.",
        example: "1209600",
      },
      {
        name: "MINIMUM",
        type: "32-bit unsigned integer (seconds)",
        description: "Negative-caching TTL.",
        example: "300",
      }
    ],
    examples: [
      "example.com.  3600  IN  SOA  ns1.example.com. hostmaster.example.com. 2026101201 7200 3600 1209600 300",
      "example.com.  3600  IN  SOA  ns1.example.com. hostmaster.example.com. ( 2026101201 7200 3600 1209600 300 )",
      "example.net.  86400 IN  SOA  a.gtld-servers.net. nstld.verisign-grs.com. 1735689600 1800 900 604800 86400"
    ],
  },
  {
    slug: "mb",
    type: "MB",
    typeCode: 7,
    title: "MB — Mailbox",
    tagline: "Experimental mailbox host.",
    synopsis: "One domain name: host with the mailbox.",
    image: "/dns/rr/mb.jpg",
    imageAlt: "Cat meme labelled MB",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "MADNAME",
        type: "domain-name",
        description: "Host with the specified mailbox.",
        example: "mail.example.com.",
      }
    ],
    examples: [
      "joe.example.com.  300  IN  MB  mail.example.com.",
      "list.example.com.  300  IN  MB  mx.example.com.",
      "admin.example.net.  300  IN  MB  smtp.example.net."
    ],
    warning: { level: "experimental", message: "Experimental mailbox RR. Not used in modern mail." },
  },
  {
    slug: "mg",
    type: "MG",
    typeCode: 8,
    title: "MG — Mail Group",
    tagline: "Experimental mail group member.",
    synopsis: "One domain name: a mailbox that is a member of the mail group.",
    image: "/dns/rr/mg.jpg",
    imageAlt: "Cat meme labelled MG",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "MGMNAME",
        type: "domain-name",
        description: "Member mailbox name.",
        example: "user.example.com.",
      }
    ],
    examples: [
      "group.example.com.  300  IN  MG  alice.example.com.",
      "group.example.com.  300  IN  MG  bob.example.com.",
      "staff.example.net.  300  IN  MG  carol.example.net."
    ],
    warning: { level: "experimental", message: "Experimental mail group member. Not used in modern mail." },
  },
  {
    slug: "mr",
    type: "MR",
    typeCode: 9,
    title: "MR — Mail Rename",
    tagline: "Experimental mailbox rename.",
    synopsis: "One domain name: the renamed mailbox.",
    image: "/dns/rr/mr.jpg",
    imageAlt: "Cat meme labelled MR",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "NEWNAME",
        type: "domain-name",
        description: "Proper rename of the mailbox.",
        example: "new.example.com.",
      }
    ],
    examples: [
      "old.example.com.  300  IN  MR  new.example.com.",
      "joe.example.com.  300  IN  MR  joseph.example.com.",
      "alias.example.net.  300  IN  MR  real.example.net."
    ],
    warning: { level: "experimental", message: "Experimental mail rename. Not used in modern mail." },
  },
  {
    slug: "null",
    type: "NULL",
    typeCode: 10,
    title: "NULL — Null",
    tagline: "Experimental opaque RDATA.",
    synopsis: "Anything up to 65535 octets. Not for general use.",
    image: "/dns/rr/null.jpg",
    imageAlt: "Cat meme labelled NULL",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "DATA",
        type: "octet stream",
        description: "Opaque data. Presentation form is not standardized for general zones.",
        example: "\\# 0",
      }
    ],
    examples: [
      "example.com.  300  IN  NULL  \\# 0",
      "example.com.  300  IN  TYPE10  \\# 4 AABBCCDD",
      "test.example.  300  IN  NULL  \\# 8 0123456789ABCDEF"
    ],
    warning: { level: "experimental", message: "Experimental. Opaque data; not for general use." },
  },
  {
    slug: "wks",
    type: "WKS",
    typeCode: 11,
    title: "WKS — Well-Known Services",
    tagline: "Obsolete host services bitmap.",
    synopsis: "Address, IP protocol, and bit map of well-known ports.",
    image: "/dns/rr/wks.jpg",
    imageAlt: "Cat meme labelled WKS",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "ADDRESS",
        type: "32-bit unsigned integer",
        description: "IPv4 address of the host.",
        example: "192.0.2.1",
      },
      {
        name: "PROTOCOL",
        type: "8-bit unsigned integer",
        description: "IP protocol number (e.g. 6 = TCP).",
        example: "6",
      },
      {
        name: "BITMAP",
        type: "bit map",
        description: "Well-known service ports offered.",
        example: "0 21 23 25",
      }
    ],
    examples: [
      "example.com.  300  IN  WKS  192.0.2.1 6 0 21 23 25",
      "example.com.  300  IN  WKS  192.0.2.1 17 53",
      "host.example.  300  IN  WKS  198.51.100.10 6 22 80 443"
    ],
    warning: { level: "obsolete", message: "Obsolete. Rarely used; prefer SRV/SVCB where applicable." },
  },
  {
    slug: "ptr",
    type: "PTR",
    typeCode: 12,
    title: "PTR — Pointer",
    tagline: "Pointer to another name (often reverse DNS).",
    synopsis: "One domain name. Commonly used under in-addr.arpa / ip6.arpa.",
    image: "/dns/rr/ptr.jpg",
    imageAlt: "Cat meme labelled PTR",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "PTRDNAME",
        type: "domain-name",
        description: "Target domain name.",
        example: "www.example.com.",
      }
    ],
    examples: [
      "1.2.0.192.in-addr.arpa.  300  IN  PTR  www.example.com.",
      "10.100.51.198.in-addr.arpa.  300  IN  PTR  mail.example.com.",
      "b.a.9.8.7.6.5.0.4.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa.  300  IN  PTR  host.example.com."
    ],
  },
  {
    slug: "hinfo",
    type: "HINFO",
    typeCode: 13,
    title: "HINFO — Host Information",
    tagline: "CPU and OS description.",
    synopsis: "Two character-strings: CPU and OS.",
    image: "/dns/rr/hinfo.jpg",
    imageAlt: "Cat meme labelled HINFO",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "CPU",
        type: "character-string",
        description: "CPU type description.",
        example: "PDP-11",
      },
      {
        name: "OS",
        type: "character-string",
        description: "Operating system description.",
        example: "UNIX",
      }
    ],
    examples: [
      "example.com.  300  IN  HINFO  \"PDP-11\" \"UNIX\"",
      "host.example.  300  IN  HINFO  \"PC-Intel\" \"Linux\"",
      "srv.example.net.  300  IN  HINFO  \"ARM\" \"FreeBSD\""
    ],
  },
  {
    slug: "minfo",
    type: "MINFO",
    typeCode: 14,
    title: "MINFO — Mailbox Info",
    tagline: "Experimental mailing list / mailbox info.",
    synopsis: "Responsible mailbox and error mailbox.",
    image: "/dns/rr/minfo.jpg",
    imageAlt: "Cat meme labelled MINFO",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "RMAILBX",
        type: "domain-name",
        description: "Mailbox responsible for the mailing list or mailbox.",
        example: "admin.example.com.",
      },
      {
        name: "EMAILBX",
        type: "domain-name",
        description: "Mailbox to receive error messages.",
        example: "errors.example.com.",
      }
    ],
    examples: [
      "list.example.com.  300  IN  MINFO  admin.example.com. errors.example.com.",
      "news.example.com.  300  IN  MINFO  owner.example.com. bounce.example.com.",
      "ml.example.net.  300  IN  MINFO  postmaster.example.net. postmaster.example.net."
    ],
    warning: { level: "experimental", message: "Experimental mailbox/mailing-list info. Not used in modern mail." },
  },
  {
    slug: "mx",
    type: "MX",
    typeCode: 15,
    title: "MX — Mail Exchange",
    tagline: "Mail delivery target for a name.",
    synopsis: "Preference and exchange name. Lower preference is tried first.",
    image: "/dns/rr/mx.jpg",
    imageAlt: "Cat in a postman satchel with mail, labelled MX",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" },
      { id: "RFC 7505", url: "https://www.rfc-editor.org/rfc/rfc7505" }
    ],
    fields: [
      {
        name: "PREFERENCE",
        type: "16-bit unsigned integer",
        description: "Sort key. Lower is preferred. Equal values are alternatives.",
        example: "10",
      },
      {
        name: "EXCHANGE",
        type: "domain-name",
        description: "Mail server host name. Must resolve via A or AAAA, not MX.",
        example: "mail.example.com.",
      }
    ],
    examples: [
      "example.com.  300  IN  MX  10 mail.example.com.",
      "example.com.  300  IN  MX  20 mail2.example.com.",
      "example.com.  300  IN  MX  0  ."
    ],
  },
  {
    slug: "txt",
    type: "TXT",
    typeCode: 16,
    title: "TXT — Text",
    tagline: "Arbitrary text strings.",
    synopsis: "One or more character-strings. Often used for policy and verification.",
    image: "/dns/rr/txt.jpg",
    imageAlt: "Cat meme labelled TXT",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "TXT-DATA",
        type: "character-string+",
        description: "One or more text strings concatenated by applications as needed.",
        example: "\"v=spf1 -all\"",
      }
    ],
    examples: [
      "example.com.  300  IN  TXT  \"v=spf1 include:_spf.example.com -all\"",
      "example.com.  300  IN  TXT  \"google-site-verification=abc123\"",
      "_dmarc.example.com.  300  IN  TXT  \"v=DMARC1; p=reject; rua=mailto:dmarc@example.com\""
    ],
  },
  {
    slug: "rp",
    type: "RP",
    typeCode: 17,
    title: "RP — Responsible Person",
    tagline: "Responsible person and TXT mailbox info.",
    synopsis: "Mailbox domain-name and a TXT domain-name for more info.",
    image: "/dns/rr/rp.jpg",
    imageAlt: "Cat meme labelled RP",
    rfcs: [
      { id: "RFC 1183", url: "https://www.rfc-editor.org/rfc/rfc1183" }
    ],
    fields: [
      {
        name: "MBOX-DNAME",
        type: "domain-name",
        description: "Mailbox of the responsible person (dot for none).",
        example: "hostmaster.example.com.",
      },
      {
        name: "TXT-DNAME",
        type: "domain-name",
        description: "Domain name where TXT records give more info (dot for none).",
        example: "rp.example.com.",
      }
    ],
    examples: [
      "example.com.  300  IN  RP  hostmaster.example.com. rp.example.com.",
      "example.com.  300  IN  RP  admin.example.com. .",
      "host.example.  300  IN  RP  . ."
    ],
  },
  {
    slug: "afsdb",
    type: "AFSDB",
    typeCode: 18,
    title: "AFSDB — AFS Data Base",
    tagline: "AFS or DCE volume location server.",
    synopsis: "Subtype and server host name.",
    image: "/dns/rr/afsdb.jpg",
    imageAlt: "Cat meme labelled AFSDB",
    rfcs: [
      { id: "RFC 1183", url: "https://www.rfc-editor.org/rfc/rfc1183" }
    ],
    fields: [
      {
        name: "SUBTYPE",
        type: "16-bit unsigned integer",
        description: "1 = AFS volume location server; 2 = DCE authenticated name server.",
        example: "1",
      },
      {
        name: "HOSTNAME",
        type: "domain-name",
        description: "Host that has a server for the cell named by the owner.",
        example: "afsdb.example.com.",
      }
    ],
    examples: [
      "example.com.  300  IN  AFSDB  1 afsdb.example.com.",
      "example.com.  300  IN  AFSDB  2 dce.example.com.",
      "cell.example.  300  IN  AFSDB  1 vl.cell.example."
    ],
  },
  {
    slug: "x25",
    type: "X25",
    typeCode: 19,
    title: "X25 — X.25 PSDN Address",
    tagline: "X.25 PSDN address.",
    synopsis: "One character-string: PSDN address in decimal digits.",
    image: "/dns/rr/x25.jpg",
    imageAlt: "Cat meme labelled X25",
    rfcs: [
      { id: "RFC 1183", url: "https://www.rfc-editor.org/rfc/rfc1183" }
    ],
    fields: [
      {
        name: "PSDN-ADDRESS",
        type: "character-string",
        description: "X.25 PSDN address digits.",
        example: "311061700956",
      }
    ],
    examples: [
      "example.com.  300  IN  X25  311061700956",
      "host.example.  300  IN  X25  311061701234",
      "gw.example.net.  300  IN  X25  311061709999"
    ],
  },
  {
    slug: "isdn",
    type: "ISDN",
    typeCode: 20,
    title: "ISDN — ISDN Address",
    tagline: "ISDN address and optional subaddress.",
    synopsis: "ISDN address string and optional SA string.",
    image: "/dns/rr/isdn.jpg",
    imageAlt: "Cat meme labelled ISDN",
    rfcs: [
      { id: "RFC 1183", url: "https://www.rfc-editor.org/rfc/rfc1183" }
    ],
    fields: [
      {
        name: "ISDN-ADDRESS",
        type: "character-string",
        description: "ISDN number.",
        example: "150862028003217",
      },
      {
        name: "SA",
        type: "character-string",
        description: "Optional subaddress.",
        example: "004",
      }
    ],
    examples: [
      "example.com.  300  IN  ISDN  150862028003217",
      "example.com.  300  IN  ISDN  150862028003217 004",
      "host.example.  300  IN  ISDN  150862028009999 001"
    ],
  },
  {
    slug: "rt",
    type: "RT",
    typeCode: 21,
    title: "RT — Route Through",
    tagline: "Intermediate host for routing.",
    synopsis: "Preference and intermediate-host name. Lower preference preferred.",
    image: "/dns/rr/rt.jpg",
    imageAlt: "Cat meme labelled RT",
    rfcs: [
      { id: "RFC 1183", url: "https://www.rfc-editor.org/rfc/rfc1183" }
    ],
    fields: [
      {
        name: "PREFERENCE",
        type: "16-bit unsigned integer",
        description: "Sort key. Lower is preferred.",
        example: "10",
      },
      {
        name: "INTERMEDIATE-HOST",
        type: "domain-name",
        description: "Host that serves as an intermediate in reaching the owner.",
        example: "relay.example.com.",
      }
    ],
    examples: [
      "example.com.  300  IN  RT  10 relay.example.com.",
      "example.com.  300  IN  RT  20 backup.example.com.",
      "host.example.  300  IN  RT  5 gw.example.net."
    ],
  },
  {
    slug: "nsap",
    type: "NSAP",
    typeCode: 22,
    title: "NSAP — NSAP Address",
    tagline: "ISO NSAP address.",
    synopsis: "Hexadecimal NSAP address (optional 0x prefix).",
    image: "/dns/rr/nsap.jpg",
    imageAlt: "Cat meme labelled NSAP",
    rfcs: [
      { id: "RFC 1706", url: "https://www.rfc-editor.org/rfc/rfc1706" }
    ],
    fields: [
      {
        name: "NSAP",
        type: "octet string (hex)",
        description: "NSAP address in hex.",
        example: "0x47.0005.80.005a00.0000.0001.e133.ffffff000161.00",
      }
    ],
    examples: [
      "example.com.  300  IN  NSAP  0x47.0005.80.005a00.0000.0001.e133.ffffff000161.00",
      "host.example.  300  IN  NSAP  47.0005.80.005a00.0000.0001.e133.ffffff000162.00",
      "nsap.example.  300  IN  NSAP  0x47.0005.80.005a00.0000.0001.e133.ffffff000163.00"
    ],
    warning: { level: "deprecated", message: "Deprecated. NSAP addressing in DNS is not in common use." },
  },
  {
    slug: "nsap-ptr",
    type: "NSAP-PTR",
    typeCode: 23,
    title: "NSAP-PTR — NSAP Pointer",
    tagline: "Reverse map for NSAP.",
    synopsis: "One domain name pointing from an NSAP reverse name.",
    image: "/dns/rr/nsap-ptr.jpg",
    imageAlt: "Cat meme labelled NSAP-PTR",
    rfcs: [
      { id: "RFC 1348", url: "https://www.rfc-editor.org/rfc/rfc1348" }
    ],
    fields: [
      {
        name: "PTRDNAME",
        type: "domain-name",
        description: "Target domain name.",
        example: "host.example.com.",
      }
    ],
    examples: [
      "1.6.1.0.0.0.f.f.f.f.f.f.3.3.1.e.1.0.0.0.0.0.0.0.0.0.a.5.0.0.0.8.0.5.0.0.0.7.4.NSAP.INT.  300  IN  NSAP-PTR  host.example.com.",
      "example.nsap.int.  300  IN  NSAP-PTR  www.example.com.",
      "test.nsap.int.  300  IN  NSAP-PTR  mail.example.com."
    ],
    warning: { level: "deprecated", message: "Deprecated. NSAP reverse mapping is not in common use." },
  },
  {
    slug: "sig",
    type: "SIG",
    typeCode: 24,
    title: "SIG — Signature",
    tagline: "Obsolete signature RR (DNSSEC precursor).",
    synopsis: "Type covered, algorithm, labels, TTL, expiration, inception, key tag, signer, signature.",
    image: "/dns/rr/sig.jpg",
    imageAlt: "Cat meme labelled SIG",
    rfcs: [
      { id: "RFC 2535", url: "https://www.rfc-editor.org/rfc/rfc2535" }
    ],
    fields: [
      {
        name: "TYPE COVERED",
        type: "type mnemonic",
        description: "RR type covered by this signature.",
        example: "A",
      },
      {
        name: "ALGORITHM",
        type: "8-bit unsigned integer",
        description: "Cryptographic algorithm.",
        example: "5",
      },
      {
        name: "LABELS",
        type: "8-bit unsigned integer",
        description: "Number of labels in the original SIG RR owner name.",
        example: "2",
      },
      {
        name: "ORIGINAL TTL",
        type: "32-bit unsigned integer",
        description: "TTL of the covered RRset.",
        example: "300",
      },
      {
        name: "SIGNATURE EXPIRATION",
        type: "YYYYMMDDHHmmSS",
        description: "When the signature expires.",
        example: "20261201000000",
      },
      {
        name: "SIGNATURE INCEPTION",
        type: "YYYYMMDDHHmmSS",
        description: "When the signature becomes valid.",
        example: "20261001000000",
      },
      {
        name: "KEY TAG",
        type: "16-bit unsigned integer",
        description: "Key tag of the KEY RR used.",
        example: "12345",
      },
      {
        name: "SIGNER'S NAME",
        type: "domain-name",
        description: "Name of the signer.",
        example: "example.com.",
      },
      {
        name: "SIGNATURE",
        type: "base64",
        description: "Cryptographic signature.",
        example: "YmxvYg==",
      }
    ],
    examples: [
      "example.com.  300  IN  SIG  A 5 2 300 20261201000000 20261001000000 12345 example.com. YmxvYg==",
      "example.com.  300  IN  SIG  MX 5 2 300 20261201000000 20261001000000 12345 example.com. YmxvYg==",
      "www.example.com.  300  IN  SIG  A 5 3 60 20261201000000 20261001000000 54321 example.com. YmxvYg=="
    ],
    warning: { level: "obsolete", message: "Obsolete for DNSSEC. Use RRSIG." },
  },
  {
    slug: "key",
    type: "KEY",
    typeCode: 25,
    title: "KEY — Key",
    tagline: "Obsolete public key RR.",
    synopsis: "Flags, protocol, algorithm, and public key.",
    image: "/dns/rr/key.jpg",
    imageAlt: "Cat meme labelled KEY",
    rfcs: [
      { id: "RFC 2535", url: "https://www.rfc-editor.org/rfc/rfc2535" }
    ],
    fields: [
      {
        name: "FLAGS",
        type: "16-bit unsigned integer",
        description: "Key flags.",
        example: "256",
      },
      {
        name: "PROTOCOL",
        type: "8-bit unsigned integer",
        description: "Protocol (3 = DNSSEC).",
        example: "3",
      },
      {
        name: "ALGORITHM",
        type: "8-bit unsigned integer",
        description: "Public key algorithm.",
        example: "5",
      },
      {
        name: "PUBLIC KEY",
        type: "base64",
        description: "Public key material.",
        example: "AQPSKmynfzW4kyBv015MUG2DeIQ3Cbl+BBZH4b/0PY1kxkmvHjcZc8nokfzj31GajIQKY+5CptLr3buXAOmVVoUUb6A==",
      }
    ],
    examples: [
      "example.com.  300  IN  KEY  256 3 5 AQPSKmynfzW4kyBv015MUG2DeIQ3Cbl+BBZH4b/0PY1kxkmvHjcZc8nokfzj31GajIQKY+5CptLr3buXAOmVVoUUb6A==",
      "example.com.  300  IN  KEY  257 3 5 AQPSKmynfzW4kyBv015MUG2DeIQ3Cbl+BBZH4b/0PY1kxkmvHjcZc8nokfzj31GajIQKY+5CptLr3buXAOmVVoUUb6A==",
      "host.example.  300  IN  KEY  0 3 1 AQPSKmynfzW4kyBv015MUG2DeIQ3"
    ],
    warning: { level: "obsolete", message: "Obsolete for DNSSEC. Use DNSKEY/CDNSKEY." },
  },
  {
    slug: "px",
    type: "PX",
    typeCode: 26,
    title: "PX — X.400 / RFC 822 Mapping",
    tagline: "X.400 mail mapping pointer.",
    synopsis: "Preference, RFC822 domain, and X.400 domain.",
    image: "/dns/rr/px.jpg",
    imageAlt: "Cat meme labelled PX",
    rfcs: [
      { id: "RFC 2163", url: "https://www.rfc-editor.org/rfc/rfc2163" }
    ],
    fields: [
      {
        name: "PREFERENCE",
        type: "16-bit unsigned integer",
        description: "Sort key. Lower preferred.",
        example: "10",
      },
      {
        name: "MAP822",
        type: "domain-name",
        description: "RFC 822 domain element.",
        example: "example.com.",
      },
      {
        name: "MAPX400",
        type: "domain-name",
        description: "X.400 domain element encoded as a domain name.",
        example: "PRMD-example.ADMD-p400.C-gb.",
      }
    ],
    examples: [
      "example.com.  300  IN  PX  10 example.com. PRMD-example.ADMD-p400.C-gb.",
      "net.example.  300  IN  PX  20 net.example. O-net.PRMD-example.ADMD-p400.C-gb.",
      "mail.example.  300  IN  PX  10 mail.example. PRMD-mail.ADMD-p400.C-us."
    ],
  },
  {
    slug: "gpos",
    type: "GPOS",
    typeCode: 27,
    title: "GPOS — Geographical Position",
    tagline: "Obsolete longitude/latitude/altitude strings.",
    synopsis: "Three character-strings: longitude, latitude, altitude. Prefer LOC.",
    image: "/dns/rr/gpos.jpg",
    imageAlt: "Cat meme labelled GPOS",
    rfcs: [
      { id: "RFC 1712", url: "https://www.rfc-editor.org/rfc/rfc1712" }
    ],
    fields: [
      {
        name: "LONGITUDE",
        type: "character-string",
        description: "Longitude in degrees.",
        example: "-123.456",
      },
      {
        name: "LATITUDE",
        type: "character-string",
        description: "Latitude in degrees.",
        example: "45.123",
      },
      {
        name: "ALTITUDE",
        type: "character-string",
        description: "Altitude in meters.",
        example: "49.00",
      }
    ],
    examples: [
      "example.com.  300  IN  GPOS  \"-123.456\" \"45.123\" \"49.00\"",
      "host.example.  300  IN  GPOS  \"0.000\" \"0.000\" \"0.00\"",
      "office.example.  300  IN  GPOS  \"-0.1276\" \"51.5074\" \"25.00\""
    ],
    warning: { level: "obsolete", message: "Obsolete. Use LOC." },
  },
  {
    slug: "aaaa",
    type: "AAAA",
    typeCode: 28,
    title: "AAAA — IPv6 Address",
    tagline: "Maps a name to an IPv6 address.",
    synopsis: "One 128-bit IPv6 address in text form.",
    image: "/dns/rr/aaaa.jpg",
    imageAlt: "Cat meme labelled AAAA",
    rfcs: [
      { id: "RFC 3596", url: "https://www.rfc-editor.org/rfc/rfc3596" }
    ],
    fields: [
      {
        name: "ADDRESS",
        type: "128-bit IPv6 address",
        description: "IPv6 address (RFC 5952 text form preferred).",
        example: "2001:db8::1",
      }
    ],
    examples: [
      "example.com.  300  IN  AAAA  2001:db8::1",
      "www.example.com.  300  IN  AAAA  2001:db8:0:1::10",
      "origin.cdn.example.  60  IN  AAAA  2001:db8:abcd::50"
    ],
  },
  {
    slug: "loc",
    type: "LOC",
    typeCode: 29,
    title: "LOC — Location",
    tagline: "Geographical location.",
    synopsis: "Latitude, longitude, altitude, and optional size/precision fields.",
    image: "/dns/rr/loc.jpg",
    imageAlt: "Cat meme labelled LOC",
    rfcs: [
      { id: "RFC 1876", url: "https://www.rfc-editor.org/rfc/rfc1876" }
    ],
    fields: [
      {
        name: "LATITUDE",
        type: "d m s hemisphere",
        description: "Degrees minutes seconds N/S.",
        example: "42 21 54.000 N",
      },
      {
        name: "LONGITUDE",
        type: "d m s hemisphere",
        description: "Degrees minutes seconds E/W.",
        example: "71 06 18.000 W",
      },
      {
        name: "ALTITUDE",
        type: "meters",
        description: "Altitude in meters (trailing m).",
        example: "10.00m",
      },
      {
        name: "SIZE",
        type: "meters",
        description: "Optional diameter of a sphere enclosing the entity.",
        example: "1m",
      },
      {
        name: "HORIZONTAL PRECISION",
        type: "meters",
        description: "Optional horizontal precision.",
        example: "100m",
      },
      {
        name: "VERTICAL PRECISION",
        type: "meters",
        description: "Optional vertical precision.",
        example: "10m",
      }
    ],
    examples: [
      "example.com.  300  IN  LOC  42 21 54.000 N 71 06 18.000 W 10.00m",
      "example.com.  300  IN  LOC  42 21 54.000 N 71 06 18.000 W 10.00m 1m 100m 10m",
      "office.example.  300  IN  LOC  51 30 26.000 N 0 7 39.000 W 25.00m"
    ],
  },
  {
    slug: "nxt",
    type: "NXT",
    typeCode: 30,
    title: "NXT — Next Domain",
    tagline: "Obsolete next-domain denial of existence.",
    synopsis: "Next domain name and type bit map. Replaced by NSEC/NSEC3.",
    image: "/dns/rr/nxt.jpg",
    imageAlt: "Cat meme labelled NXT",
    rfcs: [
      { id: "RFC 2535", url: "https://www.rfc-editor.org/rfc/rfc2535" }
    ],
    fields: [
      {
        name: "NEXT DOMAIN NAME",
        type: "domain-name",
        description: "Next owner name in the zone in canonical order. Same zone/TLD as the owner.",
        example: "b.example.",
      },
      {
        name: "TYPE BIT MAP",
        type: "type list",
        description: "Types present at the owner name.",
        example: "A NXT",
      }
    ],
    examples: [
      "a.example.  300  IN  NXT  b.example. A NXT",
      "b.example.  300  IN  NXT  c.example. A MX NXT",
      "c.example.  300  IN  NXT  a.example. NS SOA NXT"
    ],
    warning: { level: "obsolete", message: "Obsolete. Replaced by NSEC/NSEC3." },
  },
  {
    slug: "eid",
    type: "EID",
    typeCode: 31,
    title: "EID — Endpoint Identifier",
    tagline: "Endpoint identifier (Nimrod).",
    synopsis: "Opaque endpoint identifier octets. Format not widely deployed; often unknown-type hex.",
    image: "/dns/rr/eid.jpg",
    imageAlt: "Cat meme labelled EID",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "EID",
        type: "octet string",
        description: "Endpoint identifier. Commonly shown as RFC 3597 unknown-type hex.",
        example: "\\# 8 0123456789ABCDEF",
      }
    ],
    examples: [
      "example.com.  300  IN  EID  \\# 8 0123456789ABCDEF",
      "host.example.  300  IN  TYPE31  \\# 4 DEADBEEF",
      "nid.example.  300  IN  EID  \\# 16 00112233445566778899AABBCCDDEEFF"
    ],
  },
  {
    slug: "nimloc",
    type: "NIMLOC",
    typeCode: 32,
    title: "NIMLOC — Nimrod Locator",
    tagline: "Nimrod locator.",
    synopsis: "Opaque locator octets. Format not widely deployed; often unknown-type hex.",
    image: "/dns/rr/nimloc.jpg",
    imageAlt: "Cat meme labelled NIMLOC",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "LOCATOR",
        type: "octet string",
        description: "Nimrod locator. Commonly shown as RFC 3597 unknown-type hex.",
        example: "\\# 8 FEDCBA9876543210",
      }
    ],
    examples: [
      "example.com.  300  IN  NIMLOC  \\# 8 FEDCBA9876543210",
      "host.example.  300  IN  TYPE32  \\# 4 CAFEBABE",
      "loc.example.  300  IN  NIMLOC  \\# 16 00112233445566778899AABBCCDDEEFF"
    ],
  },
  {
    slug: "srv",
    type: "SRV",
    typeCode: 33,
    title: "SRV — Service",
    tagline: "Service location (priority, weight, port, target).",
    synopsis: "Priority, weight, port, and target host. Lower priority preferred; weight for load among equals.",
    image: "/dns/rr/srv.jpg",
    imageAlt: "Cat meme labelled SRV",
    rfcs: [
      { id: "RFC 2782", url: "https://www.rfc-editor.org/rfc/rfc2782" }
    ],
    fields: [
      {
        name: "PRIORITY",
        type: "16-bit unsigned integer",
        description: "Lower preferred.",
        example: "10",
      },
      {
        name: "WEIGHT",
        type: "16-bit unsigned integer",
        description: "Relative weight among equal priority.",
        example: "60",
      },
      {
        name: "PORT",
        type: "16-bit unsigned integer",
        description: "Service port.",
        example: "5060",
      },
      {
        name: "TARGET",
        type: "domain-name",
        description: "Host providing the service (A/AAAA). Dot means none.",
        example: "sip.example.com.",
      }
    ],
    examples: [
      "_sip._tcp.example.com.  300  IN  SRV  10 60 5060 sip.example.com.",
      "_xmpp-server._tcp.example.com.  300  IN  SRV  5 0 5269 xmpp.example.com.",
      "_ldap._tcp.example.com.  300  IN  SRV  0 100 389 ."
    ],
  },
  {
    slug: "atma",
    type: "ATMA",
    typeCode: 34,
    title: "ATMA — ATM Address",
    tagline: "ATM address.",
    synopsis: "Format and ATM address (AESA or E.164).",
    image: "/dns/rr/atma.jpg",
    imageAlt: "Cat meme labelled ATMA",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "FORMAT",
        type: "8-bit unsigned integer",
        description: "0 = ATM End System Address; 1 = E.164.",
        example: "0",
      },
      {
        name: "ADDRESS",
        type: "octet / digit string",
        description: "ATM address in hex (AESA) or digits (E.164).",
        example: "39.246f.00.0e7c9c.0342.00.0020.9009.0020.0200.0000.0000.0100.0000.0000.00",
      }
    ],
    examples: [
      "example.com.  300  IN  ATMA  0 39.246f.00.0e7c9c.0342.00.0020.9009.0020.0200.0000.0000.0100.0000.0000.00",
      "example.com.  300  IN  ATMA  1 123456789012345",
      "atm.example.  300  IN  ATMA  0 47.0005.80.ffe100.0000.f21a.01.123456789abc.00"
    ],
  },
  {
    slug: "naptr",
    type: "NAPTR",
    typeCode: 35,
    title: "NAPTR — Naming Authority Pointer",
    tagline: "Rewrite rule for URI / service discovery.",
    synopsis: "Order, preference, flags, services, regexp, and replacement.",
    image: "/dns/rr/naptr.jpg",
    imageAlt: "Cat meme labelled NAPTR",
    rfcs: [
      { id: "RFC 3403", url: "https://www.rfc-editor.org/rfc/rfc3403" }
    ],
    fields: [
      {
        name: "ORDER",
        type: "16-bit unsigned integer",
        description: "Lower processed first.",
        example: "100",
      },
      {
        name: "PREFERENCE",
        type: "16-bit unsigned integer",
        description: "Lower preferred within same order.",
        example: "10",
      },
      {
        name: "FLAGS",
        type: "character-string",
        description: "Flags controlling interpretation (e.g. \"U\", \"S\", \"A\", \"\").",
        example: "\"U\"",
      },
      {
        name: "SERVICES",
        type: "character-string",
        description: "Service and protocol tokens.",
        example: "\"E2U+sip\"",
      },
      {
        name: "REGEXP",
        type: "character-string",
        description: "Substitution expression, or empty if unused.",
        example: "\"!^.*$!sip:info@example.com!\"",
      },
      {
        name: "REPLACEMENT",
        type: "domain-name",
        description: "Next name to query if regexp unused.",
        example: ".",
      }
    ],
    examples: [
      "example.com.  300  IN  NAPTR  100 10 \"U\" \"E2U+sip\" \"!^.*$!sip:info@example.com!\" .",
      "example.com.  300  IN  NAPTR  100 20 \"S\" \"SIP+D2U\" \"\" _sip._udp.example.com.",
      "0.2.0.192.in-addr.arpa.  300  IN  NAPTR  10 100 \"U\" \"E2U+sip\" \"!^.*$!sip:user@example.com!\" ."
    ],
  },
  {
    slug: "kx",
    type: "KX",
    typeCode: 36,
    title: "KX — Key Exchanger",
    tagline: "Key exchanger for this name.",
    synopsis: "Preference and exchanger domain name.",
    image: "/dns/rr/kx.jpg",
    imageAlt: "Cat meme labelled KX",
    rfcs: [
      { id: "RFC 2230", url: "https://www.rfc-editor.org/rfc/rfc2230" }
    ],
    fields: [
      {
        name: "PREFERENCE",
        type: "16-bit unsigned integer",
        description: "Lower preferred.",
        example: "10",
      },
      {
        name: "EXCHANGER",
        type: "domain-name",
        description: "Host willing to act as a key exchanger.",
        example: "kx.example.com.",
      }
    ],
    examples: [
      "example.com.  300  IN  KX  10 kx.example.com.",
      "example.com.  300  IN  KX  20 kx2.example.com.",
      "secure.example.  300  IN  KX  5 keys.secure.example."
    ],
  },
  {
    slug: "cert",
    type: "CERT",
    typeCode: 37,
    title: "CERT — Certificate",
    tagline: "Certificate or CRL.",
    synopsis: "Type, key tag, algorithm, and certificate data.",
    image: "/dns/rr/cert.jpg",
    imageAlt: "Cat meme labelled CERT",
    rfcs: [
      { id: "RFC 4398", url: "https://www.rfc-editor.org/rfc/rfc4398" }
    ],
    fields: [
      {
        name: "TYPE",
        type: "16-bit unsigned integer / mnemonic",
        description: "Certificate type (e.g. PKIX, SPKI, PGP).",
        example: "PKIX",
      },
      {
        name: "KEY TAG",
        type: "16-bit unsigned integer",
        description: "Key tag.",
        example: "12345",
      },
      {
        name: "ALGORITHM",
        type: "8-bit unsigned integer",
        description: "Algorithm used for the CERT RR.",
        example: "5",
      },
      {
        name: "CERTIFICATE",
        type: "base64",
        description: "Certificate or CRL data.",
        example: "MIIC...",
      }
    ],
    examples: [
      "example.com.  300  IN  CERT  PKIX 12345 5 MIICXDCCAcWgAwIBAgIE...",
      "example.com.  300  IN  CERT  PGP 0 0 mQGiBFj...",
      "user.example.  300  IN  CERT  1 0 8 MIIE..."
    ],
  },
  {
    slug: "a6",
    type: "A6",
    typeCode: 38,
    title: "A6 — IPv6 Address (obsolete)",
    tagline: "Obsolete IPv6 address with suffix/prefix chaining.",
    synopsis: "Prefix length, address suffix, and optional prefix name. Use AAAA.",
    image: "/dns/rr/a6.jpg",
    imageAlt: "Cat meme labelled A6",
    rfcs: [
      { id: "RFC 2874", url: "https://www.rfc-editor.org/rfc/rfc2874" }
    ],
    fields: [
      {
        name: "PREFIX LENGTH",
        type: "8-bit unsigned integer",
        description: "Significant bits of the suffix (0–128).",
        example: "64",
      },
      {
        name: "ADDRESS SUFFIX",
        type: "IPv6 address",
        description: "Address suffix.",
        example: "0:0:0:0:0234:5678:9abc:def0",
      },
      {
        name: "PREFIX NAME",
        type: "domain-name",
        description: "Optional name of prefix (omitted if length 128).",
        example: "prefix.example.com.",
      }
    ],
    examples: [
      "example.com.  300  IN  A6  64 ::1234:5678:9abc:def0 prefix.example.com.",
      "example.com.  300  IN  A6  0 prefix.example.com.",
      "host.example.  300  IN  A6  128 2001:db8::1"
    ],
    warning: { level: "obsolete", message: "Obsolete. Use AAAA." },
  },
  {
    slug: "dname",
    type: "DNAME",
    typeCode: 39,
    title: "DNAME — Delegation Name",
    tagline: "Redirection of a subtree.",
    synopsis: "One domain name: target of the alias for the subtree under the owner.",
    image: "/dns/rr/dname.jpg",
    imageAlt: "Cat meme labelled DNAME",
    rfcs: [
      { id: "RFC 6672", url: "https://www.rfc-editor.org/rfc/rfc6672" }
    ],
    fields: [
      {
        name: "TARGET",
        type: "domain-name",
        description: "Substitution target for names under the owner.",
        example: "example.net.",
      }
    ],
    examples: [
      "example.com.  300  IN  DNAME  example.net.",
      "old.example.  300  IN  DNAME  new.example.",
      "subtree.example.org.  300  IN  DNAME  elsewhere.example.net."
    ],
  },
  {
    slug: "sink",
    type: "SINK",
    typeCode: 40,
    title: "SINK — Kitchen Sink",
    tagline: "Miscellaneous structured data (never standardized).",
    synopsis: "Coding, subcoding, and opaque data. Best treated as unknown-type.",
    image: "/dns/rr/sink.jpg",
    imageAlt: "Cat meme labelled SINK",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "CODING",
        type: "8-bit unsigned integer",
        description: "Coding value.",
        example: "0",
      },
      {
        name: "SUBCODING",
        type: "8-bit unsigned integer",
        description: "Subcoding value.",
        example: "0",
      },
      {
        name: "DATA",
        type: "octet string",
        description: "Payload. Often shown as RFC 3597 hex.",
        example: "\\# 4 00000102",
      }
    ],
    examples: [
      "example.com.  300  IN  SINK  \\# 4 00000102",
      "example.com.  300  IN  TYPE40  \\# 6 0000DEADBEEF",
      "host.example.  300  IN  SINK  \\# 0"
    ],
  },
  {
    slug: "opt",
    type: "OPT",
    typeCode: 41,
    title: "OPT — Option (EDNS)",
    tagline: "EDNS pseudo-RR carrying UDP size and options.",
    synopsis: "Not a zone RR. UDP payload size in CLASS; extended RCODE/version/flags in TTL; options in RDATA.",
    image: "/dns/rr/opt.jpg",
    imageAlt: "Cat meme labelled OPT",
    rfcs: [
      { id: "RFC 6891", url: "https://www.rfc-editor.org/rfc/rfc6891" }
    ],
    fields: [
      {
        name: "NAME",
        type: "root (.)",
        description: "Must be the root label.",
        example: ".",
      },
      {
        name: "UDP PAYLOAD SIZE",
        type: "CLASS field",
        description: "Sender UDP payload size.",
        example: "1232",
      },
      {
        name: "EXTENDED-RCODE / VERSION / FLAGS",
        type: "TTL field",
        description: "Upper 8 bits extended RCODE, next 8 version, lower flags (DO etc.).",
        example: "0",
      },
      {
        name: "OPTIONS",
        type: "attribute-value pairs",
        description: "EDNS options (code, length, data).",
        example: "COOKIE ...",
      }
    ],
    examples: [
      "; EDNS: version: 0, flags:; udp: 1232",
      "; OPT PSEUDOSECTION: EDNS: version 0, flags: do; udp: 4096",
      ".  0  CLASS1232  OPT  ..."
    ],
    warning: { level: "meta", message: "Pseudo-RR for EDNS. Not a normal zone RRset." },
  },
  {
    slug: "apl",
    type: "APL",
    typeCode: 42,
    title: "APL — Address Prefix List",
    tagline: "List of address prefixes.",
    synopsis: "Zero or more !af:prefix entries (! = negation).",
    image: "/dns/rr/apl.jpg",
    imageAlt: "Cat meme labelled APL",
    rfcs: [
      { id: "RFC 3123", url: "https://www.rfc-editor.org/rfc/rfc3123" }
    ],
    fields: [
      {
        name: "APITEM",
        type: "!af:address/prefix",
        description: "Address family, address, and prefix length; optional leading !.",
        example: "1:192.0.2.0/24",
      }
    ],
    examples: [
      "example.com.  300  IN  APL  1:192.0.2.0/24",
      "example.com.  300  IN  APL  1:192.0.2.0/24 2:2001:db8::/32",
      "example.com.  300  IN  APL  !1:192.0.2.0/24 1:192.0.2.0/25"
    ],
  },
  {
    slug: "ds",
    type: "DS",
    typeCode: 43,
    title: "DS — Delegation Signer",
    tagline: "Hash of a child DNSKEY for secure delegation.",
    synopsis: "Key tag, algorithm, digest type, and digest.",
    image: "/dns/rr/ds.jpg",
    imageAlt: "Cat meme labelled DS",
    rfcs: [
      { id: "RFC 4034", url: "https://www.rfc-editor.org/rfc/rfc4034" }
    ],
    fields: [
      {
        name: "KEY TAG",
        type: "16-bit unsigned integer",
        description: "Key tag of the referenced DNSKEY.",
        example: "60485",
      },
      {
        name: "ALGORITHM",
        type: "8-bit unsigned integer",
        description: "DNSKEY algorithm.",
        example: "5",
      },
      {
        name: "DIGEST TYPE",
        type: "8-bit unsigned integer",
        description: "Digest algorithm (1 = SHA-1, 2 = SHA-256).",
        example: "1",
      },
      {
        name: "DIGEST",
        type: "hex",
        description: "Digest of the DNSKEY RR.",
        example: "2BB183AF5F22588179A53B0A98631FAD1A292118",
      }
    ],
    examples: [
      "example.com.  300  IN  DS  60485 5 1 2BB183AF5F22588179A53B0A98631FAD1A292118",
      "example.com.  300  IN  DS  60485 8 2 E2D3C23E5C9B6A1F4A0B8C7D6E5F4A3B2C1D0E9F8A7B6C5D4E3F2A1B0C9D8E7F",
      "child.example.  300  IN  DS  12345 13 2 0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF"
    ],
  },
  {
    slug: "sshfp",
    type: "SSHFP",
    typeCode: 44,
    title: "SSHFP — SSH Fingerprint",
    tagline: "SSH host key fingerprint.",
    synopsis: "Algorithm, fingerprint type, and hex fingerprint.",
    image: "/dns/rr/sshfp.jpg",
    imageAlt: "Cat meme labelled SSHFP",
    rfcs: [
      { id: "RFC 4255", url: "https://www.rfc-editor.org/rfc/rfc4255" }
    ],
    fields: [
      {
        name: "ALGORITHM",
        type: "8-bit unsigned integer",
        description: "1 = RSA, 2 = DSA, 3 = ECDSA, 4 = Ed25519.",
        example: "4",
      },
      {
        name: "FP TYPE",
        type: "8-bit unsigned integer",
        description: "1 = SHA-1, 2 = SHA-256.",
        example: "2",
      },
      {
        name: "FINGERPRINT",
        type: "hex",
        description: "Fingerprint of the SSH host key.",
        example: "123456789abcdef67890123456789abcdef67890123456789abcdef123456789",
      }
    ],
    examples: [
      "example.com.  300  IN  SSHFP  4 2 123456789abcdef67890123456789abcdef67890123456789abcdef123456789",
      "example.com.  300  IN  SSHFP  1 1 123456789abcdef67890123456789abcdef67890",
      "host.example.  300  IN  SSHFP  3 2 aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899"
    ],
  },
  {
    slug: "ipseckey",
    type: "IPSECKEY",
    typeCode: 45,
    title: "IPSECKEY — IPsec Key",
    tagline: "IPsec public key and gateway.",
    synopsis: "Precedence, gateway type, algorithm, gateway, and public key.",
    image: "/dns/rr/ipseckey.jpg",
    imageAlt: "Cat meme labelled IPSECKEY",
    rfcs: [
      { id: "RFC 4025", url: "https://www.rfc-editor.org/rfc/rfc4025" }
    ],
    fields: [
      {
        name: "PRECEDENCE",
        type: "8-bit unsigned integer",
        description: "Lower preferred.",
        example: "10",
      },
      {
        name: "GATEWAY TYPE",
        type: "8-bit unsigned integer",
        description: "0 = none, 1 = IPv4, 2 = IPv6, 3 = domain name.",
        example: "3",
      },
      {
        name: "ALGORITHM",
        type: "8-bit unsigned integer",
        description: "1 = DSA, 2 = RSA.",
        example: "2",
      },
      {
        name: "GATEWAY",
        type: "address or domain-name",
        description: "Gateway address or name (.) if none.",
        example: "gw.example.com.",
      },
      {
        name: "PUBLIC KEY",
        type: "base64",
        description: "Public key.",
        example: "AQPSKmynfzW4kyBv015MUG2DeIQ3",
      }
    ],
    examples: [
      "example.com.  300  IN  IPSECKEY  10 3 2 gw.example.com. AQPSKmynfzW4kyBv015MUG2DeIQ3",
      "example.com.  300  IN  IPSECKEY  10 1 2 192.0.2.1 AQPSKmynfzW4kyBv015MUG2DeIQ3",
      "example.com.  300  IN  IPSECKEY  20 0 2 . AQPSKmynfzW4kyBv015MUG2DeIQ3"
    ],
  },
  {
    slug: "rrsig",
    type: "RRSIG",
    typeCode: 46,
    title: "RRSIG — RR Signature",
    tagline: "DNSSEC signature over an RRset.",
    synopsis: "Type covered, algorithm, labels, TTL, expiration, inception, key tag, signer, signature.",
    image: "/dns/rr/rrsig.jpg",
    imageAlt: "Cat meme labelled RRSIG",
    rfcs: [
      { id: "RFC 4034", url: "https://www.rfc-editor.org/rfc/rfc4034" }
    ],
    fields: [
      {
        name: "TYPE COVERED",
        type: "type mnemonic",
        description: "Type of the RRset covered.",
        example: "A",
      },
      {
        name: "ALGORITHM",
        type: "8-bit unsigned integer",
        description: "Cryptographic algorithm.",
        example: "8",
      },
      {
        name: "LABELS",
        type: "8-bit unsigned integer",
        description: "Number of labels in the RRSIG owner name (excluding root).",
        example: "2",
      },
      {
        name: "ORIGINAL TTL",
        type: "32-bit unsigned integer",
        description: "TTL of the covered RRset.",
        example: "300",
      },
      {
        name: "SIGNATURE EXPIRATION",
        type: "YYYYMMDDHHmmSS",
        description: "Signature expiration.",
        example: "20261201000000",
      },
      {
        name: "SIGNATURE INCEPTION",
        type: "YYYYMMDDHHmmSS",
        description: "Signature inception.",
        example: "20261001000000",
      },
      {
        name: "KEY TAG",
        type: "16-bit unsigned integer",
        description: "Key tag of the DNSKEY.",
        example: "12345",
      },
      {
        name: "SIGNER'S NAME",
        type: "domain-name",
        description: "Signing domain.",
        example: "example.com.",
      },
      {
        name: "SIGNATURE",
        type: "base64",
        description: "Signature material.",
        example: "YmxvYg==",
      }
    ],
    examples: [
      "example.com.  300  IN  RRSIG  A 8 2 300 20261201000000 20261001000000 12345 example.com. YmxvYg==",
      "example.com.  300  IN  RRSIG  MX 8 2 300 20261201000000 20261001000000 12345 example.com. YmxvYg==",
      "www.example.com.  60  IN  RRSIG  AAAA 13 3 60 20261201000000 20261001000000 54321 example.com. YmxvYg=="
    ],
  },
  {
    slug: "nsec",
    type: "NSEC",
    typeCode: 47,
    title: "NSEC — Next Secure",
    tagline: "Authenticated denial of existence (ordered).",
    synopsis: "Next domain name and type bit map.",
    image: "/dns/rr/nsec.jpg",
    imageAlt: "Cat meme labelled NSEC",
    rfcs: [
      { id: "RFC 4034", url: "https://www.rfc-editor.org/rfc/rfc4034" }
    ],
    fields: [
      {
        name: "NEXT DOMAIN NAME",
        type: "domain-name",
        description: "Next owner name in canonical order.",
        example: "www.example.com.",
      },
      {
        name: "TYPE BIT MAPS",
        type: "type list",
        description: "Types present at the owner.",
        example: "A NS SOA MX RRSIG NSEC DNSKEY",
      }
    ],
    examples: [
      "example.com.  300  IN  NSEC  www.example.com. A NS SOA MX RRSIG NSEC DNSKEY",
      "www.example.com.  300  IN  NSEC  example.com. A RRSIG NSEC",
      "mail.example.com.  300  IN  NSEC  www.example.com. A MX RRSIG NSEC"
    ],
  },
  {
    slug: "dnskey",
    type: "DNSKEY",
    typeCode: 48,
    title: "DNSKEY — DNS Key",
    tagline: "DNSSEC public key.",
    synopsis: "Flags, protocol (3), algorithm, and public key.",
    image: "/dns/rr/dnskey.jpg",
    imageAlt: "Cat meme labelled DNSKEY",
    rfcs: [
      { id: "RFC 4034", url: "https://www.rfc-editor.org/rfc/rfc4034" }
    ],
    fields: [
      {
        name: "FLAGS",
        type: "16-bit unsigned integer",
        description: "Zone Key (256) and/or Secure Entry Point (257).",
        example: "257",
      },
      {
        name: "PROTOCOL",
        type: "8-bit unsigned integer",
        description: "Must be 3.",
        example: "3",
      },
      {
        name: "ALGORITHM",
        type: "8-bit unsigned integer",
        description: "Public key algorithm.",
        example: "8",
      },
      {
        name: "PUBLIC KEY",
        type: "base64",
        description: "Public key material.",
        example: "AwEAAagAIKlN...",
      }
    ],
    examples: [
      "example.com.  300  IN  DNSKEY  257 3 8 AwEAAagAIKlN...",
      "example.com.  300  IN  DNSKEY  256 3 8 AwEAAcW2...",
      "example.com.  300  IN  DNSKEY  257 3 13 mdsswUyr3DPW1nWExjgNg..."
    ],
  },
  {
    slug: "dhcid",
    type: "DHCID",
    typeCode: 49,
    title: "DHCID — DHCP Identifier",
    tagline: "DHCP client identity for DNS updates.",
    synopsis: "Identifier type, digest type, and digest (base64).",
    image: "/dns/rr/dhcid.jpg",
    imageAlt: "Cat meme labelled DHCID",
    rfcs: [
      { id: "RFC 4701", url: "https://www.rfc-editor.org/rfc/rfc4701" }
    ],
    fields: [
      {
        name: "IDENTIFIER TYPE",
        type: "16-bit unsigned integer",
        description: "Type of client identifier hashed.",
        example: "0",
      },
      {
        name: "DIGEST TYPE",
        type: "8-bit unsigned integer",
        description: "Digest algorithm (1 = SHA-256).",
        example: "1",
      },
      {
        name: "DIGEST",
        type: "base64",
        description: "Digest of the identity.",
        example: "AAIBY2/AuCccgoJbsaxcQc9TUapptP69lOjxfNuVOvE=",
      }
    ],
    examples: [
      "host.example.com.  300  IN  DHCID  AAIBY2/AuCccgoJbsaxcQc9TUapptP69lOjxfNuVOvE=",
      "client.example.  300  IN  DHCID  AAEBOSD+5X2O3qY...",
      "pc.example.net.  300  IN  DHCID  AAIBAAAAAAAAAAAAAAAAAAAAAA=="
    ],
  },
  {
    slug: "nsec3",
    type: "NSEC3",
    typeCode: 50,
    title: "NSEC3 — Next Secure v3",
    tagline: "Hashed authenticated denial of existence.",
    synopsis: "Hash algorithm, flags, iterations, salt, next hashed owner, and type bit maps.",
    image: "/dns/rr/nsec3.jpg",
    imageAlt: "Cat meme labelled NSEC3",
    rfcs: [
      { id: "RFC 5155", url: "https://www.rfc-editor.org/rfc/rfc5155" }
    ],
    fields: [
      {
        name: "HASH ALGORITHM",
        type: "8-bit unsigned integer",
        description: "1 = SHA-1.",
        example: "1",
      },
      {
        name: "FLAGS",
        type: "8-bit unsigned integer",
        description: "Opt-Out flag etc.",
        example: "1",
      },
      {
        name: "ITERATIONS",
        type: "16-bit unsigned integer",
        description: "Hash iterations.",
        example: "12",
      },
      {
        name: "SALT",
        type: "hex or -",
        description: "Salt; - if empty.",
        example: "aabbccdd",
      },
      {
        name: "NEXT HASHED OWNER NAME",
        type: "base32hex",
        description: "Next hashed owner in hash order.",
        example: "2T7B4G4VSA5SMI47K61MV5BV1A53KTMR",
      },
      {
        name: "TYPE BIT MAPS",
        type: "type list",
        description: "Types present at the original owner.",
        example: "A RRSIG",
      }
    ],
    examples: [
      "0p9mhaveqvm6t7vbl5lop2u3t2rp3tom.example.  300  IN  NSEC3  1 1 12 aabbccdd 2T7B4G4VSA5SMI47K61MV5BV1A53KTMR A RRSIG",
      "2t7b4g4vsa5smi47k61mv5bv1a53ktmr.example.  300  IN  NSEC3  1 1 12 aabbccdd 2VPTU5TIMAMQ2P2U7LRLVVT8LQU9IKPL A RRSIG",
      "hash.example.  300  IN  NSEC3  1 0 0 - NEXTBASE32HEX A MX RRSIG"
    ],
  },
  {
    slug: "nsec3param",
    type: "NSEC3PARAM",
    typeCode: 51,
    title: "NSEC3PARAM — NSEC3 Parameters",
    tagline: "Parameters for NSEC3 hashes in a zone.",
    synopsis: "Hash algorithm, flags, iterations, and salt. Present at the zone apex.",
    image: "/dns/rr/nsec3param.jpg",
    imageAlt: "Cat meme labelled NSEC3PARAM",
    rfcs: [
      { id: "RFC 5155", url: "https://www.rfc-editor.org/rfc/rfc5155" }
    ],
    fields: [
      {
        name: "HASH ALGORITHM",
        type: "8-bit unsigned integer",
        description: "1 = SHA-1.",
        example: "1",
      },
      {
        name: "FLAGS",
        type: "8-bit unsigned integer",
        description: "Must be zero for publishers.",
        example: "0",
      },
      {
        name: "ITERATIONS",
        type: "16-bit unsigned integer",
        description: "Hash iterations.",
        example: "12",
      },
      {
        name: "SALT",
        type: "hex or -",
        description: "Salt; - if empty.",
        example: "aabbccdd",
      }
    ],
    examples: [
      "example.com.  300  IN  NSEC3PARAM  1 0 12 aabbccdd",
      "example.com.  300  IN  NSEC3PARAM  1 0 0 -",
      "example.org.  300  IN  NSEC3PARAM  1 0 100 deadbeef"
    ],
  },
  {
    slug: "tlsa",
    type: "TLSA",
    typeCode: 52,
    title: "TLSA — TLSA Certificate Association",
    tagline: "DANE binding of TLS certificate/key to a name.",
    synopsis: "Usage, selector, matching type, and certificate association data.",
    image: "/dns/rr/tlsa.jpg",
    imageAlt: "Cat meme labelled TLSA",
    rfcs: [
      { id: "RFC 6698", url: "https://www.rfc-editor.org/rfc/rfc6698" }
    ],
    fields: [
      {
        name: "CERTIFICATE USAGE",
        type: "8-bit unsigned integer",
        description: "0 PKIX-TA, 1 PKIX-EE, 2 DANE-TA, 3 DANE-EE.",
        example: "3",
      },
      {
        name: "SELECTOR",
        type: "8-bit unsigned integer",
        description: "0 = full cert, 1 = SubjectPublicKeyInfo.",
        example: "1",
      },
      {
        name: "MATCHING TYPE",
        type: "8-bit unsigned integer",
        description: "0 = exact, 1 = SHA-256, 2 = SHA-512.",
        example: "1",
      },
      {
        name: "CERTIFICATE ASSOCIATION DATA",
        type: "hex",
        description: "Association data.",
        example: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      }
    ],
    examples: [
      "_443._tcp.www.example.com.  300  IN  TLSA  3 1 1 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      "_443._tcp.example.com.  300  IN  TLSA  2 0 1 aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899",
      "_25._tcp.mail.example.com.  300  IN  TLSA  3 1 2 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    ],
  },
  {
    slug: "smimea",
    type: "SMIMEA",
    typeCode: 53,
    title: "SMIMEA — S/MIME Certificate Association",
    tagline: "DANE binding for S/MIME certificates.",
    synopsis: "Usage, selector, matching type, and association data. Owner is a hashed local-part under _smimecert.",
    image: "/dns/rr/smimea.jpg",
    imageAlt: "Cat meme labelled SMIMEA",
    rfcs: [
      { id: "RFC 8162", url: "https://www.rfc-editor.org/rfc/rfc8162" }
    ],
    fields: [
      {
        name: "CERTIFICATE USAGE",
        type: "8-bit unsigned integer",
        description: "Same meanings as TLSA.",
        example: "3",
      },
      {
        name: "SELECTOR",
        type: "8-bit unsigned integer",
        description: "0 = full cert, 1 = SPKI.",
        example: "1",
      },
      {
        name: "MATCHING TYPE",
        type: "8-bit unsigned integer",
        description: "0 = exact, 1 = SHA-256, 2 = SHA-512.",
        example: "1",
      },
      {
        name: "CERTIFICATE ASSOCIATION DATA",
        type: "hex",
        description: "Association data.",
        example: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      }
    ],
    examples: [
      "c93f1e400f26708f98cb19d936620da35eec8f72e57f9eec01c1afd6._smimecert.example.com.  300  IN  SMIMEA  3 1 1 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      "hash._smimecert.example.com.  300  IN  SMIMEA  2 0 1 aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899",
      "hash._smimecert.example.com.  300  IN  SMIMEA  3 1 2 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    ],
  },
  {
    slug: "hip",
    type: "HIP",
    typeCode: 55,
    title: "HIP — Host Identity Protocol",
    tagline: "Host identity tag and optional rendezvous servers.",
    synopsis: "HIT length, PK algorithm, PK length, HIT, public key, and optional RVS domain names.",
    image: "/dns/rr/hip.jpg",
    imageAlt: "Cat meme labelled HIP",
    rfcs: [
      { id: "RFC 8005", url: "https://www.rfc-editor.org/rfc/rfc8005" }
    ],
    fields: [
      {
        name: "HIT LENGTH",
        type: "8-bit unsigned integer",
        description: "Length of HIT in octets.",
        example: "16",
      },
      {
        name: "PK ALGORITHM",
        type: "8-bit unsigned integer",
        description: "Public key algorithm.",
        example: "2",
      },
      {
        name: "PK LENGTH",
        type: "16-bit unsigned integer",
        description: "Public key length.",
        example: "24",
      },
      {
        name: "HIT",
        type: "hex",
        description: "Host Identity Tag.",
        example: "200100107B1A74DF365639CC395F4CF1",
      },
      {
        name: "PUBLIC KEY",
        type: "base64",
        description: "Host public key.",
        example: "AwEAAdApj...",
      },
      {
        name: "RENDEZVOUS SERVERS",
        type: "domain-name*",
        description: "Optional RVS names.",
        example: "rvs1.example.com.",
      }
    ],
    examples: [
      "example.com.  300  IN  HIP  2 200100107B1A74DF365639CC395F4CF1 AwEAAdApj... rvs.example.com.",
      "host.example.  300  IN  HIP  2 200100107B1A74DF365639CC395F4CF1 AwEAAdApj...",
      "hip.example.  300  IN  HIP  2 200100107B1A74DF365639CC395F4CF1 AwEAAdApj... rvs1.example.com. rvs2.example.com."
    ],
  },
  {
    slug: "ninfo",
    type: "NINFO",
    typeCode: 56,
    title: "NINFO — Zone Status Info",
    tagline: "Zone status / contact information (unstandardized).",
    synopsis: "Character-strings similar to TXT. No standards-track RDATA; treat cautiously.",
    image: "/dns/rr/ninfo.jpg",
    imageAlt: "Cat meme labelled NINFO",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "ZS-DATA",
        type: "character-string+",
        description: "Status or contact text.",
        example: "\"status: active\"",
      }
    ],
    examples: [
      "example.com.  300  IN  NINFO  \"status: active\"",
      "example.com.  300  IN  NINFO  \"contact: ops@example.com\"",
      "example.com.  300  IN  TYPE56  \\# 0"
    ],
  },
  {
    slug: "rkey",
    type: "RKEY",
    typeCode: 57,
    title: "RKEY — Restricted KEY",
    tagline: "Restricted key (unstandardized).",
    synopsis: "Flags, protocol, algorithm, and public key (KEY-like). No standards-track definition.",
    image: "/dns/rr/rkey.jpg",
    imageAlt: "Cat meme labelled RKEY",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "FLAGS",
        type: "16-bit unsigned integer",
        description: "Key flags.",
        example: "0",
      },
      {
        name: "PROTOCOL",
        type: "8-bit unsigned integer",
        description: "Protocol.",
        example: "0",
      },
      {
        name: "ALGORITHM",
        type: "8-bit unsigned integer",
        description: "Algorithm.",
        example: "0",
      },
      {
        name: "PUBLIC KEY",
        type: "base64",
        description: "Key material.",
        example: "YmxvYg==",
      }
    ],
    examples: [
      "example.com.  300  IN  RKEY  0 0 0 YmxvYg==",
      "example.com.  300  IN  TYPE57  \\# 4 00000000",
      "key.example.  300  IN  RKEY  256 3 5 AQPSKmynfzW4kyBv"
    ],
  },
  {
    slug: "talink",
    type: "TALINK",
    typeCode: 58,
    title: "TALINK — Trust Anchor LINK",
    tagline: "Links related trust anchors (unstandardized).",
    synopsis: "Previous and next domain names forming a trust-anchor chain.",
    image: "/dns/rr/talink.jpg",
    imageAlt: "Cat meme labelled TALINK",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "PREVIOUS",
        type: "domain-name",
        description: "Previous name in the list.",
        example: "prev.example.com.",
      },
      {
        name: "NEXT",
        type: "domain-name",
        description: "Next name in the list.",
        example: "next.example.com.",
      }
    ],
    examples: [
      "example.com.  300  IN  TALINK  prev.example.com. next.example.com.",
      "anchor.example.  300  IN  TALINK  . next.example.",
      "end.example.  300  IN  TALINK  prev.example. ."
    ],
  },
  {
    slug: "cds",
    type: "CDS",
    typeCode: 59,
    title: "CDS — Child DS",
    tagline: "Child copy of DS for parental DS updates.",
    synopsis: "Same RDATA as DS. CDS with algorithm 0 signals DS removal.",
    image: "/dns/rr/cds.jpg",
    imageAlt: "Cat meme labelled CDS",
    rfcs: [
      { id: "RFC 7344", url: "https://www.rfc-editor.org/rfc/rfc7344" }
    ],
    fields: [
      {
        name: "KEY TAG",
        type: "16-bit unsigned integer",
        description: "Key tag of the DNSKEY.",
        example: "60485",
      },
      {
        name: "ALGORITHM",
        type: "8-bit unsigned integer",
        description: "DNSKEY algorithm (0 = delete).",
        example: "5",
      },
      {
        name: "DIGEST TYPE",
        type: "8-bit unsigned integer",
        description: "Digest algorithm.",
        example: "1",
      },
      {
        name: "DIGEST",
        type: "hex",
        description: "Digest of the DNSKEY.",
        example: "2BB183AF5F22588179A53B0A98631FAD1A292118",
      }
    ],
    examples: [
      "example.com.  300  IN  CDS  60485 5 1 2BB183AF5F22588179A53B0A98631FAD1A292118",
      "example.com.  300  IN  CDS  60485 8 2 E2D3C23E5C9B6A1F4A0B8C7D6E5F4A3B2C1D0E9F8A7B6C5D4E3F2A1B0C9D8E7F",
      "example.com.  300  IN  CDS  0 0 0 00"
    ],
  },
  {
    slug: "cdnskey",
    type: "CDNSKEY",
    typeCode: 60,
    title: "CDNSKEY — Child DNSKEY",
    tagline: "Child copy of DNSKEY for parental DS updates.",
    synopsis: "Same RDATA as DNSKEY. Algorithm 0 signals deletion intent with CDS.",
    image: "/dns/rr/cdnskey.jpg",
    imageAlt: "Cat meme labelled CDNSKEY",
    rfcs: [
      { id: "RFC 7344", url: "https://www.rfc-editor.org/rfc/rfc7344" }
    ],
    fields: [
      {
        name: "FLAGS",
        type: "16-bit unsigned integer",
        description: "Key flags.",
        example: "257",
      },
      {
        name: "PROTOCOL",
        type: "8-bit unsigned integer",
        description: "Must be 3.",
        example: "3",
      },
      {
        name: "ALGORITHM",
        type: "8-bit unsigned integer",
        description: "Public key algorithm.",
        example: "8",
      },
      {
        name: "PUBLIC KEY",
        type: "base64",
        description: "Public key material.",
        example: "AwEAAagAIKlN...",
      }
    ],
    examples: [
      "example.com.  300  IN  CDNSKEY  257 3 8 AwEAAagAIKlN...",
      "example.com.  300  IN  CDNSKEY  256 3 8 AwEAAcW2...",
      "example.com.  300  IN  CDNSKEY  0 3 0 AA=="
    ],
  },
  {
    slug: "openpgpkey",
    type: "OPENPGPKEY",
    typeCode: 61,
    title: "OPENPGPKEY — OpenPGP Key",
    tagline: "OpenPGP public key material.",
    synopsis: "Base64 OpenPGP transferable public key. Owner is a hashed local-part under _openpgpkey.",
    image: "/dns/rr/openpgpkey.jpg",
    imageAlt: "Cat meme labelled OPENPGPKEY",
    rfcs: [
      { id: "RFC 7929", url: "https://www.rfc-editor.org/rfc/rfc7929" }
    ],
    fields: [
      {
        name: "PUBLIC KEY",
        type: "base64",
        description: "OpenPGP key ring material.",
        example: "mQENBFj...",
      }
    ],
    examples: [
      "1ea51ce32c0e3c2f8d9b5a6c7e4f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f._openpgpkey.example.com.  300  IN  OPENPGPKEY  mQENBFj...",
      "hash._openpgpkey.example.com.  300  IN  OPENPGPKEY  mQGiBFj...",
      "hash._openpgpkey.example.net.  300  IN  OPENPGPKEY  xsBNBFj..."
    ],
  },
  {
    slug: "csync",
    type: "CSYNC",
    typeCode: 62,
    title: "CSYNC — Child-to-Parent Synchronization",
    tagline: "Signals which RRsets the parent should copy from the child.",
    synopsis: "SOA serial, flags, and type bit map.",
    image: "/dns/rr/csync.jpg",
    imageAlt: "Cat meme labelled CSYNC",
    rfcs: [
      { id: "RFC 7477", url: "https://www.rfc-editor.org/rfc/rfc7477" }
    ],
    fields: [
      {
        name: "SOA SERIAL",
        type: "32-bit unsigned integer",
        description: "Child SOA serial binding this CSYNC.",
        example: "2026101201",
      },
      {
        name: "FLAGS",
        type: "16-bit unsigned integer",
        description: "Bit 0 immediate; bit 1 soaminimum.",
        example: "3",
      },
      {
        name: "TYPE BIT MAP",
        type: "type list",
        description: "Types the parent should synchronize (e.g. A AAAA NS DS).",
        example: "A AAAA NS",
      }
    ],
    examples: [
      "example.com.  300  IN  CSYNC  2026101201 3 A NS",
      "example.com.  300  IN  CSYNC  2026101201 1 A AAAA NS",
      "child.example.  300  IN  CSYNC  1 0 NS"
    ],
  },
  {
    slug: "zonemd",
    type: "ZONEMD",
    typeCode: 63,
    title: "ZONEMD — Zone Message Digest",
    tagline: "Cryptographic message digest of zone contents.",
    synopsis: "Serial, scheme, hash algorithm, and digest.",
    image: "/dns/rr/zonemd.jpg",
    imageAlt: "Cat meme labelled ZONEMD",
    rfcs: [
      { id: "RFC 8976", url: "https://www.rfc-editor.org/rfc/rfc8976" }
    ],
    fields: [
      {
        name: "SERIAL",
        type: "32-bit unsigned integer",
        description: "SOA serial covered by this digest.",
        example: "2026101201",
      },
      {
        name: "SCHEME",
        type: "8-bit unsigned integer",
        description: "1 = SIMPLE.",
        example: "1",
      },
      {
        name: "HASH ALGORITHM",
        type: "8-bit unsigned integer",
        description: "1 = SHA-384, 2 = SHA-512.",
        example: "1",
      },
      {
        name: "DIGEST",
        type: "hex",
        description: "Zone digest.",
        example: "0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF",
      }
    ],
    examples: [
      "example.com.  300  IN  ZONEMD  2026101201 1 1 0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF",
      "example.com.  300  IN  ZONEMD  2026101201 1 2 0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF",
      "example.org.  300  IN  ZONEMD  1 1 1 DEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF"
    ],
  },
  {
    slug: "svcb",
    type: "SVCB",
    typeCode: 64,
    title: "SVCB — Service Binding",
    tagline: "Generic service binding.",
    synopsis: "Priority, target name, and optional service parameters. Priority 0 is AliasMode; non-zero is ServiceMode.",
    image: "/dns/rr/svcb.jpg",
    imageAlt: "Cat meme labelled SVCB",
    rfcs: [
      { id: "RFC 9460", url: "https://www.rfc-editor.org/rfc/rfc9460" }
    ],
    fields: [
      {
        name: "PRIORITY",
        type: "16-bit unsigned integer",
        description: "0 = AliasMode. Non-zero = ServiceMode; lower preferred.",
        example: "1",
      },
      {
        name: "TARGETNAME",
        type: "domain-name",
        description: "Service target. \".\" means the owner name.",
        example: "svc.example.net.",
      },
      {
        name: "PARAMS",
        type: "SvcParam list",
        description: "Optional service parameters, ordered by key id.",
        children: [
          {
            name: "alpn",
            type: "SvcParam (key 1)",
            description: "Supported application protocols.",
            example: "alpn=\"h2,h3\"",
          },
          {
            name: "no-default-alpn",
            type: "SvcParam (key 2)",
            description: "No default ALPN; alpn must be present.",
            example: "no-default-alpn",
          },
          {
            name: "port",
            type: "SvcParam (key 3)",
            description: "Alternate port when not the protocol default.",
            example: "port=8443",
          },
          {
            name: "ipv4hint",
            type: "SvcParam (key 4)",
            description: "IPv4 address hint. Not authoritative.",
            example: "ipv4hint=192.0.2.1",
          },
          {
            name: "ech",
            type: "SvcParam (key 5)",
            description: "Encrypted ClientHello configuration.",
            example: "ech=...",
          },
          {
            name: "ipv6hint",
            type: "SvcParam (key 6)",
            description: "IPv6 address hint. Not authoritative.",
            example: "ipv6hint=2001:db8::1",
          },
          {
            name: "mandatory",
            type: "SvcParam (key 0)",
            description: "Keys that must be understood.",
            example: "mandatory=alpn,port",
          }
        ],
      }
    ],
    examples: [
      "example.com.  300  IN  SVCB  1 svc.example.net. alpn=\"h2,h3\" port=8443",
      "example.com.  300  IN  SVCB  0 svc.example.net.",
      "_8443._foo.api.example.com.  300  IN  SVCB  1 . alpn=\"foo\" ipv4hint=192.0.2.1"
    ],
  },
  {
    slug: "https",
    type: "HTTPS",
    typeCode: 65,
    title: "HTTPS — HTTPS Service Binding",
    tagline: "HTTPS service binding (SVCB for HTTPS).",
    synopsis: "Priority, target name, and optional service parameters. Priority 0 is AliasMode; non-zero is ServiceMode.",
    image: "/dns/rr/https.jpg",
    imageAlt: "Cat tangled in cables and padlocks, labelled HTTPS",
    rfcs: [
      { id: "RFC 9460", url: "https://www.rfc-editor.org/rfc/rfc9460" },
      { id: "RFC 9461", url: "https://www.rfc-editor.org/rfc/rfc9461" }
    ],
    fields: [
      {
        name: "PRIORITY",
        type: "16-bit unsigned integer",
        description: "0 = AliasMode (alias to TargetName, no params). Non-zero = ServiceMode; lower preferred.",
        example: "1",
      },
      {
        name: "TARGETNAME",
        type: "domain-name",
        description: "Service target. \".\" means the owner name.",
        example: ".",
      },
      {
        name: "PARAMS",
        type: "SvcParam list",
        description: "Optional service parameters, ordered by key id.",
        children: [
          {
            name: "alpn",
            type: "SvcParam (key 1)",
            description: "Supported application protocols.",
            example: "alpn=\"h3,h2\"",
          },
          {
            name: "port",
            type: "SvcParam (key 3)",
            description: "Alternate port when not the protocol default.",
            example: "port=8443",
          },
          {
            name: "ipv4hint",
            type: "SvcParam (key 4)",
            description: "IPv4 address hint. Not authoritative.",
            example: "ipv4hint=192.0.2.1",
          },
          {
            name: "ech",
            type: "SvcParam (key 5)",
            description: "Encrypted ClientHello configuration.",
            example: "ech=...",
          },
          {
            name: "ipv6hint",
            type: "SvcParam (key 6)",
            description: "IPv6 address hint. Not authoritative.",
            example: "ipv6hint=2001:db8::1",
          }
        ],
      }
    ],
    examples: [
      "example.com.  300  IN  HTTPS  1 . alpn=\"h3,h2\" ipv4hint=192.0.2.1",
      "example.com.  300  IN  HTTPS  1 . alpn=\"h2\" port=8443",
      "example.com.  300  IN  HTTPS  0 svc.example.net."
    ],
  },
  {
    slug: "dsync",
    type: "DSYNC",
    typeCode: 66,
    title: "DSYNC — Delegation Sync Endpoint",
    tagline: "Endpoint for generalized DNS notifications.",
    synopsis: "RRtype, scheme, port, and target host for notifications (e.g. CDS/CSYNC).",
    image: "/dns/rr/dsync.jpg",
    imageAlt: "Cat meme labelled DSYNC",
    rfcs: [
      { id: "RFC 9859", url: "https://www.rfc-editor.org/rfc/rfc9859" }
    ],
    fields: [
      {
        name: "RRTYPE",
        type: "type mnemonic",
        description: "NOTIFY type this endpoint accepts (CDS or CSYNC today).",
        example: "CDS",
      },
      {
        name: "SCHEME",
        type: "mnemonic / 8-bit unsigned integer",
        description: "Contact scheme; 1 = NOTIFY.",
        example: "NOTIFY",
      },
      {
        name: "PORT",
        type: "16-bit unsigned integer",
        description: "Notification service port.",
        example: "5359",
      },
      {
        name: "TARGET",
        type: "domain-name",
        description: "Host providing the notification listener.",
        example: "cds-scanner.example.net.",
      }
    ],
    examples: [
      "_dsync.example.com.  300  IN  DSYNC  CDS NOTIFY 5359 cds-scanner.example.net.",
      "_dsync.example.com.  300  IN  DSYNC  CSYNC NOTIFY 5360 csync-scanner.example.net.",
      "example.com.  300  IN  DSYNC  CDS NOTIFY 53 notify.example.net."
    ],
  },
  {
    slug: "hhit",
    type: "HHIT",
    typeCode: 67,
    title: "HHIT — Hierarchical Host Identity Tag",
    tagline: "HHIT registration metadata (CBOR).",
    synopsis: "Base64 of CBOR: entity type, HID abbreviation, and registration certificate.",
    image: "/dns/rr/hhit.jpg",
    imageAlt: "Cat meme labelled HHIT",
    rfcs: [
      { id: "RFC 9886", url: "https://www.rfc-editor.org/rfc/rfc9886" }
    ],
    fields: [
      {
        name: "HHIT-DATA",
        type: "base64 (CBOR)",
        description: "CBOR array [entity-type, hid-abbreviation, canonical-registration-cert].",
        example: "gQAB...",
      }
    ],
    examples: [
      "example.com.  300  IN  HHIT  gQEAbXllc2FiYnJldgQA",
      "host.example.  300  IN  HHIT  oQAB...",
      "hhit.example.  300  IN  TYPE67  \\# 8 83001818656578616D"
    ],
  },
  {
    slug: "brid",
    type: "BRID",
    typeCode: 68,
    title: "BRID — UAS Broadcast Remote ID",
    tagline: "Static UAS Broadcast RID information (CBOR).",
    synopsis: "Base64 of CBOR map holding ASTM F3411 Broadcast RID static fields.",
    image: "/dns/rr/brid.jpg",
    imageAlt: "Cat meme labelled BRID",
    rfcs: [
      { id: "RFC 9886", url: "https://www.rfc-editor.org/rfc/rfc9886" }
    ],
    fields: [
      {
        name: "BRID-DATA",
        type: "base64 (CBOR)",
        description: "CBOR map of UAS type, IDs, and optional auth/area/operator fields.",
        example: "oQAB...",
      }
    ],
    examples: [
      "uas.example.com.  300  IN  BRID  oQAB...",
      "drone.example.  300  IN  BRID  gQAB...",
      "rid.example.  300  IN  TYPE68  \\# 4 A1010001"
    ],
  },
  {
    slug: "unece",
    type: "UNECE",
    typeCode: 69,
    title: "UNECE — UNECE Coded Value",
    tagline: "Value coded per a UNECE Recommendation.",
    synopsis: "Recommendation identifier and coded value octets. Semantics remain with UNECE registries.",
    image: "/dns/rr/unece.jpg",
    imageAlt: "Cat meme labelled UNECE",
    rfcs: [
      { id: "draft-woodcock-faltstrom-external-registry-rrtypes", url: "https://datatracker.ietf.org/doc/draft-woodcock-faltstrom-external-registry-rrtypes/" }
    ],
    fields: [
      {
        name: "RECOMMENDATION",
        type: "16-bit unsigned integer",
        description: "UNECE Recommendation number (e.g. 16, 20).",
        example: "20",
      },
      {
        name: "CODE",
        type: "octet string / text",
        description: "Code from that recommendation, carried verbatim.",
        example: "KGM",
      }
    ],
    examples: [
      "example.com.  300  IN  UNECE  20 KGM",
      "loc.example.  300  IN  UNECE  16 GB LON",
      "example.com.  300  IN  TYPE69  \\# 5 00144B474D"
    ],
  },
  {
    slug: "iso",
    type: "ISO",
    typeCode: 70,
    title: "ISO — ISO Coded Value",
    tagline: "Value coded per an ISO standard.",
    synopsis: "ISO standard identifier and coded value octets. Semantics remain with the ISO standard.",
    image: "/dns/rr/iso.jpg",
    imageAlt: "Cat meme labelled ISO",
    rfcs: [
      { id: "draft-woodcock-faltstrom-external-registry-rrtypes", url: "https://datatracker.ietf.org/doc/draft-woodcock-faltstrom-external-registry-rrtypes/" }
    ],
    fields: [
      {
        name: "STANDARD",
        type: "16-bit / text",
        description: "ISO standard designation.",
        example: "3166",
      },
      {
        name: "CODE",
        type: "octet string / text",
        description: "Code from that standard.",
        example: "GB",
      }
    ],
    examples: [
      "example.com.  300  IN  ISO  3166 GB",
      "example.com.  300  IN  ISO  4217 GBP",
      "example.com.  300  IN  TYPE70  \\# 4 0C5E4742"
    ],
  },
  {
    slug: "spf",
    type: "SPF",
    typeCode: 99,
    title: "SPF — Sender Policy Framework",
    tagline: "Obsolete SPF RR. Use TXT.",
    synopsis: "Same presentation as TXT. Publish SPF policy in TXT instead.",
    image: "/dns/rr/spf.jpg",
    imageAlt: "Cat meme labelled SPF",
    rfcs: [
      { id: "RFC 7208", url: "https://www.rfc-editor.org/rfc/rfc7208" }
    ],
    fields: [
      {
        name: "TXT-DATA",
        type: "character-string+",
        description: "SPF policy text.",
        example: "\"v=spf1 -all\"",
      }
    ],
    examples: [
      "example.com.  300  IN  SPF  \"v=spf1 -all\"",
      "example.com.  300  IN  SPF  \"v=spf1 include:_spf.example.com -all\"",
      "example.net.  300  IN  SPF  \"v=spf1 mx -all\""
    ],
    warning: { level: "obsolete", message: "Obsolete. Publish SPF in TXT instead." },
  },
  {
    slug: "uinfo",
    type: "UINFO",
    typeCode: 100,
    title: "UINFO — User Information",
    tagline: "Reserved IANA type.",
    synopsis: "No published RDATA format. Historically reserved; treat as unknown-type.",
    image: "/dns/rr/uinfo.jpg",
    imageAlt: "Cat meme labelled UINFO",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "DATA",
        type: "octet string",
        description: "Unspecified. Use RFC 3597 unknown-type presentation.",
        example: "\\# 0",
      }
    ],
    examples: [
      "example.com.  300  IN  UINFO  \\# 0",
      "example.com.  300  IN  TYPE100  \\# 4 DEADBEEF",
      "user.example.  300  IN  UINFO  \\# 8 0011223344556677"
    ],
  },
  {
    slug: "uid",
    type: "UID",
    typeCode: 101,
    title: "UID — User ID",
    tagline: "Reserved IANA type.",
    synopsis: "No published RDATA format. Historically reserved; treat as unknown-type.",
    image: "/dns/rr/uid.jpg",
    imageAlt: "Cat meme labelled UID",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "DATA",
        type: "octet string",
        description: "Unspecified. Use RFC 3597 unknown-type presentation.",
        example: "\\# 4 00000001",
      }
    ],
    examples: [
      "example.com.  300  IN  UID  \\# 4 00000001",
      "example.com.  300  IN  TYPE101  \\# 4 0000270F",
      "id.example.  300  IN  UID  \\# 0"
    ],
  },
  {
    slug: "gid",
    type: "GID",
    typeCode: 102,
    title: "GID — Group ID",
    tagline: "Reserved IANA type.",
    synopsis: "No published RDATA format. Historically reserved; treat as unknown-type.",
    image: "/dns/rr/gid.jpg",
    imageAlt: "Cat meme labelled GID",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "DATA",
        type: "octet string",
        description: "Unspecified. Use RFC 3597 unknown-type presentation.",
        example: "\\# 4 00000064",
      }
    ],
    examples: [
      "example.com.  300  IN  GID  \\# 4 00000064",
      "example.com.  300  IN  TYPE102  \\# 4 000003E8",
      "grp.example.  300  IN  GID  \\# 0"
    ],
  },
  {
    slug: "unspec",
    type: "UNSPEC",
    typeCode: 103,
    title: "UNSPEC — Unspecified",
    tagline: "Reserved IANA type.",
    synopsis: "No published RDATA format. Historically reserved; treat as unknown-type.",
    image: "/dns/rr/unspec.jpg",
    imageAlt: "Cat meme labelled UNSPEC",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "DATA",
        type: "octet string",
        description: "Unspecified. Use RFC 3597 unknown-type presentation.",
        example: "\\# 0",
      }
    ],
    examples: [
      "example.com.  300  IN  UNSPEC  \\# 0",
      "example.com.  300  IN  TYPE103  \\# 4 CAFEBABE",
      "x.example.  300  IN  UNSPEC  \\# 8 0123456789ABCDEF"
    ],
  },
  {
    slug: "nid",
    type: "NID",
    typeCode: 104,
    title: "NID — Node Identifier",
    tagline: "ILNP node identifier.",
    synopsis: "Preference and 64-bit node identifier.",
    image: "/dns/rr/nid.jpg",
    imageAlt: "Cat meme labelled NID",
    rfcs: [
      { id: "RFC 6742", url: "https://www.rfc-editor.org/rfc/rfc6742" }
    ],
    fields: [
      {
        name: "PREFERENCE",
        type: "16-bit unsigned integer",
        description: "Lower preferred.",
        example: "10",
      },
      {
        name: "NODE ID",
        type: "64-bit hex",
        description: "Node identifier (groups of 4 hex digits).",
        example: "0001:0002:0003:0004",
      }
    ],
    examples: [
      "example.com.  300  IN  NID  10 0001:0002:0003:0004",
      "example.com.  300  IN  NID  20 0014:4fff:ff20:ee64",
      "host.example.  300  IN  NID  5 0000:0000:0000:0001"
    ],
  },
  {
    slug: "l32",
    type: "L32",
    typeCode: 105,
    title: "L32 — Locator 32",
    tagline: "ILNP 32-bit locator.",
    synopsis: "Preference and 32-bit locator (IPv4-like presentation).",
    image: "/dns/rr/l32.jpg",
    imageAlt: "Cat meme labelled L32",
    rfcs: [
      { id: "RFC 6742", url: "https://www.rfc-editor.org/rfc/rfc6742" }
    ],
    fields: [
      {
        name: "PREFERENCE",
        type: "16-bit unsigned integer",
        description: "Lower preferred.",
        example: "10",
      },
      {
        name: "LOCATOR32",
        type: "32-bit",
        description: "Locator presented like an IPv4 address.",
        example: "192.0.2.1",
      }
    ],
    examples: [
      "example.com.  300  IN  L32  10 192.0.2.1",
      "example.com.  300  IN  L32  20 198.51.100.2",
      "host.example.  300  IN  L32  5 203.0.113.10"
    ],
  },
  {
    slug: "l64",
    type: "L64",
    typeCode: 106,
    title: "L64 — Locator 64",
    tagline: "ILNP 64-bit locator.",
    synopsis: "Preference and 64-bit locator.",
    image: "/dns/rr/l64.jpg",
    imageAlt: "Cat meme labelled L64",
    rfcs: [
      { id: "RFC 6742", url: "https://www.rfc-editor.org/rfc/rfc6742" }
    ],
    fields: [
      {
        name: "PREFERENCE",
        type: "16-bit unsigned integer",
        description: "Lower preferred.",
        example: "10",
      },
      {
        name: "LOCATOR64",
        type: "64-bit hex",
        description: "Locator (groups of 4 hex digits).",
        example: "2001:0db8:0123:4567",
      }
    ],
    examples: [
      "example.com.  300  IN  L64  10 2001:0db8:0123:4567",
      "example.com.  300  IN  L64  20 2001:0db8:ffff:0001",
      "host.example.  300  IN  L64  5 0000:0000:0000:0001"
    ],
  },
  {
    slug: "lp",
    type: "LP",
    typeCode: 107,
    title: "LP — Locator Pointer",
    tagline: "ILNP pointer to a locator name.",
    synopsis: "Preference and FQDN of a name that has Locator records.",
    image: "/dns/rr/lp.jpg",
    imageAlt: "Cat meme labelled LP",
    rfcs: [
      { id: "RFC 6742", url: "https://www.rfc-editor.org/rfc/rfc6742" }
    ],
    fields: [
      {
        name: "PREFERENCE",
        type: "16-bit unsigned integer",
        description: "Lower preferred.",
        example: "10",
      },
      {
        name: "FQDN",
        type: "domain-name",
        description: "Name that owns Locator (L32/L64) records.",
        example: "loc.example.com.",
      }
    ],
    examples: [
      "example.com.  300  IN  LP  10 loc.example.com.",
      "example.com.  300  IN  LP  20 loc2.example.com.",
      "host.example.  300  IN  LP  5 locator.example.net."
    ],
  },
  {
    slug: "eui48",
    type: "EUI48",
    typeCode: 108,
    title: "EUI48 — EUI-48 Address",
    tagline: "48-bit MAC / EUI-48.",
    synopsis: "Six hex octets separated by hyphens.",
    image: "/dns/rr/eui48.jpg",
    imageAlt: "Cat meme labelled EUI48",
    rfcs: [
      { id: "RFC 7043", url: "https://www.rfc-editor.org/rfc/rfc7043" }
    ],
    fields: [
      {
        name: "EUI48",
        type: "48-bit hex",
        description: "EUI-48 address.",
        example: "00-00-5e-00-53-2a",
      }
    ],
    examples: [
      "example.com.  300  IN  EUI48  00-00-5e-00-53-2a",
      "host.example.  300  IN  EUI48  02-00-5e-10-00-00",
      "nic.example.  300  IN  EUI48  aa-bb-cc-dd-ee-ff"
    ],
  },
  {
    slug: "eui64",
    type: "EUI64",
    typeCode: 109,
    title: "EUI64 — EUI-64 Address",
    tagline: "64-bit EUI-64.",
    synopsis: "Eight hex octets separated by hyphens.",
    image: "/dns/rr/eui64.jpg",
    imageAlt: "Cat meme labelled EUI64",
    rfcs: [
      { id: "RFC 7043", url: "https://www.rfc-editor.org/rfc/rfc7043" }
    ],
    fields: [
      {
        name: "EUI64",
        type: "64-bit hex",
        description: "EUI-64 address.",
        example: "00-00-5e-ef-10-00-00-2a",
      }
    ],
    examples: [
      "example.com.  300  IN  EUI64  00-00-5e-ef-10-00-00-2a",
      "host.example.  300  IN  EUI64  02-00-5e-ff-fe-10-00-00",
      "nic.example.  300  IN  EUI64  aa-bb-cc-dd-ee-ff-00-11"
    ],
  },
  {
    slug: "nxname",
    type: "NXNAME",
    typeCode: 128,
    title: "NXNAME — Compact Denial NXDOMAIN",
    tagline: "NXDOMAIN indicator for Compact Denial of Existence.",
    synopsis: "Empty RDATA. Used with NSEC/NSEC3 bitmaps under Compact Denial of Existence.",
    image: "/dns/rr/nxname.jpg",
    imageAlt: "Cat meme labelled NXNAME",
    rfcs: [
      { id: "RFC 9824", url: "https://www.rfc-editor.org/rfc/rfc9824" }
    ],
    fields: [
      {
        name: "RDATA",
        type: "empty",
        description: "No RDATA fields.",
        example: "(empty)",
      }
    ],
    examples: [
      "example.com.  300  IN  NXNAME",
      "nx.example.  300  IN  TYPE128  \\# 0",
      "missing.example.  0  IN  NXNAME"
    ],
  },
  {
    slug: "tkey",
    type: "TKEY",
    typeCode: 249,
    title: "TKEY — Transaction Key",
    tagline: "Key exchange meta-RR.",
    synopsis: "Algorithm, times, mode, error, key, and other data. Transactional; not stored in zones.",
    image: "/dns/rr/tkey.jpg",
    imageAlt: "Cat meme labelled TKEY",
    rfcs: [
      { id: "RFC 2930", url: "https://www.rfc-editor.org/rfc/rfc2930" }
    ],
    fields: [
      {
        name: "ALGORITHM",
        type: "domain-name",
        description: "Algorithm name.",
        example: "gss-tsig.",
      },
      {
        name: "INCEPTION",
        type: "32-bit unsigned integer",
        description: "Inception time (UNIX).",
        example: "1609459200",
      },
      {
        name: "EXPIRATION",
        type: "32-bit unsigned integer",
        description: "Expiration time (UNIX).",
        example: "1609545600",
      },
      {
        name: "MODE",
        type: "16-bit unsigned integer",
        description: "Key agreement mode.",
        example: "3",
      },
      {
        name: "ERROR",
        type: "16-bit unsigned integer",
        description: "Error code.",
        example: "0",
      },
      {
        name: "KEY DATA",
        type: "octet string",
        description: "Key material.",
        example: "(binary)",
      },
      {
        name: "OTHER DATA",
        type: "octet string",
        description: "Additional data.",
        example: "(empty)",
      }
    ],
    examples: [
      "; TKEY is transactional — shown schematically",
      "example.com.  0  ANY  TKEY  gss-tsig. 1609459200 1609545600 3 0 ...",
      "host.example.  0  ANY  TKEY  hmac-sha256. 1609459200 1609545600 2 0 ..."
    ],
    warning: { level: "meta", message: "Meta-RR for key exchange. Transactional; not stored in zones." },
  },
  {
    slug: "tsig",
    type: "TSIG",
    typeCode: 250,
    title: "TSIG — Transaction Signature",
    tagline: "Transaction signature meta-RR.",
    synopsis: "Algorithm, time signed, fudge, MAC, original ID, error, other data. Not stored in zones.",
    image: "/dns/rr/tsig.jpg",
    imageAlt: "Cat meme labelled TSIG",
    rfcs: [
      { id: "RFC 8945", url: "https://www.rfc-editor.org/rfc/rfc8945" }
    ],
    fields: [
      {
        name: "ALGORITHM NAME",
        type: "domain-name",
        description: "MAC algorithm.",
        example: "hmac-sha256.",
      },
      {
        name: "TIME SIGNED",
        type: "48-bit unsigned integer",
        description: "Time signature was created.",
        example: "1609459200",
      },
      {
        name: "FUDGE",
        type: "16-bit unsigned integer",
        description: "Allowed time error in seconds.",
        example: "300",
      },
      {
        name: "MAC SIZE / MAC",
        type: "octets",
        description: "Message authentication code.",
        example: "(binary)",
      },
      {
        name: "ORIGINAL ID",
        type: "16-bit unsigned integer",
        description: "Original message ID.",
        example: "12345",
      },
      {
        name: "ERROR",
        type: "16-bit unsigned integer",
        description: "Extended error.",
        example: "0",
      },
      {
        name: "OTHER DATA",
        type: "octet string",
        description: "Additional data.",
        example: "(empty)",
      }
    ],
    examples: [
      "; TSIG is transactional — shown schematically",
      "example.com.  0  ANY  TSIG  hmac-sha256. 1609459200 300 ...",
      "host.example.  0  ANY  TSIG  hmac-sha512. 1609459200 300 ..."
    ],
    warning: { level: "meta", message: "Meta-RR for transaction signatures. Not stored in zones." },
  },
  {
    slug: "ixfr",
    type: "IXFR",
    typeCode: 251,
    title: "IXFR — Incremental Zone Transfer",
    tagline: "Meta QTYPE for incremental transfer.",
    synopsis: "Not a zone RR. Query type requesting incremental zone changes since a given SOA.",
    image: "/dns/rr/ixfr.jpg",
    imageAlt: "Cat meme labelled IXFR",
    rfcs: [
      { id: "RFC 1995", url: "https://www.rfc-editor.org/rfc/rfc1995" }
    ],
    fields: [
      {
        name: "SOA",
        type: "SOA RDATA in authority",
        description: "Request carries an SOA; response is incremental changes or full AXFR fallback.",
        example: "(SOA)",
      }
    ],
    examples: [
      "; IXFR is a QTYPE — not stored in zone files",
      "; query: example.com IXFR with SOA serial 2026101200",
      "; response: incremental RRset changes or full zone"
    ],
    warning: { level: "meta", message: "Meta QTYPE for incremental zone transfer. Not a zone RR." },
  },
  {
    slug: "axfr",
    type: "AXFR",
    typeCode: 252,
    title: "AXFR — Zone Transfer",
    tagline: "Meta QTYPE for full zone transfer.",
    synopsis: "Not a zone RR. Query type requesting the entire zone.",
    image: "/dns/rr/axfr.jpg",
    imageAlt: "Cat meme labelled AXFR",
    rfcs: [
      { id: "RFC 5936", url: "https://www.rfc-editor.org/rfc/rfc5936" }
    ],
    fields: [
      {
        name: "(none)",
        type: "n/a",
        description: "AXFR has no RDATA; it is a query type.",
        example: "n/a",
      }
    ],
    examples: [
      "; AXFR is a QTYPE — not stored in zone files",
      "; query: example.com AXFR",
      "; response: full zone as a stream of RRs"
    ],
    warning: { level: "meta", message: "Meta QTYPE for full zone transfer. Not a zone RR." },
  },
  {
    slug: "mailb",
    type: "MAILB",
    typeCode: 253,
    title: "MAILB — Mailbox-related RRs",
    tagline: "Meta QTYPE matching mailbox-related records.",
    synopsis: "Not a zone RR. Request that matches MB/MG/MR (mailbox) related types.",
    image: "/dns/rr/mailb.jpg",
    imageAlt: "Cat meme labelled MAILB",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "(none)",
        type: "n/a",
        description: "MAILB has no RDATA; it is a query type.",
        example: "n/a",
      }
    ],
    examples: [
      "; MAILB is a QTYPE — not stored in zone files",
      "; query: user.example.com MAILB",
      "; matches mailbox-related RR types at the name"
    ],
    warning: { level: "meta", message: "Meta QTYPE matching mailbox-related records. Not a zone RR." },
  },
  {
    slug: "maila",
    type: "MAILA",
    typeCode: 254,
    title: "MAILA — Mail Agent RRs",
    tagline: "Obsolete meta QTYPE for mail agents.",
    synopsis: "Not a zone RR. Obsolete request that matched MD/MF; use MX.",
    image: "/dns/rr/maila.jpg",
    imageAlt: "Cat meme labelled MAILA",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "(none)",
        type: "n/a",
        description: "MAILA has no RDATA; it is a query type.",
        example: "n/a",
      }
    ],
    examples: [
      "; MAILA is a QTYPE — not stored in zone files",
      "; query: example.com MAILA",
      "; obsolete; use MX queries instead"
    ],
    warning: { level: "obsolete", message: "Obsolete mail agent QTYPE. Use MX." },
  },
  {
    slug: "any",
    type: "*",
    typeCode: 255,
    title: "* — All Types (ANY)",
    tagline: "Meta QTYPE matching all types.",
    synopsis: "Not a zone RR. Query type requesting all RRtypes at a name (often discouraged).",
    image: "/dns/rr/any.jpg",
    imageAlt: "Cat meme labelled *",
    rfcs: [
      { id: "RFC 1035", url: "https://www.rfc-editor.org/rfc/rfc1035" }
    ],
    fields: [
      {
        name: "(none)",
        type: "n/a",
        description: "ANY/* has no RDATA; it is a query type.",
        example: "n/a",
      }
    ],
    examples: [
      "; * / ANY is a QTYPE — not stored in zone files",
      "; query: example.com ANY",
      "; query: example.com TYPE255"
    ],
    warning: { level: "meta", message: "Meta QTYPE matching all types. Not a zone RR." },
  },
  {
    slug: "uri",
    type: "URI",
    typeCode: 256,
    title: "URI — Uniform Resource Identifier",
    tagline: "URI with priority and weight.",
    synopsis: "Priority, weight, and target URI string.",
    image: "/dns/rr/uri.jpg",
    imageAlt: "Cat meme labelled URI",
    rfcs: [
      { id: "RFC 7553", url: "https://www.rfc-editor.org/rfc/rfc7553" }
    ],
    fields: [
      {
        name: "PRIORITY",
        type: "16-bit unsigned integer",
        description: "Lower preferred.",
        example: "10",
      },
      {
        name: "WEIGHT",
        type: "16-bit unsigned integer",
        description: "Relative weight among equal priority.",
        example: "1",
      },
      {
        name: "TARGET",
        type: "character-string",
        description: "URI (quoted).",
        example: "\"https://www.example.com/\"",
      }
    ],
    examples: [
      "example.com.  300  IN  URI  10 1 \"https://www.example.com/\"",
      "_http._tcp.example.com.  300  IN  URI  10 1 \"https://www.example.com/path\"",
      "ftp.example.com.  300  IN  URI  10 1 \"ftp://files.example.com/pub\""
    ],
  },
  {
    slug: "caa",
    type: "CAA",
    typeCode: 257,
    title: "CAA — Certification Authority Authorization",
    tagline: "Which CAs may issue certificates for a name.",
    synopsis: "Flags, tag, and value.",
    image: "/dns/rr/caa.jpg",
    imageAlt: "Cat meme labelled CAA",
    rfcs: [
      { id: "RFC 8659", url: "https://www.rfc-editor.org/rfc/rfc8659" }
    ],
    fields: [
      {
        name: "FLAGS",
        type: "8-bit unsigned integer",
        description: "Bit 0 = Issuer Critical.",
        example: "0",
      },
      {
        name: "TAG",
        type: "character-string",
        description: "Property tag (issue, issuewild, iodef, etc.).",
        example: "issue",
      },
      {
        name: "VALUE",
        type: "character-string",
        description: "Tag-specific value.",
        example: "\"letsencrypt.org\"",
      }
    ],
    examples: [
      "example.com.  300  IN  CAA  0 issue \"letsencrypt.org\"",
      "example.com.  300  IN  CAA  0 issuewild \";\"",
      "example.com.  300  IN  CAA  0 iodef \"mailto:security@example.com\""
    ],
  },
  {
    slug: "avc",
    type: "AVC",
    typeCode: 258,
    title: "AVC — Application Visibility & Control",
    tagline: "Application visibility metadata (unstandardized).",
    synopsis: "Character-strings similar to TXT. Best-effort; no standards-track RDATA.",
    image: "/dns/rr/avc.jpg",
    imageAlt: "Cat meme labelled AVC",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "TXT-DATA",
        type: "character-string+",
        description: "Application/visibility attributes as text.",
        example: "\"app=http\"",
      }
    ],
    examples: [
      "example.com.  300  IN  AVC  \"app=http\"",
      "example.com.  300  IN  AVC  \"vendor=example\" \"class=web\"",
      "example.com.  300  IN  TYPE258  \\# 0"
    ],
  },
  {
    slug: "doa",
    type: "DOA",
    typeCode: 259,
    title: "DOA — Digital Object Architecture",
    tagline: "Digital Object handle / data.",
    synopsis: "Enterprise, type, location, media type, and data (hex/base64).",
    image: "/dns/rr/doa.jpg",
    imageAlt: "Cat meme labelled DOA",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "ENTERPRISE",
        type: "32-bit unsigned integer",
        description: "Private enterprise number.",
        example: "0",
      },
      {
        name: "TYPE",
        type: "32-bit unsigned integer",
        description: "DOA type.",
        example: "1",
      },
      {
        name: "LOCATION",
        type: "8-bit unsigned integer",
        description: "0 = contain, 1 = URI, etc.",
        example: "1",
      },
      {
        name: "MEDIA TYPE",
        type: "character-string",
        description: "MIME type of the data.",
        example: "\"text/plain\"",
      },
      {
        name: "DATA",
        type: "hex / base64",
        description: "Object data or reference.",
        example: "0123",
      }
    ],
    examples: [
      "example.com.  300  IN  DOA  0 1 1 \"text/plain\" 48656c6c6f",
      "example.com.  300  IN  DOA  0 2 2 \"application/octet-stream\" AAECAw==",
      "obj.example.  300  IN  TYPE259  \\# 8 0000000000000001"
    ],
  },
  {
    slug: "amtrelay",
    type: "AMTRELAY",
    typeCode: 260,
    title: "AMTRELAY — Automatic Multicast Tunneling Relay",
    tagline: "AMT relay discovery.",
    synopsis: "Precedence, discovery optional flag, relay type, and relay.",
    image: "/dns/rr/amtrelay.jpg",
    imageAlt: "Cat meme labelled AMTRELAY",
    rfcs: [
      { id: "RFC 8777", url: "https://www.rfc-editor.org/rfc/rfc8777" }
    ],
    fields: [
      {
        name: "PRECEDENCE",
        type: "8-bit unsigned integer",
        description: "Lower preferred.",
        example: "10",
      },
      {
        name: "D-BIT / DISCOVERY OPTIONAL",
        type: "flag",
        description: "Discovery Optional bit.",
        example: "0",
      },
      {
        name: "RELAY TYPE",
        type: "4-bit",
        description: "0 = none, 1 = IPv4, 2 = IPv6, 3 = domain name.",
        example: "3",
      },
      {
        name: "RELAY",
        type: "address or domain-name",
        description: "Relay address or name.",
        example: "amt-relay.example.com.",
      }
    ],
    examples: [
      "example.com.  300  IN  AMTRELAY  10 0 3 amt-relay.example.com.",
      "example.com.  300  IN  AMTRELAY  20 0 1 192.0.2.53",
      "example.com.  300  IN  AMTRELAY  15 1 2 2001:db8::53"
    ],
  },
  {
    slug: "resinfo",
    type: "RESINFO",
    typeCode: 261,
    title: "RESINFO — Resolver Information",
    tagline: "Resolver capability key/value pairs.",
    synopsis: "One or more character-strings of key[=value] pairs (TXT-like).",
    image: "/dns/rr/resinfo.jpg",
    imageAlt: "Cat meme labelled RESINFO",
    rfcs: [
      { id: "RFC 9606", url: "https://www.rfc-editor.org/rfc/rfc9606" }
    ],
    fields: [
      {
        name: "RESINFO-DATA",
        type: "character-string+",
        description: "Key/value capability ads (e.g. qnamemin, exterr).",
        example: "\"qnamemin\"",
      }
    ],
    examples: [
      "resolver.example.net.  300  IN  RESINFO  \"qnamemin\"",
      "resolver.example.net.  300  IN  RESINFO  \"exterr\" \"infourl=https://example.net/resinfo\"",
      "_resinfo.example.net.  300  IN  RESINFO  \"qnamemin\" \"tcp\""
    ],
  },
  {
    slug: "wallet",
    type: "WALLET",
    typeCode: 262,
    title: "WALLET — Public Wallet Address",
    tagline: "Cryptocurrency wallet address.",
    synopsis: "TXT-like strings: currency abbreviation then wallet address display form.",
    image: "/dns/rr/wallet.jpg",
    imageAlt: "Cat meme labelled WALLET",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "CURRENCY",
        type: "character-string",
        description: "Informal currency abbreviation (BTC, ETH, ...).",
        example: "\"BTC\"",
      },
      {
        name: "ADDRESS",
        type: "character-string",
        description: "Display form of the wallet address.",
        example: "\"bc1qexample...\"",
      }
    ],
    examples: [
      "example.com.  300  IN  WALLET  \"BTC\" \"bc1qexampleaddress0000000000000000000\"",
      "example.com.  300  IN  WALLET  \"ETH\" \"0xExampleEthAddress0000000000000000000000\"",
      "pay.example.  300  IN  WALLET  \"MATIC\" \"0xExamplePolygonAddress00000000000000000\""
    ],
  },
  {
    slug: "cla",
    type: "CLA",
    typeCode: 263,
    title: "CLA — BP Convergence Layer Adapter",
    tagline: "Bundle Protocol CLA endpoint (draft).",
    synopsis: "Best-effort: CLA scheme and endpoint parameters as text/octets pending final RFC.",
    image: "/dns/rr/cla.jpg",
    imageAlt: "Cat meme labelled CLA",
    rfcs: [
      { id: "draft-johnson-dns-ipn-cla", url: "https://datatracker.ietf.org/doc/draft-johnson-dns-ipn-cla/" }
    ],
    fields: [
      {
        name: "CLA-DATA",
        type: "octet string / text",
        description: "Convergence-layer adapter identification. Presentation not finalized.",
        example: "\"tcpcl\"",
      }
    ],
    examples: [
      "example.com.  300  IN  CLA  \"tcpcl\"",
      "node.example.  300  IN  CLA  \"stcp\"",
      "example.com.  300  IN  TYPE263  \\# 4 74637000"
    ],
  },
  {
    slug: "ipn",
    type: "IPN",
    typeCode: 264,
    title: "IPN — BP Node Number",
    tagline: "Bundle Protocol IPN node number (draft).",
    synopsis: "Best-effort: node number (and optional service) for ipn URI scheme pending final RFC.",
    image: "/dns/rr/ipn.jpg",
    imageAlt: "Cat meme labelled IPN",
    rfcs: [
      { id: "draft-johnson-dns-ipn-cla", url: "https://datatracker.ietf.org/doc/draft-johnson-dns-ipn-cla/" }
    ],
    fields: [
      {
        name: "NODE NUMBER",
        type: "integer / octets",
        description: "BP IPN node number.",
        example: "1",
      },
      {
        name: "SERVICE NUMBER",
        type: "integer / octets",
        description: "Optional service number.",
        example: "1",
      }
    ],
    examples: [
      "example.com.  300  IN  IPN  1",
      "example.com.  300  IN  IPN  1 1",
      "node.example.  300  IN  TYPE264  \\# 8 0000000000000001"
    ],
  },
  {
    slug: "ta",
    type: "TA",
    typeCode: 32768,
    title: "TA — Trust Authority",
    tagline: "DNSSEC Trust Authority (same RDATA as DS).",
    synopsis: "Key tag, algorithm, digest type, and digest (DS-identical).",
    image: "/dns/rr/ta.jpg",
    imageAlt: "Cat meme labelled TA",
    rfcs: [
      { id: "IANA", url: "https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4" }
    ],
    fields: [
      {
        name: "KEY TAG",
        type: "16-bit unsigned integer",
        description: "Key tag of the referenced DNSKEY.",
        example: "60485",
      },
      {
        name: "ALGORITHM",
        type: "8-bit unsigned integer",
        description: "DNSKEY algorithm.",
        example: "5",
      },
      {
        name: "DIGEST TYPE",
        type: "8-bit unsigned integer",
        description: "Digest algorithm.",
        example: "1",
      },
      {
        name: "DIGEST",
        type: "hex",
        description: "Digest of the DNSKEY RR.",
        example: "2BB183AF5F22588179A53B0A98631FAD1A292118",
      }
    ],
    examples: [
      "example.com.  300  IN  TA  60485 5 1 2BB183AF5F22588179A53B0A98631FAD1A292118",
      "example.com.  300  IN  TA  60485 8 2 E2D3C23E5C9B6A1F4A0B8C7D6E5F4A3B2C1D0E9F8A7B6C5D4E3F2A1B0C9D8E7F",
      "trust.example.  300  IN  TA  12345 13 2 0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF"
    ],
  },
  {
    slug: "dlv",
    type: "DLV",
    typeCode: 32769,
    title: "DLV — DNSSEC Lookaside Validation",
    tagline: "Obsolete lookaside DS-like record.",
    synopsis: "Same RDATA as DS. DLV is withdrawn; use normal DS chains.",
    image: "/dns/rr/dlv.jpg",
    imageAlt: "Cat meme labelled DLV",
    rfcs: [
      { id: "RFC 4431", url: "https://www.rfc-editor.org/rfc/rfc4431" }
    ],
    fields: [
      {
        name: "KEY TAG",
        type: "16-bit unsigned integer",
        description: "Key tag of the referenced DNSKEY.",
        example: "60485",
      },
      {
        name: "ALGORITHM",
        type: "8-bit unsigned integer",
        description: "DNSKEY algorithm.",
        example: "5",
      },
      {
        name: "DIGEST TYPE",
        type: "8-bit unsigned integer",
        description: "Digest algorithm.",
        example: "1",
      },
      {
        name: "DIGEST",
        type: "hex",
        description: "Digest of the DNSKEY RR.",
        example: "2BB183AF5F22588179A53B0A98631FAD1A292118",
      }
    ],
    examples: [
      "example.com.dlv.isc.org.  300  IN  DLV  60485 5 1 2BB183AF5F22588179A53B0A98631FAD1A292118",
      "example.com.  300  IN  DLV  60485 8 2 E2D3C23E5C9B6A1F4A0B8C7D6E5F4A3B2C1D0E9F8A7B6C5D4E3F2A1B0C9D8E7F",
      "child.example.  300  IN  DLV  12345 13 2 0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF"
    ],
    warning: { level: "obsolete", message: "Obsolete. DLV is withdrawn; use normal DS chains." },
  }
];

export function getDnsRr(slug: string): DnsRr | undefined {
  return dnsRrs.find((rr) => rr.slug === slug.toLowerCase());
}

export function getAllDnsRrSlugs(): string[] {
  return dnsRrs.map((rr) => rr.slug);
}
