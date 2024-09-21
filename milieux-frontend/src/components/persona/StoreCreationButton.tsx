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
      className="inline-block w-full py-[0.4rem] bg-orange-600 text-white font-medium text-center rounded-full hover:bg-orange-500"
    >
      <div className="flex items-center gap-1 justify-center">
        <StoreIcon />
        <span>Create store</span>
      </div>
    </div>
  );
};

export default StoreCreationButton;
