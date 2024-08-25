'use client';

import React, { useState, useEffect } from 'react';
import { useStoreContext } from '@/contexts/StoreContext'; // Import the context hook
import CategoryBar from '@/components/CategoryBar';
import ProductList from '@/components/ProductList';

interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    description: string;
    imgurl: string;
    store_id: number;
}

const Page: React.FC = () => {
    const { storeInfo } = useStoreContext(); // Access storeInfo from context
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<string>('');

    useEffect(() => {
        if (storeInfo) {
            fetchProducts(storeInfo.id);
        }
    }, [storeInfo]);

    const fetchProducts = async (store_id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/product/store/${store_id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products');
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
            // Ensure price is a string and has a currency symbol
            return typeof price === 'string' ? parseFloat(price.slice(1)) : parseFloat(price);
        };

        if (sortOrder === 'lowToHigh') {
            sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        } else if (sortOrder === 'highToLow') {
            sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        }

        return sorted;
    };

    if (!storeInfo) {
        return <p>Loading store info...</p>;
    }

    return (
        <div>
            <div className='container grid grid-cols-4 gap-6 pt-10 pb-16 items-start'>

                <div className='col-span-1 bg-white px-4 pb-6 shadow rounded overflow-hidden'>
                    <div className='divide-y divide-gray-200 space-y-5'>
                        <h3 className='text-xl text-gray-800 mb-3 uppercase font-medium'>Categories</h3>
                        <CategoryBar
                            selectedCategories={selectedCategories}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>
                </div>
                <div className='col-span-3'>
                    <div className='flex items-center mb-4'>
                        <select
                            className='w-44 px-4 py-3 text-sm text-slate-gray border-gray-300 shadow-sm rounded focus:ring-0 focus:border-gray-100 font-montserrat'
                            onChange={(e) => handleSortChange(e.target.value)}
                        >
                            <option value="">Default</option>
                            <option value="lowToHigh">Price: Low to High</option>
                            <option value="highToLow">Price: High to Low</option>
                            <option value="latest">Latest</option>
                        </select>
                    </div>

                    {loading ? (
                        <p>Loading products...</p>
                    ) : error ? (
                        <p className='text-red-500'>{error}</p>
                    ) : (
                        <>
                            <p className="text-lg text-gray-700 mb-8">{storeInfo.banner_subtext}</p>
                            <ProductList products={sortedProducts()} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;
