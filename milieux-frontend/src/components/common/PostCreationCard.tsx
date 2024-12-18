import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import AvatarIcon from "@/components/icons/AvatarIcon";
import { Card, CardHeader, CardFooter } from "@/components/ui/Card";
import ImageFilledIcon from "../icons/ImageFilledIcon";
import VideoFilledIcon2 from "../icons/VideoFilledIcon2";
import ArticleFilledIcon from "../icons/ArticleFilledIcon";
import { getUserFromAuthToken } from "@/services/userService";
import PostSubmissionDialog from "./PostSubmissionDialog";
import { z } from "zod";
import UserSchema from "@/schemas/userSchema";
import Link from "next/link";

const PostCreationCard = async () => {
  const response = await getUserFromAuthToken();

  let user: z.infer<typeof UserSchema> = {};

  if (response.success) {
    user = response.user;
  }

  return (
    <div className="flex transition-all w-full">
      <Card className="bg-white shadow-md w-full">
        <CardHeader className="pb-4 mb-0">
          <div className="flex items-center gap-4">
            <div className="cursor-pointer">
              {user?.isStoreLandingPage ? (
                <a href={`/ecomm?id=${user.id}`}>
                  <Avatar>
                    <AvatarImage src={user?.dp as string} />
                    <AvatarFallback className="text-5xl text-gray-500">
                      <AvatarIcon />
                    </AvatarFallback>
                  </Avatar>
                </a>
              ) : (
                <Link href="/persona">
                  <Avatar>
                    <AvatarImage src={user?.dp as string} />
                    <AvatarFallback className="text-5xl text-gray-500">
                      <AvatarIcon />
                    </AvatarFallback>
                  </Avatar>
                </Link>
              )}
            </div>
            <PostSubmissionDialog
              dialogButton={
                <div className=" w-full cursor-pointer rounded-full text-gray-500 bg-gray-50 border border-gray-400 hover:border-gray-600">
                  <div className="flex items center py-2 px-4">
                    <p className="mr-1">What’s brewing,</p>
                    <p>{user.name}?</p>
                  </div>
                </div>
              }
              username={user.name || ""}
            />
          </div>
        </CardHeader>

        <CardFooter className="flex pb-3 pt-0 m-0 items-center justify-center gap-3 text-xl text-slate-700">
          <div className="flex rounded-lg w-full py-2 items-center justify-center cursor-pointer gap-2 hover:bg-muted">
            <div className="text-blue-600">
              <ImageFilledIcon />
            </div>
            <p className="text-base font-semibold">Image</p>
          </div>
          <div className="flex rounded-lg w-full py-2 items-center justify-center cursor-pointer gap-2 hover:bg-muted">
            <div className="text-rose-600">
              <VideoFilledIcon2 />
            </div>
            <p className="text-base font-semibold">Video</p>
          </div>
          <div className="flex rounded-lg w-full py-2 items-center justify-center cursor-pointer gap-2 hover:bg-muted">
            <div className="text-stone-700">
              <ArticleFilledIcon />
            </div>
            <p className="text-base font-semibold">Article</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostCreationCard;
