import { getCollection } from "astro:content";
import { fetchSanityEvents, fetchSanityNews, fetchSanityPrograms, sanityEnabled } from "./sanity";
import type { EventItem, NewsItem, ProgramItem } from "./types";

function toSlug(id: string): string {
  return id.replace(/\.(md|mdx)$/i, "");
}

function sortPrograms(items: ProgramItem[]): ProgramItem[] {
  return [...items].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder || a.title.localeCompare(b.title)
  );
}

function sortNews(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

function sortEvents(items: EventItem[]): EventItem[] {
  return [...items].sort((a, b) => {
    const aTime = a.startAt ? new Date(a.startAt).getTime() : Number.POSITIVE_INFINITY;
    const bTime = b.startAt ? new Date(b.startAt).getTime() : Number.POSITIVE_INFINITY;
    return aTime - bTime;
  });
}

export async function listPrograms(): Promise<ProgramItem[]> {
  if (sanityEnabled()) {
    const remoteItems = await fetchSanityPrograms();
    if (remoteItems.length > 0) {
      return sortPrograms(remoteItems);
    }
  }

  const entries = await getCollection("programs");
  const localItems = entries.map((entry) => ({
    slug: toSlug(entry.id),
    title: entry.data.title,
    summary: entry.data.summary,
    description: entry.data.description,
    department: entry.data.department,
    degree: entry.data.degree,
    duration: entry.data.duration,
    campus: entry.data.campus,
    applicationDeadline: entry.data.applicationDeadline?.toISOString(),
    tuitionPerYearUSD: entry.data.tuitionPerYearUSD,
    tags: entry.data.tags,
    featured: entry.data.featured,
    sortOrder: entry.data.sortOrder,
    content: entry.body ?? "",
  }));

  return sortPrograms(localItems);
}

export async function listNews(): Promise<NewsItem[]> {
  if (sanityEnabled()) {
    const remoteItems = await fetchSanityNews();
    if (remoteItems.length > 0) {
      return sortNews(remoteItems);
    }
  }

  const entries = await getCollection("news");
  const localItems = entries.map((entry) => ({
    slug: toSlug(entry.id),
    title: entry.data.title,
    summary: entry.data.summary,
    category: entry.data.category,
    publishedAt: entry.data.publishedAt.toISOString(),
    author: entry.data.author,
    featured: entry.data.featured,
    content: entry.body ?? "",
  }));

  return sortNews(localItems);
}

export async function listEvents(): Promise<EventItem[]> {
  if (sanityEnabled()) {
    const remoteItems = await fetchSanityEvents();
    if (remoteItems.length > 0) {
      return sortEvents(remoteItems);
    }
  }

  const entries = await getCollection("events");
  const localItems = entries.map((entry) => ({
    slug: toSlug(entry.id),
    title: entry.data.title,
    summary: entry.data.summary,
    location: entry.data.location,
    eventType: entry.data.eventType,
    startAt: entry.data.startAt?.toISOString(),
    endAt: entry.data.endAt?.toISOString(),
    registrationUrl: entry.data.registrationUrl,
    content: entry.body ?? "",
  }));

  return sortEvents(localItems);
}

export async function getProgramBySlug(slug: string): Promise<ProgramItem | undefined> {
  const items = await listPrograms();
  return items.find((item) => item.slug === slug);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  const items = await listNews();
  return items.find((item) => item.slug === slug);
}

export async function getEventBySlug(slug: string): Promise<EventItem | undefined> {
  const items = await listEvents();
  return items.find((item) => item.slug === slug);
}
