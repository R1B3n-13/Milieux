import FeedSchema from "@/schemas/feedSchema";
import Parser from "rss-parser";

const fetchFeeds = async (
  feedURL: string,
  customFields: Record<string, any> = {}
) => {
  const parser = new Parser({ customFields });

  try {
    const feed = await parser.parseURL(feedURL);

    const feedItems = feed.items.map((item: any) => ({
      title: item.title || "",
      link: item.link || "",
      pubDate: item.pubDate || "",
      thumbnail: item.thumbnail?.$.url || item.enclosure?.url || null,
    }));

    const validatedItems = feedItems.map((item: any) => FeedSchema.parse(item));

    return validatedItems;
  } catch (error) {
    console.error("Error fetching or parsing feed:", error);
    return [];
  }
};

export const getBBCFeeds = async () => {
  const feedURL = "https://feeds.bbci.co.uk/news/rss.xml";
  return await fetchFeeds(feedURL, {
    item: [["media:thumbnail", "thumbnail"]],
  });
};

export const getWiredFeeds = async () => {
  const feedURL = "https://www.wired.com/feed/rss";
  return await fetchFeeds(feedURL, {
    item: [["media:thumbnail", "thumbnail"]],
  });
};

export const getESPNFeeds = async () => {
  const feedURL = "https://www.espn.com/espn/rss/";
  return await fetchFeeds(feedURL);
};
