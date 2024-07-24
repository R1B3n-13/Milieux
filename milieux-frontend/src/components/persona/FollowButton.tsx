"use client";

import { revalidateFollow } from "@/actions/revalidationActions";
import { followUser } from "@/actions/userActions";
import UserSchema from "@/schemas/userSchema";
import { z } from "zod";
import { Button } from "../ui/Button";

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
    <Button
      variant="outline"
      className="w-32 rounded-full border border-gray-400 text-slate-600 text-md font-medium hover:bg-gray-100 cursor-pointer z-50"
      onClick={handleFollowButtonClick}
    >
      {loggedInUser.followings?.find(
        (followingId: number) => followingId === user.id
      ) !== undefined
        ? "Unfollow"
        : "Follow"}
    </Button>
  );
};

export default FollowButton;
