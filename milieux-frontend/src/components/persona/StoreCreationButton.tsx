"use client";

import { createStore } from "@/actions/eComm/storeActions";
import { toast } from "sonner";
import StoreIcon from "../icons/StoreIcon";
import { z } from "zod";
import UserSchema from "@/schemas/userSchema";
import { revalidateStore } from "@/actions/revalidationActions";

const StoreCreationButton = ({
  user,
  loggedInUser,
}: {
  user: z.infer<typeof UserSchema>;
  loggedInUser: z.infer<typeof UserSchema>;
}) => {
  const handleCreatingStore = async () => {
    if (user.id === loggedInUser.id && user.isBusiness) {
      const data = {
        id: user.id,
        name: user.name || "",
        category: user.userType.category || "",
      };

      const response = await createStore(data);

      if (response.success) {
        toast.success("Store created successfully!");
        revalidateStore();
      } else {
        toast.error("Uh oh! Something went wrong.");
      }
    }
  };

  return (
    <div
      onClick={handleCreatingStore}
      className="flex items-center justify-center w-36 p-[3px] text-slate-800 font-medium text-center rounded-full group bg-gradient-to-br from-purple-600 to-pink-500 group-hover:from-purple-600 group-hover:to-pink-500 hover:text-white"
    >
      <div className="flex items-center gap-1 justify-center w-full p-1 relative transition-all ease-in duration-75 bg-zinc-100 dark:bg-gray-900 rounded-full group-hover:bg-opacity-0">
        <StoreIcon />
        <span>Create store</span>
      </div>
    </div>
  );
};

export default StoreCreationButton;
