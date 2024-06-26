import { getBBCFeeds } from "@/services/feed/feedService";
import React from "react";

const StreamPage = async () => {
  {
    await getBBCFeeds();
  }

  return (
    <div>
      <h1>StreamPage</h1>
    </div>
  );
};

export default StreamPage;
