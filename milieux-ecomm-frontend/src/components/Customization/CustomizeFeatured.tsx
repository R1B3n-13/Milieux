'use client';

import React, { useEffect, useState } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';
import { Button } from '../ui/button';
import { useStoreContext } from '@/contexts/StoreContext';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import Image from 'next/image';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string;
    imgurl: string;
    store_id: number;
}

const CustomizeFeatured = () => {
    const { storeInfo, setStoreInfo, authToken } = useStoreContext();
    const ecommBackend = process.env.NEXT_PUBLIC_ECOMM_BACKEND_URL;
const PORT = ecommBackend ? process.env[ecommBackend] : "http://localhost:8080/ecomm/api" ;

    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>(storeInfo.top_items || []);

    // Fetch all products
    const fetchAllProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(
              `${PORT}/product/store/${storeInfo.id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
                cache: "no-cache",
              }
            );

            if (response.ok) {
                const data: Product[] = await response.json();
                setProducts(data);
                setSelectedProductIds(storeInfo.top_items || []);
            } else {
                console.error('Failed to fetch products:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch products when the component mounts
    useEffect(() => {
        fetchAllProducts();
    }, []);

    const handleCheckboxChange = (productId: number) => {
        if (selectedProductIds.includes(productId)) {
            setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
        } else {
            setSelectedProductIds([...selectedProductIds, productId]);
        }
    };

    const updateFeaturedProducts = async () => {
        try {
            const response = await fetch(
              `${PORT}/store/update/top-products/${storeInfo.id}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(selectedProductIds),
              }
            );

            if (!response.ok) {
                throw new Error('Failed to update featured products');
            }

            setStoreInfo((prevStoreInfo: any) => ({
                ...prevStoreInfo,
                top_items: selectedProductIds,
            }));
            console.log('Featured products updated successfully!');
        } catch (error: any) {
            console.error('Error updating featured products:', error.message);
        }
    };

    return (
        <>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button className='border-[1.5px] border-gray-200' variant='ghost'>Update Featured Products</Button>
                </DrawerTrigger>

                <DrawerContent className='w-full'>
                    <div className="flex flex-col justify-center items-center mx-auto w-full max-w-sm">
                        <DrawerHeader className='flex justify-center items-center w-full text-sm p-10'>
                            <DrawerTitle>Choose Products to Display</DrawerTitle>
                        </DrawerHeader>

                        <div className='flex flex-col gap-2 justify-center items-center w-full'>
                            {loading ? (
                                <p>Loading products...</p>
                            ) : (
                                products.map((product: Product) => (
                                    <Card key={product.id} className='w-full'>
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={selectedProductIds.includes(product.id)}
                                                        onCheckedChange={() => handleCheckboxChange(product.id)}
                                                    />
                                                    <Image src={product.imgurl} alt={product.name} width={50} height={50} />
                                                </div>
                                                <span>${product.price.toFixed(2)}</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className='pl-5'>{product.name}</p>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        <DrawerFooter className="mt-4">
                            <Button
                                onClick={updateFeaturedProducts}
                                className='bg-black text-white hover:bg-gray-800 hover:text-white'
                                variant="ghost"
                            >
                                Update Featured Products
                            </Button>
                            <DrawerClose asChild>
                                <Button className='ml-2 bg-gray-200 hover:bg-gray-300' variant="ghost">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default CustomizeFeatured;
