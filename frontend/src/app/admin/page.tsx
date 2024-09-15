"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { headerLogo } from '@/assets/images';
import { Button } from '@/components/ui/button';
import AddProduct from '@/components/addProduct';
import AllProducts from '@/components/AllProducts';
import { StoreProvider, useStoreContext } from '@/contexts/StoreContext';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    description: string;
    imgurl: string;
    store_id: number;
}

const Admin: React.FC = () => {
    const { storeInfo, loading } = useStoreContext();
    const [products, setProducts] = useState<Product[]>([]);
    const [isAddItemClicked, setIsAddItemClicked] = useState(false);
    const [showAllItems, setShowAllItems] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const PORT = process.env.PORT || 'http://localhost:8081/api';

    useEffect(() => {
        if (storeInfo) {
            fetchProducts(storeInfo.id);
        }
    }, [storeInfo]);

    const fetchProducts = async (store_id: number) => {
        try {
            const response = await fetch(`${PORT}/product/store/${store_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data: Product[] = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products');
        }
    };

    const handleAddItemClick = () => {
        setIsAddItemClicked(!isAddItemClicked);
    };

    const handleShowItems = () => {
        setShowAllItems(!showAllItems);
    };

    // Function to refresh product list after a new product is added
    const handleProductAdded = () => {
        if (storeInfo) {
            fetchProducts(storeInfo.id);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!storeInfo) {
        return <div>Error loading store information</div>;
    }

    return (
        <div className="flex flex-col px-10">
            <div className="flex flex-row w-full rounded py-10 font-montserrat">
                <div className="w-[40rem]">
                    <div className="text-2xl">Admin Panel</div>
                    <div className="pt-5 text-xl">{storeInfo.name}</div>
                </div>
                <Image src={headerLogo} alt="header logo" height={400} width={400} />
            </div>

            <div>

                <div className='w-full pt-10 flex gap-12 justify-start'>
                    <div className='text-3xl'>Add a Product</div>

                    <div className='text-3xl'>Current Products</div>
                </div>
                <hr className='border-black' />

                <div className='flex flex-row gap-5 py-10 '>
                    <AddProduct onProductAdded={handleProductAdded} />

                    <AllProducts products={products} loading={loading} error={error} onRemoveProduct={fetchProducts} />

                    <div className='flex flex-col gap-2'>
                        <Link href={'/admin/orders'}>
                            <Button className="py-8 w-[20rem] bg-gray-200 text-center text-gray-700">Orders</Button>
                        </Link>
                        <Link href={'/admin/customize'}>
                            <Button className="py-8 w-[20rem] bg-gray-200 text-center text-gray-700">Customize Shop</Button>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Admin;
