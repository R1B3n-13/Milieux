"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import FeedCard from "./FeedCard";
import { getFeeds } from "@/services/feedService";
import FeedSchema from "@/schemas/feedSchema";
import { z } from "zod";
import FeedSkeleton from "./FeedSkeleton";
import { feedItems } from "./items/feedItems";

const FeedSelector = () => {
  const [selectedFeed, setSelectedFeed] = useState("bbc");
  const [feedContents, setFeedContents] = useState<
    z.infer<typeof FeedSchema>[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSelectedFeed = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/feed/${selectedFeed}`);
        if (!response.ok) {
          throw new Error("Failed to fetch feed");
        }
        const items = await response.json();
        setFeedContents(items);
      } catch (error) {
        console.error("Error fetching feed:", error);
        setFeedContents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedFeed();
  }, [selectedFeed]);

  if (loading) {
    return <FeedSkeleton />;
  }

  return (
    <div className="w-full">
      <Select value={selectedFeed} onValueChange={setSelectedFeed}>
        <SelectTrigger className="w-[180px] mb-4">
          <SelectValue placeholder="Select a feed" />
        </SelectTrigger>
        <SelectContent>
          {feedItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card className="max-h-[calc(100vh-12em)] min-h-[calc(100vh-12em)] overflow-y-auto no-scrollbar bg-white shadow-md">
        <CardContent className="space-y-2">
          {feedContents.map((feed, index) => (
            <FeedCard key={index} feed={feed} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedSelector;
