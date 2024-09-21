"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
  imageAlt: string;
}

interface ShoppingCartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;  // Add clearCart function to the context
  open: boolean;
  setOpen: (open: boolean) => void;
  getCartItemCount: () => number;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(p => p.id === product.id);
      if (existingProductIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += product.quantity;
        return updatedCart;
      } else {
        return [...prevCart, product];
      }
    });
  };

  const removeFromCart = (id: string | number) => {
    setCart((prevCart) => prevCart.filter(product => product.id !== id));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const productIndex = updatedCart.findIndex(p => p.id === id);
      if (productIndex > -1) {
        updatedCart[productIndex].quantity = quantity;
        if (quantity <= 0) {
          return updatedCart.filter(p => p.id !== id);
        }
        return updatedCart;
      }
      return prevCart;
    });
  };

  // Implement clearCart function
  const clearCart = () => {
    setCart([]);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, product) => count + product.quantity, 0);
  };

  return (
    <ShoppingCartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, open, setOpen, getCartItemCount }}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
  }
  return context;
};
