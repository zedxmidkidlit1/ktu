# Northfield Modern University Website

Production-ready Astro 6 project for a modern university website:

- Static-first page architecture with Astro content collections
- Tailwind CSS v4 styling system
- CMS-ready source layer with optional Sanity integration
- AI chatbot endpoint powered by OpenAI Responses API
- SEO baseline with sitemap, robots, and RSS feed

## Tech Stack

- `astro@6.1.5`
- `tailwindcss@4.2.2` + `@tailwindcss/vite`
- `@astrojs/vercel` (serverless adapter for API route on Vercel)
- `@astrojs/sitemap` + `@astrojs/rss`
- `@sanity/client` (optional CMS mode)
- `openai` (chatbot integration)

## Quick Start

```bash
cd /root/university-site
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:4321`.

## Environment Variables

`OPENAI_API_KEY` is required for `/api/chat`.

Optional Sanity variables:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`
- `SANITY_READ_TOKEN`

When Sanity is configured, content loaders try Sanity first, then fallback to local Astro collections if remote content is unavailable.

## Deploy to Vercel

1. Push this project to a Git repository.
2. Import the repo in Vercel.
3. Set environment variables in Vercel Project Settings:
   - `OPENAI_API_KEY` (required)
   - `OPENAI_MODEL` (optional)
   - `SITE_URL` (your deployed domain, e.g. `https://northfield.vercel.app`)
   - Sanity variables if using Sanity CMS
4. Redeploy.

## Content Model

Local content collections are in `src/content`:

- `programs`
- `news`
- `events`

These power:

- `/programs` + `/programs/[slug]`
- `/news` + `/news/[slug]`
- `/events` + `/events/[slug]`
- `/rss.xml`
- chatbot grounding context

## Important Deployment Note

`astro.config.mjs` uses `SITE_URL` (fallback: `https://university.example.edu`) for canonical and sitemap links.
