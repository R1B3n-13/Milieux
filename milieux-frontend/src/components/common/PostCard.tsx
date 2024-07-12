"use client";

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
import BookmarkLineIcon from "../icons/BookmarkLineIcon";
import { z } from "zod";
import PostSchema from "@/schemas/postSchema";
import { appreciatePost, bookmarkPost } from "@/actions/postActions";
import LoveFilledIcon from "../icons/LoveFilledIcon";
import {
  revalidateAppreciation,
  revalidateBookmark,
} from "@/actions/revalidationActions";
import AppreciationList from "./AppreciationList";
import RemarkSubmissionField from "./RemarkSubmissionField";
import RemarkList from "./RemarkList";
import RemarkFilledIcon from "../icons/RemarkFilledIcon";
import BookmarkFilledIcon from "../icons/BookmarkFilledIcon";

const PostCard = ({
  post,
  userId,
  isSaved,
}: {
  post: z.infer<typeof PostSchema>;
  userId: number;
  isSaved: boolean;
}) => {
  const handleLoveIconClick = async () => {
    await appreciatePost(post.id);
    revalidateAppreciation();
  };

  const handleBookmarkIconClick = async () => {
    await bookmarkPost(post.id);
    revalidateBookmark();
  };

  return (
    <div className="flex transition-all">
      <Card className="bg-white shadow-md w-full">
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
                {post.user?.name}
              </CardTitle>
              <CardDescription className="mt-1 cursor-default">
                {new Date(post.createdAt || "").toLocaleString()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <div className="flex flex-col">
            {post.text && (
              <p className="pb-3 px-6 text-slate-700 font-medium">
                {post.text}
              </p>
            )}
            {post.imagePath && (
              <div className="flex items-center justify-center">
                <Image
                  src={post.imagePath}
                  alt="post image"
                  width={1000}
                  height={0}
                  className="w-full"
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
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={handleLoveIconClick}>
              {post.likedByUsers?.find((user) => user.id === userId) !==
              undefined ? (
                <div className="text-pink-600">
                  <LoveFilledIcon />
                </div>
              ) : (
                <LoveLineIcon />
              )}
            </div>
            <AppreciationList
              dialogButton={
                <p className="text-sm mr-10 text-gray-500 cursor-pointer hover:underline">
                  {post.likedByUsers?.length}{" "}
                  {post.likedByUsers?.length === 1 ||
                  post.likedByUsers?.length === 0
                    ? "appreciation"
                    : "appreciations"}
                </p>
              }
              likedByUsers={post.likedByUsers || []}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="cursor-pointer">
              {post.comments?.find((comment) => comment.user?.id === userId) !==
              undefined ? (
                <div className="text-blue-600">
                  <RemarkFilledIcon />
                </div>
              ) : (
                <RemarkLineIcon />
              )}
            </div>
            <RemarkList
              dialogButton={
                <p className="text-sm text-gray-500 cursor-pointer hover:underline">
                  {post.comments?.length}{" "}
                  {post.comments?.length === 1 || post.comments?.length === 0
                    ? "remark"
                    : "remarks"}
                </p>
              }
              comments={post.comments || []}
            />
          </div>

          <div
            className="ml-auto cursor-pointer"
            onClick={handleBookmarkIconClick}
          >
            {isSaved ? (
              <div className="text-cyan-600">
                <BookmarkFilledIcon />
              </div>
            ) : (
              <BookmarkLineIcon />
            )}
          </div>
        </CardFooter>

        <RemarkSubmissionField postId={post.id || 0} />
      </Card>
    </div>
  );
};

export default PostCard;
