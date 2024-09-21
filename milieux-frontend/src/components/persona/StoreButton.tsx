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
            className="inline-block w-full py-[0.4rem] bg-orange-600 text-white font-medium text-center rounded-full hover:bg-orange-500"
          >
            <div className="flex items-center gap-1 justify-center">
              <StoreIcon />
              <span>Visit store</span>
            </div>
          </a>
        )}
    </div>
  );
};

export default StoreButton;
