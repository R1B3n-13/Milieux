import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import AvatarIcon from "@/components/icons/AvatarIcon";
import { Card, CardHeader, CardFooter } from "@/components/ui/Card";
import ImageFilledIcon from "../icons/ImageFilledIcon";
import VideoFilledIcon2 from "../icons/VideoFilledIcon2";
import ArticleFilledIcon from "../icons/ArticleFilledIcon";

const PostCreationCard = () => {
  return (
    <div className="flex ml-auto w-11/12 transition-all">
      <Card className="mt-10 bg-muted shadow-md w-full">
        <CardHeader className="pb-4 mb-0">
          <div className="flex items-center gap-4">
            <div className="cursor-pointer">
              <Avatar>
                <AvatarImage />
                <AvatarFallback className="text-5xl text-gray-500">
                  <AvatarIcon />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className=" w-full cursor-pointer rounded-full text-gray-500 bg-gray-50 border border-gray-400 hover:border-gray-500">
              <div className="flex items center py-2 px-4">
                <p className="mr-1">What’s brewing,</p>
                <p>Sadik Al Barid?</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardFooter className="flex pb-3 pt-0 m-0 items-center justify-center gap-3 text-xl text-slate-700">
          <div className="flex rounded-sm w-full py-2 items-center justify-center cursor-pointer gap-2 hover:bg-white">
            <ImageFilledIcon />
            <p className="text-base">Image</p>
          </div>
          <div className="flex rounded-sm w-full py-2 items-center justify-center cursor-pointer gap-2 hover:bg-white">
            <VideoFilledIcon2 />
            <p className="text-base">Video</p>
          </div>
          <div className="flex rounded-sm w-full py-2 items-center justify-center cursor-pointer gap-2 hover:bg-white">
            <ArticleFilledIcon />
            <p className="text-base">Article</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostCreationCard;
