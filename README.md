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

The site is automatically built and pushed to GitHub Container Registry on push to `main`:

```bash
# Pull the latest image
docker pull ghcr.io/davidgroves/new.www.fibrecat.org:latest

# Run the container
docker run -p 4321:4321 ghcr.io/davidgroves/new.www.fibrecat.org:latest
```

## Features

- **Dark/Light Theme** - Automatic detection of system preference with manual toggle
- **Blog** - MDX support with syntax highlighting, math (KaTeX), and code blocks
- **Responsive** - Mobile-first design
- **SSR** - Server-side rendering for dynamic content
- **RSS Feed** - Available at `/rss.xml`

## License

MIT
