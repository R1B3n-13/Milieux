'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStoreContext } from '@/contexts/StoreContext';
import { Button } from './ui/button';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  imgurl: string;
  store_id: number;
}

const AllProducts: React.FC = () => {
  const { storeInfo } = useStoreContext(); // Access storeInfo from context
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId: number) => {
    try {
      const response = await fetch(`${PORT}/product/delete/${productId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json", // Ensure this header if needed
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', response.status, errorData);
        throw new Error('Failed to delete product');
      }

      // Remove the product from the state after successful deletion
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      console.log('Product removed successfully:', productId);
    } catch (error) {
      console.error('Error removing product:', error);
      setError('Failed to remove product');
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className='flex flex-col w-[40%] gap-4'>
      {products.map((product) => (
        <li key={product.id} className='list-none'>
          <div className='flex flex-row gap-2 px-5 h-20 items-center justify-between w-full max-w-[800px] rounded-xl border-[1px] border-slate-200'>
            <div className='flex gap-2 items-center'>
              <p className='text-slate-400 pr-2'>{product.id}</p>
              <Image src={product.imgurl} alt={product.name} width={40} height={40} />
              {product.name}
            </div>
            <div className='flex items-center'>
              ${product.price}
            </div>
            <div>
              <Button variant='destructive' onClick={() => handleRemoveProduct(product.id)}>
                Remove
              </Button>
            </div>
          </div>
        </li>
      ))}
    </div>
  );
};

export default AllProducts;
