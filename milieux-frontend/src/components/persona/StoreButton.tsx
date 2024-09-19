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
    <div className="mt-4">
      {!id && storeResponse?.status === 404 && (
        <a
          href="https://example.com"
          className="inline-block px-3 py-3 bg-slate-900 text-white font-semibold text-center rounded-full hover:bg-slate-800"
        >
          <div className="flex justify-center text-2xl">
            <StoreIcon />
          </div>
        </a>
      )}
      {!id && storeResponse?.success && (
        <a
          href="https://example.com"
          className="inline-block px-3 py-3 bg-slate-900 text-white font-semibold text-center rounded-full hover:bg-slate-800"
        >
          <div className="flex justify-center text-2xl">
            <StoreIcon />
          </div>
        </a>
      )}
      {id && storeResponse?.success && storeResponse.data.ui_type && (
        <a
          href="https://example.com"
          className="inline-block px-3 py-3 bg-slate-900 text-white font-semibold text-center rounded-full hover:bg-slate-800"
        >
          <div className="flex justify-center text-2xl">
            <StoreIcon />
          </div>
        </a>
      )}
    </div>
  );
};

export default StoreButton;
