# Fibrecat.org

Personal website of David Groves - built with Astro, TypeScript, and Tailwind CSS.

## Tech Stack

- **[Astro 5](https://astro.build/)** - Static site generator with SSR support
- **TypeScript** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)** - Styling and components
- **[MDX](https://mdxjs.com/)** - Blog posts with React components
- **Docker** - Containerized deployment
- **Bun** - Runtime and package manager

## Development

### Prerequisites

- [Bun](https://bun.sh/) 1.x

### Local Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Using DevContainer

This project includes a DevContainer configuration for VS Code. Open the project in VS Code and select "Reopen in Container" when prompted.

### Docker

```bash
# Build and run with Docker Compose
docker compose up --build

# Or build manually
docker build -t fibrecat.org .
docker run -p 4321:4321 fibrecat.org
```

## Project Structure

```
src/
├── assets/           # Images and static assets
├── components/       # Reusable Astro components
├── content/
│   └── blog/         # MDX blog posts
├── data/             # Static data files
├── layouts/          # Page layouts
├── pages/            # Routes
└── styles/           # Global CSS
```

## Deployment

Hosting is **Railway** with continuous deploy from GitHub Actions on every push to `main`.

| URL | Notes |
|---|---|
| https://web-production-655b1.up.railway.app | Railway default service URL |
| https://www.fibrecat.org | Custom domain (primary / `SITE_URL`) |
| https://fibrecat.org | Apex custom domain |

### Release

```bash
git push origin main
# or: GitHub → Actions → "Deploy to Railway" → Run workflow
```

The workflow builds with Bun (`SKIP_FETCH_ALBUMS=1`), then deploys via the Railway CLI (`railway up`).

### Secrets / variables (GitHub)

- **Secret** `RAILWAY_API_TOKEN` — account-scoped Railway API token (same account as other Railway projects)
- **Variables** `RAILWAY_PROJECT_ID`, `RAILWAY_SERVICE_ID`, `RAILWAY_ENVIRONMENT` (`production`)

### Railway / Docker notes

- Image is built from the repo `Dockerfile` (Bun build → `serve` static `dist/`).
- Runtime listens on Railway’s `$PORT` (default `4321` locally).
- Set `SKIP_FETCH_ALBUMS=1` for Docker/CI so album metadata comes from committed `src/data/albums.json`.

### DNS (GoDaddy)

Configured for Railway:

| Host | Type | Value |
|---|---|---|
| `www` | CNAME | `kxapjkhd.up.railway.app` |
| `@` | A | `69.46.46.6` / `69.46.46.98` (Railway edge IPs; GoDaddy does not support apex CNAME) |
| `_railway-verify.www` | TXT | Railway ownership verification |
| `_railway-verify` | TXT | Railway ownership verification |

Re-check targets anytime with `railway domain status www.fibrecat.org` / `railway domain status fibrecat.org`.

### Optional: self-hosted Caddy

`.github/workflows/deploy-selfhosted.yml` is **manual only** (`workflow_dispatch`) after the Railway cutover.

### GitHub Container Registry

Images are still published to GHCR on push to `main` (independent of Railway):

```bash
docker pull ghcr.io/davidgroves/v2.www.fibrecat.org:latest
docker run -p 4321:4321 -e PORT=4321 ghcr.io/davidgroves/v2.www.fibrecat.org:latest
```

## Features

- **Dark/Light Theme** - Automatic detection of system preference with manual toggle
- **Blog** - MDX support with syntax highlighting, math (KaTeX), and code blocks
- **Responsive** - Mobile-first design
- **SSR** - Server-side rendering for dynamic content
- **RSS Feed** - Available at `/rss.xml`

## License

MIT
