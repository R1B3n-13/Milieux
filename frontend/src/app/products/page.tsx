"use client";

import React, { useState } from 'react';
import CategoryBar from '@/components/CategoryBar';
import ProductList from '@/components/ProductList'; // Ensure you have this component
import { products } from '@/constants'; // Import your products array

const Page: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('');

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((cat) => cat !== category)
        : [...prevSelectedCategories, category]
    );
  };

  // Filter products based on selected categories
  const filteredProducts = selectedCategories.length
    ? products.filter((product) =>
        selectedCategories.includes(product.catergory)
      )
    : products;

  // Sort filtered products based on selected sort order
  const sortedProducts = () => {
    let sorted = [...filteredProducts];

    if (sortOrder === 'lowToHigh') {
      sorted.sort((a, b) => parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1)));
    } else if (sortOrder === 'highToLow') {
      sorted.sort((a, b) => parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1)));
    }
    // You can add more sorting options here if needed

    return sorted;
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

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
            <select className='w-44 px-4 py-3 text-sm text-slate-gray border-gray-300 shadow-sm rounded focus:ring-0 focus:border-gray-100 font-montserrat'
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">Default</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
              <option value="latest">Latest</option>
            </select>
          </div>

          {/* Display sorted products */}
          <ProductList products={sortedProducts()} />
        </div>
      </div>
    </div>
  );
};

export default Page;
