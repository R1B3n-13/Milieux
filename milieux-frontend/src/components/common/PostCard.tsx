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
import months from "@/utils/months";
import DiamondQuestionIcon from "../icons/DiamondQuestionIcon";
import TidbitsDialog from "./TidbitsDialog";
import { useState } from "react";
import Link from "next/link";
import MarkdownRenderer from "./MarkdownRenderer";
import VideoPlayer from "./VideoPlayer";
import EnlargeableImageWrapper from "./EnlargeableImageWrapper";
import PostText from "./PostText";

const PostCard = ({
  post,
  userId,
  isSaved,
}: {
  post: z.infer<typeof PostSchema>;
  userId: number;
  isSaved: boolean;
}) => {
  const [isSafe, setIsSafe] = useState<boolean>(false);

  const handleLoveIconClick = async () => {
    await appreciatePost(post.id);
    revalidateAppreciation();
  };

  const handleBookmarkIconClick = async () => {
    await bookmarkPost(post.id);
    revalidateBookmark();
  };

  const toggleIsSafe = () => {
    setIsSafe(!isSafe);
  };

  let date = null;
  if (post.createdAt) {
    date = new Date(post.createdAt);
  }

  return (
    <div className="flex transition-all">
      <Card className="bg-white shadow-md w-full">
        <CardHeader className="pb-1">
          <div className="flex gap-4">
            <div className="cursor-pointer">
              {post.user?.isStoreLandingPage ? (
                <a href={`/ecomm?id=${post.user.id}`}>
                  <Avatar>
                    <AvatarImage src={post.user?.dp as string} />
                    <AvatarFallback className="text-5xl text-gray-500">
                      <AvatarIcon />
                    </AvatarFallback>
                  </Avatar>
                </a>
              ) : (
                <Link
                  href={
                    post.user?.id === userId
                      ? "/persona"
                      : `/persona/${post.user?.id}`
                  }
                >
                  <Avatar>
                    <AvatarImage src={post.user?.dp as string} />
                    <AvatarFallback className="text-5xl text-gray-500">
                      <AvatarIcon />
                    </AvatarFallback>
                  </Avatar>
                </Link>
              )}
            </div>

            <div>
              {post.user?.isStoreLandingPage ? (
                <a href={`/ecomm?id=${post.user.id}`}>
                  <CardTitle className="mt-1 font-semibold text-slate-700 cursor-pointer">
                    {post.user?.name}
                  </CardTitle>
                </a>
              ) : (
                <Link
                  href={
                    post.user?.id === userId
                      ? "/persona"
                      : `/persona/${post.user?.id}`
                  }
                >
                  <CardTitle className="mt-1 font-semibold text-slate-700 cursor-pointer">
                    {post.user?.name}
                  </CardTitle>
                </Link>
              )}

              <CardDescription
                className="mt-1 cursor-default"
                suppressHydrationWarning
              >
                {date?.getDate()} {months[date?.getMonth() || 0]}
                {", "}
                {date?.getFullYear()} {"at"} {date?.getHours()}
                {":"}
                {date?.getMinutes()}
              </CardDescription>
            </div>
            {post.tidbits && (
              <TidbitsDialog
                dialogButton={
                  <div className="w-fit h-fit text-xl p-2 text-emerald-600 ml-auto cursor-pointer rounded-full hover:bg-muted">
                    <DiamondQuestionIcon />
                  </div>
                }
                tidbits={post.tidbits}
              />
            )}
          </div>
        </CardHeader>

        <CardContent className="px-0 py-0">
          {(post.isSafe !== false || isSafe === true) && (
            <div className="flex flex-col">
              {post.text && <PostText text={post.text} />}

              {post.imagePath && (
                <EnlargeableImageWrapper>
                  <div className="flex items-center justify-center mt-1">
                    <Image
                      src={post.imagePath}
                      alt="post image"
                      width={1000}
                      height={0}
                      className="w-full"
                    />
                  </div>
                </EnlargeableImageWrapper>
              )}

              {post.videoPath && (
                <div className="flex items-center justify-center">
                  <VideoPlayer
                    src={post.videoPath}
                    width={1000}
                    className="w-full h-full rounded-none"
                    controls
                    autoPlay={false}
                  />
                </div>
              )}
            </div>
          )}
          {post.isSafe === false && (
            <p
              className="flex w-full h-full items-center justify-center cursor-pointer text-amber-600 hover:underline"
              onClick={toggleIsSafe}
            >
              {isSafe === false
                ? "Sensitive Content. Click to show..."
                : "Click to hide..."}
            </p>
          )}
        </CardContent>

        <CardFooter className="px-6 py-3 flex items-center text-2xl text-slate-700">
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
              userId={userId}
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
              userId={userId}
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
