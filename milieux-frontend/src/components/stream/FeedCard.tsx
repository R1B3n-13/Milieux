import FeedSchema from "@/schemas/feedSchema";
import { z } from "zod";

const FeedCard = ({ feed }: { feed: z.infer<typeof FeedSchema> }) => {
  return (
    <div className="flex flex-col space-y-2 p-2 border-b">
      <div className="flex items-center space-x-2">
        <div className="w-12 h-12 bg-gray-200">{feed.thumbnail}</div>
        <div className="flex-1">
          <div className="font-medium">{feed.title}</div>
          <div className="text-sm text-gray-500">{feed.publishDate}</div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
