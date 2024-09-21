"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useStoreContext } from "@/contexts/StoreContext";
import { Button } from "./ui/button";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  imgurl: string;
  store_id: number;
}

interface AllProductsProps {
  refreshProducts: () => void; // Pass refreshProducts as a prop
}

const AllProducts: React.FC<AllProductsProps> = ({ refreshProducts }) => {
  const { storeInfo, authToken } = useStoreContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const PORT = process.env.ECOMM_BACKEND_URL || "http://localhost:8082/api";

  const fetchProducts = useCallback(
    async (store_id: number) => {
      setLoading(true);
      try {
        const response = await fetch(`${PORT}/product/store/${store_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          cache: "no-cache",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: Product[] = await response.json();
        setProducts(data); // Update the product list
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    },
    [PORT]
  );

  useEffect(() => {
    if (storeInfo) {
      fetchProducts(storeInfo.id);
    }
  }, [storeInfo, fetchProducts]);

  const handleRemoveProduct = async (productId: number) => {
    try {
      const response = await fetch(`${PORT}/product/delete/${productId}`, {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        cache: "no-cache",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", response.status, errorData);
        throw new Error("Failed to delete product");
      }

      await fetchProducts(storeInfo.id); // Refresh products locally
      refreshProducts(); // Call refreshProducts to trigger external refresh
    } catch (error) {
      console.error("Error removing product:", error);
      setError("Failed to remove product");
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-col w-full gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <li key={product.id} className="list-none">
            <div className="flex flex-row gap-2 px-5 h-20 items-center justify-evenly w-full rounded-xl border-[1px] border-slate-200">
              <div>
                <p className="text-slate-400 pr-2">{product.id}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Image
                  src={product.imgurl}
                  alt={product.name}
                  width={40}
                  height={40}
                />
                {product.name}
              </div>
              <div className="flex items-center">${product.price}</div>
              <div>
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveProduct(product.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </li>
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default AllProducts;
