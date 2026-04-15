import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL("/sitemap-index.xml", site ?? "https://official-ktu.vercel.app");
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemapUrl.toString()}\n`, {
    headers: { "Content-Type": "text/plain" },
  });
};
