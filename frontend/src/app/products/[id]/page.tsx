'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useStoreContext } from '@/contexts/StoreContext';
import { useShoppingCart } from '@/contexts/ShoppingCartContext'; // Import the context hook
import ReviewCard from '@/components/ReviewCard';
import dotenv from 'dotenv';
import ShoppingCartContainer from '@/components/ShoppingCartContainer';
import { useRouter } from 'next/navigation'; // Import useRouter

dotenv.config();

interface Product {
    id: number;
    imgurl: string;
    name: string;
    price: number; // Ensure price is a number
    description: string;
}

interface ProductPageProps {
    params: {
        id: string;
    };
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
    const { id } = params;
    const { storeInfo } = useStoreContext();
    const { addToCart } = useShoppingCart(); // Access the context
    const router = useRouter(); // Initialize router

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);

    const PORT = process.env.PORT || 'http://localhost:8081/api';

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(PORT + `/product/find/${id}`);
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
                const res = await fetch(`${PORT}/review/find/${id}`);
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

    const handleAddToCart = () => {
        if (product) {
            const productToAdd = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1, // Default quantity when adding to cart
                imageSrc: product.imgurl,
                imageAlt: product.name,
            };
            addToCart(productToAdd);
        }
    };

    const handleBuyNow = () => {
        if (product) {
            const productToAdd = {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1, // Default quantity when adding to cart
                imageSrc: product.imgurl,
                imageAlt: product.name,
            };
            addToCart(productToAdd);
            router.push('/orders'); // Navigate to orders page after adding to cart
        }
    };

    return (
        <>
        <ShoppingCartContainer />
            <div className='flex flex-col h-full'>
                <div className='flex flex-row items-center justify-center w-full gap-12 py-[100px] min-h-[100%]'>
                    <div className='mt-[-10rem]'>
                        <Image
                            src={product.imgurl}
                            alt={product.name}
                            height={500}
                            width={500}
                        />
                    </div>
                    <div className='flex flex-col gap-2 font-montserrat w-[650px] min-h-[100%]'>
                        <div className='min-h-[50%]'>
                            <p className='text-4xl font-semibold' style={{ color: storeInfo.ui_accent_color }}>{product.name}</p>
                            <p className='font-bold text-xl'>{product.price.toFixed(2)}</p>
                            <p>{product.description}</p>
                            <div className='flex gap-2 w-full'>
                                <Button
                                    variant='outline'
                                    className='text-white font-bold my-4 w-1/5 hover:bg-blue-700 hover:text-white'
                                    style={{ backgroundColor: storeInfo.ui_accent_color }}
                                    onClick={handleBuyNow} // Handle Buy Now
                                >
                                    Buy Now!
                                </Button>
                                <Button
                                    variant='ghost'
                                    className='bg-gray-200 text-black font-bold my-4 w-1/5 hover:bg-gray-300'
                                    onClick={handleAddToCart} // Handle Add to Cart
                                >
                                    Add to cart
                                </Button>
                            </div>
                        </div>

                        <div className='relative gap-2 w-full items-start'>
                            <h3 className='font-semibold text-2xl'>Reviews</h3>

                            {reviews.length === 0 ? (
                                <p className='pt-2'>No reviews yet</p>
                            ) : (
                                reviews.map((review) => (
                                    <ReviewCard key={review.id} imgurl={review.imgurl} customerName={review.customerName} rating={review.rating} feedback={review.feedback} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductPage;
