import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/Card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import AvatarIcon from "../icons/AvatarIcon";
import Image from "next/image";
import LoveLineIcon from "../icons/LoveLineIcon";
import RemarkLineIcon from "../icons/RemarkLineIcon";
import ShareLineIcon from "../icons/ShareLineIcon";
import BookmarkLineIcon from "../icons/BookmarkLineIcon";
import { z } from "zod";
import PostSchema from "@/schemas/postSchema";

const PostCard = ({ post }: { post: z.infer<typeof PostSchema> }) => {
  return (
    <div className="flex transition-all">
      <Card className="mb-5 bg-white shadow-md w-full">
        <CardHeader className="pb-3">
          <div className="flex gap-4">
            <div className="cursor-pointer">
              <Avatar>
                <AvatarImage />
                <AvatarFallback className="text-5xl text-gray-500">
                  <AvatarIcon />
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="mt-1 font-semibold text-slate-700 cursor-pointer">
                {post.ownerName}
              </CardTitle>
              <CardDescription className="mt-1 cursor-default">
                {new Date(post.createdAt || "").toLocaleString()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <div className="flex flex-col">
            {post.caption && (
              <p className="pb-3 px-6 text-slate-700 font-medium">
                {post.caption}
              </p>
            )}
            {post.imagePath && (
              <div className="flex items-center justify-center">
                <Image
                  src={post.imagePath}
                  alt="post image"
                  width={685}
                  height={0}
                />
              </div>
            )}
            {post.videoPath && (
              <div className="flex items-center justify-center">
                <video controls width="614">
                  <source src={post.videoPath} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center text-2xl text-slate-700">
          <div className="flex items-center gap-3">
            <div className="cursor-pointer">
              <LoveLineIcon />
            </div>
            <div className="cursor-pointer">
              <RemarkLineIcon />
            </div>
            <div className="cursor-pointer">
              <ShareLineIcon />
            </div>
          </div>
          <div className="flex items-center cursor-pointer ml-auto">
            <BookmarkLineIcon />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostCard;
