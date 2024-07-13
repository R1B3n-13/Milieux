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
import RemarkSchema from "@/schemas/remarkSchema";
import Image from "next/image";
import { ScrollArea } from "../ui/ScrollArea";

const RemarkList = ({
  dialogButton,
  comments,
}: {
  dialogButton: JSX.Element;
  comments: z.infer<typeof RemarkSchema>[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogButton}</DialogTrigger>
      <DialogContent className="min-w-fit min-h-36">
        <DialogHeader>
          <div className="flex flex-col gap-2 items-center justify-center">
            <DialogTitle className="text-sm text-gray-500 font-normal pt-2">
              See the remarks of the post
            </DialogTitle>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-6">
          <div className="flex flex-col justify-center">
            {comments &&
              comments.map((comment: z.infer<typeof RemarkSchema>) => (
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

                    <div className="flex flex-col w-[30rem] bg-gray-100 p-3 rounded-lg">
                      <p className="font-semibold cursor-pointer">
                        {comment.user?.name}
                      </p>
                      {comment.text && (
                        <p className="text-slate-700 break-words">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RemarkList;
