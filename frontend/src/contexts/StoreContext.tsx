// src/contexts/StoreContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface StoreContextType {
  storeInfo: any;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const storeId = 1; // You can set the store id dynamically if needed

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/store/find/${storeId}`);
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
    <StoreContext.Provider value={{ storeInfo, loading }}>
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
