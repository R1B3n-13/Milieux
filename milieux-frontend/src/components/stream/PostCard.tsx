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

const PostCard = () => {
  return (
    <div className="flex ml-auto w-11/12 transition-all">
      <Card className="mt-5 bg-white shadow-md">
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
              <CardTitle className="font-semibold text-slate-700 cursor-pointer">
                Sadik Al Barid
              </CardTitle>
              <CardDescription className="mt-1 cursor-default">
                20.03.2024
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <div className="flex flex-col">
            <p className="pb-3 px-6 text-slate-700 font-medium">
              Nice picture!
            </p>
            <div className="flex items-center justify-center">
              <Image
                src={
                  "https://www.theinsuranceemporium.co.uk/blog/wp-content/uploads/2023/09/image-10.png"
                }
                alt="post image"
                width={614}
                height={0}
              />
            </div>
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
