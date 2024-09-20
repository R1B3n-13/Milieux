import FeedSchema from "@/schemas/feedSchema";
import Image from "next/image";
import { z } from "zod";

const FeedCard = ({ feed }: { feed: z.infer<typeof FeedSchema> }) => {
  return (
    <div className="flex flex-col space-y-2 p-2 border-b text-slate-800">
      <div className="flex items-center space-x-2">
        <Image
          src={feed.thumbnail || "/banner_placeholder.png"}
          alt=""
          width={50}
          height={50}
        />
        <div className="flex-1">
          <div className="text-sm text-justify font-normal hover:text-amber-700">
            <a href={feed.link} target="_blank" rel="noopener noreferrer">
              {feed.title}
            </a>
          </div>
          <div className="text-xs font-light text-gray-500">{feed.pubDate}</div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
