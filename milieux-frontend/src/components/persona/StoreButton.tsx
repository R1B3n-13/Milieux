import { getUserById, getUserFromAuthToken } from "@/services/userService";
import { getStoreById } from "@/services/eComm/storeService";
import StoreIcon from "../icons/StoreIcon";
import UserSchema from "@/schemas/userSchema";
import { z } from "zod";
import StoreCreationButton from "./StoreCreationButton";

const StoreButton = async ({ id }: { id: number | null | undefined }) => {
  let user: z.infer<typeof UserSchema> = {};

  const loggedInUserResponse = await getUserFromAuthToken();
  const loggedInUser: z.infer<typeof UserSchema> = loggedInUserResponse.user;

  if (!id && loggedInUserResponse.success) {
    user = loggedInUserResponse.user;
  } else {
    const userResponse = await getUserById(id);
    if (userResponse.success) {
      user = userResponse.user;
    }
  }

  const storeResponse = await getStoreById(user.id);

  return (
    <div className="w-36 cursor-pointer">
      {user.id === loggedInUser?.id && storeResponse?.status === 404 && (
        <StoreCreationButton user={user} loggedInUser={loggedInUser} />
      )}
      {storeResponse?.success &&
        (user.id === loggedInUser.id ||
          (user.id !== loggedInUser.id && storeResponse.data.ui_type)) && (
          <a
            href={`/ecomm?id=${user.id}`}
            className="flex items-center justify-center w-36 p-[3px] text-slate-800 font-medium text-center rounded-full group bg-gradient-to-br from-purple-600 to-pink-500 group-hover:from-purple-600 group-hover:to-pink-500 hover:text-white"
          >
            <div className="flex items-center gap-1 justify-center w-full p-1 relative transition-all ease-in duration-75 bg-zinc-100 dark:bg-gray-900 rounded-full group-hover:bg-opacity-0">
              <StoreIcon />
              <span>Visit store</span>
            </div>
          </a>
        )}
    </div>
  );
};

export default StoreButton;
