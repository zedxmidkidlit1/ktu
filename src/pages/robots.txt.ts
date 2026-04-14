import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL("/sitemap-index.xml", site ?? "https://university.example.edu");
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemapUrl.toString()}\n`, {
    headers: { "Content-Type": "text/plain" },
  });
};
