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
        <CardHeader>
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

        <CardFooter className="flex items-center justify-center gap-32 text-xl text-slate-700">
          <div className="cursor-pointer">
            <ImageFilledIcon />
          </div>
          <div className="cursor-pointer">
            <VideoFilledIcon2 />
          </div>
          <div className="cursor-pointer">
            <ArticleFilledIcon />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostCreationCard;
