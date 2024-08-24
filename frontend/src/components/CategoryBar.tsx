import { catergories } from '@/constants';
import React from 'react';

interface CategoryBarProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategories, onCategoryChange }) => {
  const categories = catergories; // Replace with your actual categories

  return (
    <div>
      {categories.map((category, index) => (
        <div key={index} className='space-y-2'>
          <div className='flex items-center'>
            <input
              type="checkbox"
              id={`cat-${index}`}
              className='text-coral-red focus:ring-0 rounded-sm cursor-pointer'
              onChange={() => onCategoryChange(category)}
              checked={selectedCategories.includes(category)}
            />
            <label
              htmlFor={`cat-${index}`}
              className='text-gray-600 ml-3 cursor-pointer'
            >
              {category}
            </label>
            <div className='ml-auto text-gray-600'>(15)</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryBar;
