import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const programs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/programs" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    description: z.string(),
    department: z.string(),
    degree: z.string(),
    duration: z.string(),
    campus: z.string(),
    applicationDeadline: z.coerce.date().optional(),
    tuitionPerYearUSD: z.number().int().positive().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().min(0).default(99),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    publishedAt: z.coerce.date(),
    author: z.string(),
    featured: z.boolean().default(false),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    location: z.string(),
    eventType: z.string(),
    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
    registrationUrl: z.string().url().optional(),
  }),
});

export const collections = {
  programs,
  news,
  events,
};
