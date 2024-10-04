"use client";

import React, { useState, useEffect } from "react";
import { useStoreContext } from "@/contexts/StoreContext"; // Import the context hook
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import ShoppingCart from "@/components/ShoppingCart";
import CategoryBar from "@/components/CategoryBar";
import ProductList from "@/components/ProductList";

import cartIcon from "@/assets/icons/cart.svg";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import dotenv from "dotenv";
import ShoppingCartContainer from "@/components/ShoppingCartContainer";
dotenv.config();

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  imgurl: string;
  store_id: number;
}

const Page: React.FC = () => {
  const { storeInfo, authToken } = useStoreContext(); // Access storeInfo from context
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]); // To store all unique categories
  const ecommBackend = process.env.NEXT_PUBLIC_ECOMM_BACKEND_URL;
const PORT = ecommBackend ? process.env[ecommBackend] : "http://localhost:8082/api";
  const { setOpen } = useShoppingCart(); // Use the setOpen from the context to open/close cart
  const { getCartItemCount } = useShoppingCart();

  useEffect(() => {
    if (storeInfo) {
      fetchProducts(storeInfo.id);
    }
  }, [storeInfo]);

  const fetchProducts = async (store_id: number) => {
    try {
      const response = await fetch(PORT + `/product/store/${store_id}`, {
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
      setProducts(data);

      // Extract unique categories from the products
      const uniqueCategories = Array.from(
        new Set(data.map((product) => product.category))
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((cat) => cat !== category)
        : [...prevSelectedCategories, category]
    );
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  const filteredProducts = selectedCategories.length
    ? products.filter((product) =>
        selectedCategories.includes(product.category)
      )
    : products;

  const sortedProducts = () => {
    let sorted = [...filteredProducts];

    const parsePrice = (price: any) => {
      return typeof price === "string"
        ? parseFloat(price.slice(1))
        : parseFloat(price);
    };

    if (sortOrder === "lowToHigh") {
      sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOrder === "highToLow") {
      sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    return sorted;
  };

  if (!storeInfo) {
    return <p>Loading store info...</p>;
  }

  return (
    <div>
      <ShoppingCartContainer />

      <div className="container grid grid-cols-4 gap-6 pt-10 pb-16 items-start">
        <div className="col-span-1 bg-white px-4 pb-6 shadow rounded overflow-hidden">
          <div className="divide-y divide-gray-200 space-y-5 p-5">
            <h3 className="text-xl text-gray-800 mb-3 uppercase font-medium">
              Categories
            </h3>
            <CategoryBar
              categories={categories} // Pass unique categories here
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
        <div className="col-span-3">
          <div className="flex items-center mb-4 rounded-xl">
            <select
              className="w-44 px-4 py-3 text-sm text-slate-gray border-gray-300 shadow-sm rounded focus:ring-0 focus:border-gray-100 font-montserrat font-semibold"
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">Default</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
              {/* <option value="latest">Latest</option> */}
            </select>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <p className="text-lg text-gray-700 mb-8">
                {storeInfo.banner_subtext}
              </p>
            <ProductList products={sortedProducts()} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
