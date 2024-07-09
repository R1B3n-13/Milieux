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
import UserSchema from "@/schemas/userSchema";

const AppreciationList = ({
  dialogButton,
  likedByUsers,
}: {
  dialogButton: JSX.Element;
  likedByUsers: z.infer<typeof UserSchema>[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogButton}</DialogTrigger>
      <DialogContent className="w-full min-h-36">
        <DialogHeader>
          <div className="flex flex-col gap-2 items-center justify-center">
            <DialogTitle className="text-sm text-gray-500 font-normal">
              See who appreciated the post
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex flex-col">
          {likedByUsers &&
            likedByUsers.map((user: z.infer<typeof UserSchema>) => (
              <div key={user.id}>
                <div className="flex items-center gap-3">
                  <div className="cursor-pointer">
                    <Avatar>
                      <AvatarImage />
                      <AvatarFallback className="text-4xl text-gray-500">
                        <AvatarIcon />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="cursor-pointer">{user.name}</p>
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppreciationList;
