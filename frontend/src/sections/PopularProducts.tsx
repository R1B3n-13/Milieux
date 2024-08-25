"use client";
import React, { useEffect, useState } from 'react';
import ProductCard from "@/components/ProductCard";
import { useStoreContext } from '@/contexts/StoreContext'; // Import the context hook

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
    const { storeInfo } = useStoreContext(); // Access storeInfo from context

    // Ensure storeInfo is available
    if (!storeInfo) {
        return <p>Loading store info...</p>;
    }

    const accentColor = storeInfo.ui_accent_color;
    console.log('Top Products:', storeInfo.top_items);

    const [topProducts, setTopProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);  // Loading state

    const fetchTopProducts = async () => {
        setLoading(true);  // Set loading to true before fetching
        try {
            const fetchedProducts: Product[] = [];
            for (const productId of storeInfo.top_items) {
                const response = await fetch(`http://localhost:8080/api/product/find/${productId}`);

                if (response.ok) {
                    const data: Product = await response.json();
                    fetchedProducts.push(data);
                } else {
                    console.error('Failed to fetch product info:', response.statusText);
                }
            }
            setTopProducts(fetchedProducts);  // Set the fetched products
        } catch (error) {
            console.error('Error fetching top products:', error);
        } finally {
            setLoading(false);  // Set loading to false after fetching is complete
        }
    };

    // Fetch top products when component mounts or when storeInfo changes
    useEffect(() => {
        if (storeInfo && storeInfo.top_items) {
            fetchTopProducts();
        }
    }, [storeInfo]);

    // Handling the three possible states: loading, products available, or no products
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
        <div>
            <section id="products" className="max-container max-sm:mt-12">
                <div className="flex flex-col justify-start gap-5">
                    <h2 className="text-4xl font-palanquin font-bold text-slate-gray">
                        Our <span style={{ color: accentColor }}>Top</span> Products
                    </h2>
                </div>

                <div className="mt-16 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-14">
                    {content}
                </div>
            </section>
        </div>
    );
};

export default PopularProducts;
