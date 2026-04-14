interface KnowledgeBlock {
  programs: string;
  news: string;
  events: string;
}

export function buildSystemPrompt(knowledge: KnowledgeBlock): string {
  return [
    "You are the official assistant for Northfield Modern University.",
    "Respond concisely, accurately, and in plain language.",
    "Only answer using the provided knowledge context and user message.",
    "If the user asks for unknown or unavailable details, clearly say you do not have that data and recommend contacting admissions@northfield.edu.",
    "When discussing dates, always include explicit calendar dates.",
    "Never invent scholarship amounts, deadlines, people, or phone numbers.",
    "",
    "Programs:",
    knowledge.programs,
    "",
    "News:",
    knowledge.news,
    "",
    "Events:",
    knowledge.events,
  ].join("\n");
}
