import { NextResponse } from "next/server";
import Parser from "rss-parser";

const feedConfigs: {
  [key: string]: { url: string; customFields: Record<string, any> };
} = {
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

export async function GET(
  request: Request,
  { params }: { params: { source: string } }
) {
  const source = params.source;

  if (!feedConfigs[source]) {
    return NextResponse.json({ error: "Invalid feed source" }, { status: 400 });
  }

  const { url, customFields } = feedConfigs[source];
  const parser = new Parser({ customFields });

  try {
    const feed = await parser.parseURL(url);
    const feedItems = feed.items.map((item: any) => ({
      title: item.title || "",
      link: item.link || "",
      pubDate: item.pubDate || "",
      thumbnail: item.thumbnail?.$.url || item.enclosure?.url || null,
    }));

    return NextResponse.json(feedItems);
  } catch (error) {
    console.error("Error fetching or parsing feed:", error);
    return NextResponse.json({ error: "Error fetching feed" }, { status: 500 });
  }
}
