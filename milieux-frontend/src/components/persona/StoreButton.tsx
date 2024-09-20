import React from "react";
import { getUserFromAuthToken } from "@/services/userService";
import { getStoreById } from "@/services/eComm/storeService";
import StoreIcon from "../icons/StoreIcon";

const StoreButton = async ({ id }: { id: number | null | undefined }) => {
  const loggedInUserResponse = await getUserFromAuthToken();
  let storeResponse;

  if (loggedInUserResponse.success) {
    if (!id) {
      storeResponse = await getStoreById(loggedInUserResponse.user.id);
    } else {
      storeResponse = await getStoreById(id);
    }
  }

  return (
    <div className="w-32">
      {!id && storeResponse?.status === 404 && (
        <a
          href="https://example.com"
          className="inline-block w-full py-[0.4rem] bg-orange-600 text-white font-medium text-center rounded-full hover:bg-orange-500"
        >
          <div className="flex items-center gap-1 justify-center">
            <StoreIcon />
            <span>Create store</span>
          </div>
        </a>
      )}
      {!id && storeResponse?.success && (
        <a
          href="https://example.com"
          className="inline-block w-full py-[0.4rem] bg-orange-600 text-white font-medium text-center rounded-full hover:bg-orange-500"
        >
          <div className="flex items-center gap-1 justify-center">
            <StoreIcon />
            <span>Visit store</span>
          </div>
        </a>
      )}
      {id && storeResponse?.success && storeResponse.data.ui_type && (
        <a
          href="https://example.com"
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
