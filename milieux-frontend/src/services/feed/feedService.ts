import FeedSchema from "@/schemas/feedSchema";
import Parser from "rss-parser";

export const getBBCFeeds = async () => {
  const feedURL = "https://feeds.bbci.co.uk/news/rss.xml";

  const parser = new Parser({
    customFields: {
      item: [["media:thumbnail", "thumbnail"]],
    },
  });

  const feed = await parser.parseURL(feedURL);

  const feedItems = feed.items.map((item) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    thumbnail: item.thumbnail ? item.thumbnail.$.url : null,
  }));

  const validatedItems = feedItems.map((item) => FeedSchema.parse(item));

  return validatedItems;
};

export const getWiredFeeds = async () => {
  const feedURL = "https://www.wired.com/feed/rss";

  const parser = new Parser({
    customFields: {
      item: [["media:thumbnail", "thumbnail"]],
    },
  });

  const feed = await parser.parseURL(feedURL);

  const feedItems = feed.items.map((item) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    thumbnail: item.thumbnail ? item.thumbnail.$.url : null,
  }));

  const validatedItems = feedItems.map((item) => FeedSchema.parse(item));

  return validatedItems;
};

export const getESPNFeeds = async () => {
  const feedURL = "https://www.espn.com/espn/rss/";

  const parser = new Parser();

  const feed = await parser.parseURL(feedURL);

  const feedItems = feed.items.map((item) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    thumbnail: item.enclosure ? item.enclosure.url : null,
  }));

  const validatedItems = feedItems.map((item) => FeedSchema.parse(item));

  return validatedItems;
};
