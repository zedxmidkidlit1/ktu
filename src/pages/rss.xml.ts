import rss from "@astrojs/rss";
import { listNews } from "../lib/cms/content";

export async function GET(context: { site: URL | undefined }) {
  const news = await listNews();

  return rss({
    title: "Kyaukse Technological University News",
    description: "Official announcements and updates from Kyaukse Technological University",
    site: context.site ?? "https://official-ktu.vercel.app",
    items: news.map((item) => ({
      title: item.title,
      pubDate: new Date(item.publishedAt),
      description: item.summary,
      link: `/news/${item.slug}`,
    })),
    customData: "<language>en-us</language>",
  });
}
