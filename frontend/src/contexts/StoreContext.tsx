'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import dotenv from 'dotenv';

interface StoreContextType {
  storeInfo: any;
  loading: boolean;
  userId: any;
  setStoreInfo: React.Dispatch<React.SetStateAction<any>>; // Expose setStoreInfo to update the storeInfo
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const storeId = 1; // You can set the store id dynamically if needed
  const userId = 1;
  const PORT = process.env.PORT || 'http://localhost:8081/api';

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const response = await fetch(PORT + `/store/find/${storeId}`);
        if (response.ok) {
          const data = await response.json();
          setStoreInfo(data);
        } else {
          console.error('Failed to fetch store info:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching store info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, [storeId]);

  return (
    <StoreContext.Provider value={{ storeInfo, setStoreInfo, loading, userId }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
};
