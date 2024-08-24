"use client"

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';

interface Product {
  id: string | number;
  imgURL: string;
  name: string;
  price: string;
  category: string;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {products.map((product) => (
        <div key={product.id} className='bg-white p-4 shadow rounded'>
          <Link href={`/products/${product.id}`} className='block'>
            <Image src={product.imgURL} alt={product.name} width={100} height={100} className='w-full h-48 object-cover rounded' />
            <h3 className='text-lg font-medium mt-2'>{product.name}</h3>
            <p className='text-gray-600'>{product.price}</p>
          </Link>
          <div className='flex items-center w-full'>
            <Button className='text-coral-red font-montserrat'>Add to cart</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
