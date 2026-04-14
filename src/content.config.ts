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
    applicationDeadline: z.coerce.date(),
    tuitionPerYearUSD: z.number().int().positive(),
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
    category: z.enum(["Campus", "Research", "Admissions", "Student Life"]),
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
    eventType: z.enum(["Open Day", "Webinar", "Workshop", "Ceremony"]),
    startAt: z.coerce.date(),
    endAt: z.coerce.date().optional(),
    registrationUrl: z.string().url().optional(),
  }),
});

export const collections = {
  programs,
  news,
  events,
};
