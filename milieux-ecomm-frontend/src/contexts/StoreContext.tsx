"use client";

import getAuthToken from "@/actions/social/authActions";
import { getUserFromAuthToken } from "@/services/social/userService";
import { useSearchParams } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";

interface StoreContextType {
  storeInfo: any;
  loggedUserInfo: any;
  loading: boolean;
  loggedInUserId: any;
  setStoreInfo: React.Dispatch<React.SetStateAction<any>>;
  authToken: string | undefined;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialLoggedUserInfo = {
  id: null,
  isBusiness: false,
  name: "",
  email: "",
  dp: "",
  banner: "",
  status: "",
  intro: "",
  address: "",
  userType: {
    gender: "",
    category: "",
  },
  followers: [],
  followings: [],
  createdAt: "",
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loggedUserInfo, setLoggedUserInfo] = useState(initialLoggedUserInfo);
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const storeId = useSearchParams().get("id");
  const loggedInUserId = loggedUserInfo.id;
  const PORT = process.env.ECOMM_BACKEND_URL || "http://localhost:8082/api";
  const [authToken, setAuthToken] = useState<string | undefined>("");

  useEffect(() => {
    const fetchLoggedUserInfo = async () => {
      await getAuthToken().then(setAuthToken);

      const loggedInUserResponse = await getUserFromAuthToken();

      if (loggedInUserResponse.success) {
        setLoggedUserInfo(loggedInUserResponse.user);
      }
    };

    fetchLoggedUserInfo();
  }, []);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      if (!authToken) return;

      try {
        const response = await fetch(PORT + `/store/find/${storeId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          cache: "no-cache",
        });

        if (response.ok) {
          const data = await response.json();
          setStoreInfo(data);
        } else {
          console.error("Failed to fetch store info:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching store info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, [authToken, storeId]);

  return (
    <StoreContext.Provider
      value={{
        storeInfo,
        setStoreInfo,
        loading,
        loggedInUserId,
        loggedUserInfo,
        authToken,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
};
