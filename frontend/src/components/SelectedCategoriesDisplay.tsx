import { products } from '@/constants';
import React from 'react';

interface SelectedCategoriesDisplayProps {
  selectedCategories: string[];
}

const SelectedCategoriesDisplay: React.FC<SelectedCategoriesDisplayProps> = ({ selectedCategories }) => {

    return (
    <div>
      <h3>Selected Categories:</h3>
      <ul>
        {selectedCategories.map((category, index) => (
            <li key={index}>{category}</li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedCategoriesDisplay;
