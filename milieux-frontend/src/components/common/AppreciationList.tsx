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
import Link from "next/link";

const AppreciationList = ({
  dialogButton,
  userId,
  likedByUsers,
}: {
  dialogButton: JSX.Element;
  userId: number;
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
                      <Link
                        href={
                          user?.id === userId
                            ? "/persona"
                            : `/persona/${user?.id}`
                        }
                      >
                        <Avatar>
                          <AvatarImage src={user?.dp as string} />
                          <AvatarFallback className="text-5xl text-gray-500">
                            <AvatarIcon />
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                    )}
                  </div>
                  {user?.isStoreLandingPage ? (
                    <a href={`/ecomm?id=${user.id}`}>
                      <p className="font-semibold cursor-pointer text-slate-700">
                        {user?.name}
                      </p>
                    </a>
                  ) : (
                    <Link
                      href={
                        user?.id === userId
                          ? "/persona"
                          : `/persona/${user?.id}`
                      }
                    >
                      <p className="font-semibold cursor-pointer text-slate-700">
                        {user?.name}
                      </p>
                    </Link>
                  )}
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppreciationList;
