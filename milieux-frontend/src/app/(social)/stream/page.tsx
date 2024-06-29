import PostCreationCard from "@/components/common/PostCreationCard";
import PostCard from "@/components/stream/PostCard";
import { getBBCFeeds } from "@/services/feed/feedService";
import React from "react";

const StreamPage = async () => {
  {
    await getBBCFeeds();
  }

  return (
    <div>
      <PostCreationCard />
      <PostCard />
    </div>
  );
};

export default StreamPage;
