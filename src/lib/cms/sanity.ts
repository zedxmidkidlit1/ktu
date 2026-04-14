import { createClient } from "@sanity/client";
import type { EventItem, NewsItem, ProgramItem } from "./types";

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET;
const apiVersion = import.meta.env.SANITY_API_VERSION ?? "2025-01-01";
const readToken = import.meta.env.SANITY_READ_TOKEN;

function getClient() {
  if (!projectId || !dataset) {
    return null;
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    token: readToken,
    perspective: "published",
  });
}

export function sanityEnabled(): boolean {
  return Boolean(projectId && dataset);
}

export async function fetchSanityPrograms(): Promise<ProgramItem[]> {
  const client = getClient();
  if (!client) {
    return [];
  }

  try {
    const rows = await client.fetch<
      Array<
        Omit<ProgramItem, "content"> & {
          content?: string;
        }
      >
    >(`*[_type == "program"]{
      "slug": slug.current,
      title,
      summary,
      description,
      department,
      degree,
      duration,
      campus,
      applicationDeadline,
      tuitionPerYearUSD,
      tags,
      featured,
      sortOrder,
      content
    }`);

    return rows
      .filter((row) => Boolean(row.slug && row.title))
      .map((row) => ({
        ...row,
        applicationDeadline: new Date(row.applicationDeadline).toISOString(),
        tags: row.tags ?? [],
        featured: Boolean(row.featured),
        sortOrder: row.sortOrder ?? 99,
        content: row.content ?? "",
      }));
  } catch {
    return [];
  }
}

export async function fetchSanityNews(): Promise<NewsItem[]> {
  const client = getClient();
  if (!client) {
    return [];
  }

  try {
    const rows = await client.fetch<Array<Omit<NewsItem, "content"> & { content?: string }>>(`*[_type == "news"]{
      "slug": slug.current,
      title,
      summary,
      category,
      publishedAt,
      author,
      featured,
      content
    }`);

    return rows
      .filter((row) => Boolean(row.slug && row.title))
      .map((row) => ({
        ...row,
        publishedAt: new Date(row.publishedAt).toISOString(),
        featured: Boolean(row.featured),
        content: row.content ?? "",
      }));
  } catch {
    return [];
  }
}

export async function fetchSanityEvents(): Promise<EventItem[]> {
  const client = getClient();
  if (!client) {
    return [];
  }

  try {
    const rows = await client.fetch<Array<Omit<EventItem, "content"> & { content?: string }>>(`*[_type == "event"]{
      "slug": slug.current,
      title,
      summary,
      location,
      eventType,
      startAt,
      endAt,
      registrationUrl,
      content
    }`);

    return rows
      .filter((row) => Boolean(row.slug && row.title))
      .map((row) => ({
        ...row,
        startAt: new Date(row.startAt).toISOString(),
        endAt: row.endAt ? new Date(row.endAt).toISOString() : undefined,
        content: row.content ?? "",
      }));
  } catch {
    return [];
  }
}
