import rss from "@astrojs/rss";
import { listNews } from "../lib/cms/content";

export async function GET(context: { site: URL | undefined }) {
  const news = await listNews();

  return rss({
    title: "Northfield Modern University News",
    description: "Official announcements and updates from Northfield Modern University",
    site: context.site ?? "https://university.example.edu",
    items: news.map((item) => ({
      title: item.title,
      pubDate: new Date(item.publishedAt),
      description: item.summary,
      link: `/news/${item.slug}`,
    })),
    customData: "<language>en-us</language>",
  });
}
