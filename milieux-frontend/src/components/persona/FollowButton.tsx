"use client";

import { revalidateFollow } from "@/actions/revalidationActions";
import { followUser } from "@/actions/userActions";
import UserSchema from "@/schemas/userSchema";
import { z } from "zod";
import FollowFilledIcon from "../icons/FollowFilledIcon";
import UnfollowFilledIcon from "../icons/UnfollowFilledIcon";

const FollowButton = ({
  user,
  loggedInUser,
}: {
  user: z.infer<typeof UserSchema>;
  loggedInUser: z.infer<typeof UserSchema>;
}) => {
  const handleFollowButtonClick = async () => {
    await followUser(user.id);
    revalidateFollow();
  };

  return (
    <div className="flex items-center w-36 p-[3px] text-slate-800 font-medium text-center rounded-full cursor-pointer z-50 group bg-gradient-to-br from-cyan-600 to-blue-500 group-hover:from-cyan-600 group-hover:to-blue-500 hover:text-white dark:text-white">
      <span
        className="flex items-center justify-center gap-1 text-xl w-full p-1 relative transition-all ease-in duration-75 bg-zinc-100 dark:bg-gray-900 rounded-full group-hover:bg-opacity-0"
        onClick={handleFollowButtonClick}
      >
        {loggedInUser.followings?.find(
          (followingId: number) => followingId === user.id
        ) !== undefined ? (
          <>
            <UnfollowFilledIcon />
            <p className="text-base">Unfollow</p>
          </>
        ) : (
          <>
            <FollowFilledIcon />
            <p className="text-base">Follow</p>
          </>
        )}
      </span>
    </div>
  );
};

export default FollowButton;
