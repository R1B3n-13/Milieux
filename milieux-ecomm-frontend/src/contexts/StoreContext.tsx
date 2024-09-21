"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface StoreContextType {
  storeInfo: any;
  loggedUserInfo: any;
  loading: boolean;
  loggedInUserId: any;
  setStoreInfo: React.Dispatch<React.SetStateAction<any>>; // Expose setStoreInfo to update the storeInfo
  authToken: string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const loggedUserInfo = {
    id: 1453,
    isBusiness: true,
    name: "Sadik Al Barid",
    email: "sdas@asdas.ccc",
    dp: "http://res.cloudinary.com/dcr5xry0g/image/upload/v1720890143/ryqwrkx8xdqgaoqennwy.jpg",
    banner:
      "http://res.cloudinary.com/dcr5xry0g/image/upload/v1720892114/gqx5z26ripjkmi2o6fq8.jpg",
    status: "Hungry 🙁",
    intro: "I'm nobody",
    address: "Lake City, Sylhet",
    userType: {
      gender: "",
      category: "Automotive",
    },
    followers: [],
    followings: [1302],
    createdAt: "2024-07-01T20:35:35.459543Z",
  };

  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const storeId = 1453; // You can set the store id dynamically if needed
  const loggedInUserId = loggedUserInfo.id;
  const PORT = process.env.ECOMM_BACKEND_URL || "http://localhost:8082/api";
  const authToken =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmYWtlMTJAZmFrZS5jb20iLCJpc3MiOiJtaWxpZXV4LmNvbSIsImlhdCI6MTcyNjgzOTIwOCwiZXhwIjoxNzI2OTI1NjA4fQ.-Ohz2mcUxMMDO9dI8THBQedc46fLYZql0Ipo7li7IUpaWcXXE8O9XWaMuKekZk6zAxubNtOWHzZtcdOh8vAclQ";

  useEffect(() => {
    const fetchStoreInfo = async () => {
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
  }, [storeId]);

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
