"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useStoreContext } from "@/contexts/StoreContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CustomizeFeatured from "@/components/Customization/CustomizeFeatured";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  imgurl: string;
  store_id: number;
}

const PopularProducts: React.FC = () => {
  const { storeInfo, loggedInUserId, setStoreInfo, authToken } =
    useStoreContext();
  const ecommBackend = process.env.NEXT_PUBLIC_ECOMM_BACKEND_URL;
const PORT = ecommBackend ? process.env[ecommBackend] : "http://localhost:8080/ecomm/api" ;

  if (!storeInfo) {
    return <p>Loading store info...</p>;
  }

  const accentColor = storeInfo.ui_accent_color;

  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTopProducts = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const fetchedProducts: Product[] = [];
      for (const productId of storeInfo.top_items) {
        const response = await fetch(PORT + `/product/find/${productId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data: Product = await response.json();
          fetchedProducts.push(data);
        } else {
          console.error("Failed to fetch product info:", response.statusText);
        }
      }
      setTopProducts(fetchedProducts); // Set the fetched products
    } catch (error) {
      console.error("Error fetching top products:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching is complete
    }
  };

  useEffect(() => {
    if (storeInfo && storeInfo.top_items) {
      fetchTopProducts();
    }
  }, [storeInfo]);

  let content;
  if (loading) {
    content = <p>Loading top products...</p>;
  } else if (topProducts.length > 0) {
    content = topProducts.map((product) => (
      <ProductCard key={product.id} {...product} accentColor={accentColor} />
    ));
  } else {
    content = <p>No products available</p>;
  }

  return (
    <div className="flex flex-col items-center pb-4">
      <div>
        <section id="products" className="max-container max-sm:mt-12">
          <div className="flex justify-between w-full">
            <div className="flex flex-col justify-start">
              <h2 className="text-4xl font-palanquin font-bold text-slate-gray">
                <span style={{ color: accentColor }}>Featured</span> Products
              </h2>
              <p className="text-lg text-gray-500">
                Check out our Featured products
              </p>
            </div>

            {storeInfo.id === loggedInUserId && <CustomizeFeatured />}
          </div>

          {topProducts.length > 0 && (
            <div className="mt-16 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-14">
              {content}
            </div>
          )}
          {topProducts.length === 0 && (
            <div className="mt-16 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-14">
              <p>No products available</p>
            </div>
          )}
        </section>
      </div>

      <Link href={"/products"}>
        <Button className="mt-8" variant="outline">
          See more
        </Button>
      </Link>
    </div>
  );
};

export default PopularProducts;
