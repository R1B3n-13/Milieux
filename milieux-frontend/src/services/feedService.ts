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

const feedConfigs: Record<
  string,
  { url: string; customFields: Record<string, any> }
> = {
  bbc: {
    url: "https://feeds.bbci.co.uk/news/rss.xml",
    customFields: {
      item: [["media:thumbnail", "thumbnail"]],
    },
  },
  wired: {
    url: "https://www.wired.com/feed/rss",
    customFields: {
      item: [["media:thumbnail", "thumbnail"]],
    },
  },
  sky_sports: {
    url: "https://www.skysports.com/rss/12040",
    customFields: {
      item: [["media:thumbnail", "thumbnail"]],
    },
  },
};

export const getFeeds = async (key: string) => {
  const config = feedConfigs[key];
  if (!config) {
    console.error(`No configuration found for key: ${key}`);
    return [];
  }
  return await fetchFeeds(config.url, config.customFields);
};
