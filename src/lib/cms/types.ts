export interface ProgramItem {
  slug: string;
  title: string;
  summary: string;
  description: string;
  department: string;
  degree: string;
  duration: string;
  campus: string;
  applicationDeadline?: string;
  tuitionPerYearUSD?: number;
  tags: string[];
  featured: boolean;
  sortOrder: number;
  content: string;
}

export interface NewsItem {
  slug: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  author: string;
  featured: boolean;
  content: string;
}

export interface EventItem {
  slug: string;
  title: string;
  summary: string;
  location: string;
  eventType: string;
  startAt?: string;
  endAt?: string;
  registrationUrl?: string;
  content: string;
}
