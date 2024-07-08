import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "../ui/Dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import AvatarIcon from "../icons/AvatarIcon";
import { z } from "zod";
import CommentSchema from "@/schemas/commentSchema";
import Image from "next/image";

const RemarkList = ({
  dialogButton,
  comments,
}: {
  dialogButton: JSX.Element;
  comments: z.infer<typeof CommentSchema>[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogButton}</DialogTrigger>
      <DialogContent className="w-full min-h-36">
        <DialogHeader>
          <div className="flex flex-col gap-2 items-center justify-center">
            <DialogTitle className="text-sm text-gray-500 font-normal">
              See the remarks of the post
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex flex-col justify-center max-h-[calc(100vh-10em)] overflow-y-auto no-scrollbar">
          {comments &&
            comments.map((comment: z.infer<typeof CommentSchema>) => (
              <div key={comment.id} className="mb-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 cursor-pointer">
                    <Avatar>
                      <AvatarImage />
                      <AvatarFallback className="text-4xl text-gray-500">
                        <AvatarIcon />
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex flex-col w-full bg-gray-100 p-3 rounded-lg">
                    <p className="font-semibold cursor-pointer">
                      {comment.user?.name}
                    </p>
                    {comment.text && (
                      <p className="text-slate-700 break-words flex-shrink-0">
                        {comment.text}
                      </p>
                    )}
                    {comment.imagePath && (
                      <div className="flex items-center justify-center pt-3">
                        <Image
                          src={comment.imagePath}
                          alt=""
                          width={500}
                          height={0}
                          className="w-full rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemarkList;
