import type { APIRoute } from "astro";
import OpenAI from "openai";
import { buildSystemPrompt } from "../../lib/chat/systemPrompt";
import { listEvents, listNews, listPrograms } from "../../lib/cms/content";
import { formatDate, formatDateTime } from "../../lib/format";
import type { EventItem, NewsItem, ProgramItem } from "../../lib/cms/types";

export const prerender = false;

type Turn = {
  role: "user" | "assistant";
  content: string;
};

const model = import.meta.env.OPENAI_MODEL ?? "gpt-4.1-mini";
const apiKey = import.meta.env.OPENAI_API_KEY;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function isTurn(value: unknown): value is Turn {
  if (!value || typeof value !== "object") {
    return false;
  }

  const turn = value as Record<string, unknown>;
  return (
    (turn.role === "user" || turn.role === "assistant") &&
    typeof turn.content === "string" &&
    turn.content.trim().length > 0
  );
}

function trimHistory(value: unknown): Turn[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isTurn)
    .map((turn) => ({
      role: turn.role,
      content: turn.content.trim().slice(0, 1200),
    }))
    .slice(-8);
}

function buildKnowledgeLines(
  programs: ProgramItem[],
  news: NewsItem[],
  events: EventItem[]
): { programs: string; news: string; events: string } {
  const programLines = programs
    .slice(0, 8)
    .map((item) => {
      const deadline = item.applicationDeadline ? formatDate(item.applicationDeadline) : "Admissions period announced on official channels";
      return `${item.title} (${item.degree}, ${item.duration}) | Dept: ${item.department} | Deadline: ${deadline}`;
    });
  const newsLines = news
    .slice(0, 8)
    .map((item) => `${item.title} | ${item.category} | Published: ${formatDate(item.publishedAt)}`);
  const eventLines = events
    .slice(0, 8)
    .map((item) => {
      const start = item.startAt ? formatDateTime(item.startAt) : "Date to be announced";
      return `${item.title} | ${item.eventType} | ${start} | ${item.location}`;
    });

  return {
    programs: programLines.join("\n"),
    news: newsLines.join("\n"),
    events: eventLines.join("\n"),
  };
}

function scoreMatch(message: string, candidate: string): number {
  const tokens = candidate
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 3);

  let score = 0;
  for (const token of tokens) {
    if (message.includes(token)) {
      score += 1;
    }
  }

  return score;
}

function pickCitations(message: string, programs: ProgramItem[], news: NewsItem[], events: EventItem[]): string[] {
  const normalized = message.toLowerCase();
  const scoredLinks: Array<{ href: string; score: number }> = [];

  for (const item of programs) {
    scoredLinks.push({
      href: `/programs/${item.slug}`,
      score: scoreMatch(normalized, `${item.title} ${item.department} ${item.tags.join(" ")}`),
    });
  }

  for (const item of news) {
    scoredLinks.push({
      href: `/news/${item.slug}`,
      score: scoreMatch(normalized, `${item.title} ${item.category}`),
    });
  }

  for (const item of events) {
    scoredLinks.push({
      href: `/events/${item.slug}`,
      score: scoreMatch(normalized, `${item.title} ${item.eventType} ${item.location}`),
    });
  }

  const topMatches = scoredLinks
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.href);

  if (topMatches.length > 0) {
    return topMatches;
  }

  return ["/admissions", "/programs"];
}

export const POST: APIRoute = async ({ request }) => {
  if (!apiKey) {
    return json(
      {
        error:
          "Chatbot is not configured yet. Set OPENAI_API_KEY in your environment and redeploy the site.",
      },
      503
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const body = payload as Record<string, unknown>;
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!message) {
    return json({ error: "Message is required." }, 400);
  }

  if (message.length > 800) {
    return json({ error: "Message is too long. Please keep it under 800 characters." }, 400);
  }

  const history = trimHistory(body.history);
  const [programs, news, events] = await Promise.all([listPrograms(), listNews(), listEvents()]);
  const knowledge = buildKnowledgeLines(programs, news, events);
  const prompt = buildSystemPrompt(knowledge);
  const client = new OpenAI({ apiKey });

  try {
    const response = await client.responses.create({
      model,
      temperature: 0.2,
      max_output_tokens: 420,
      input: [
        { role: "system", content: prompt },
        ...history.map((turn) => ({ role: turn.role, content: turn.content })),
        { role: "user", content: message },
      ],
    });

    const answer = response.output_text?.trim();
    if (!answer) {
      return json({ error: "No response generated by the model." }, 502);
    }

    return json({
      answer,
      citations: pickCitations(message, programs, news, events),
    });
  } catch {
    return json({ error: "The assistant is temporarily unavailable. Please try again shortly." }, 500);
  }
};
