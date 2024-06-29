import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import AvatarIcon from "@/components/icons/AvatarIcon";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Image from "next/image";

const PostCreationCard = () => {
  return (
    <div className="flex ml-auto w-11/12">
      <Card className="mt-10 bg-muted shadow-md">
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
            <div className=" w-full cursor-pointer rounded-full text-gray-500 bg-gray-50 border border-gray-400">
              <div className="flex items center py-2 px-4">
                <p className="mr-1">What’s brewing,</p>
                <p>Sadik Al Barid?</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 m-0">
          <div className="flex items-center justify-center">
            <Image src={""} alt="" width={614} height={0} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostCreationCard;
