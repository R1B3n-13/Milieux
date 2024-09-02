'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useStoreContext } from '@/contexts/StoreContext'; // Import the context hook
import ReviewCard from '@/components/ReviewCard';

interface Product {
    id: number;
    imgurl: string;
    name: string;
    price: string;
    description: string;
}

interface ProductPageProps {
    params: {
        id: string;
    };
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
    const { id } = params;
    const { storeInfo } = useStoreContext(); // Now you can use the context

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/product/find/${id}`);
                if (!res.ok) {
                    throw new Error('Product not found');
                }
                const data: Product = await res.json();
                setProduct(data);
                fetchReviews();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/review/find/${id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch reviews');
                }
                const data = await res.json();
                setReviews(data);
            } catch (err) {
                console.error('Error fetching reviews:', err);
            }
        }

        fetchProduct();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error || !product) {
        return <p>{error || 'Product not found'}</p>;
    }

    console.log(reviews);


    return (
        <div className='flex flex-col h-full'>
            <div className='flex flex-row items-center justify-center w-full gap-12 py-[100px] min-h-[100%] '>
                <div className='mt-[-10rem]'>
                    <Image
                        src={product.imgurl} // Use imgurl or adjust based on your actual property name
                        alt={product.name}
                        height={500}
                        width={500}
                    />
                </div>
                <div className='flex flex-col gap-2 font-montserrat w-[650px] min-h-[100%]'>
                    <div className='min-h-[50%]'>
                        <p className='text-4xl font-semibold' style={{ color: storeInfo.ui_accent_color }}>{product.name}</p>
                        <p className='font-bold text-xl'>{product.price}</p>
                        <p>{product.description}</p> {/* Fixed typo from desciption to description */}
                        <div className='flex gap-2 w-full'>
                            <Button variant='outline' className='text-white font-bold my-4 w-1/5 hover:bg-blue-700 hover:text-white' style={{ backgroundColor: storeInfo.ui_accent_color }}>
                                Buy Now!
                            </Button>
                            <Button variant='ghost' className='bg-gray-200 text-black font-bold my-4 w-1/5 hover:bg-gray-300'>
                                Add to cart
                            </Button>
                        </div>
                    </div>

                    <div className=' relative gap-2 w-full items-start '>
                        <h3 className='font-semibold text-2xl'>Reviews</h3>
                        <ReviewCard imgurl={''} customerName={''} rating={0} feedback={''} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
