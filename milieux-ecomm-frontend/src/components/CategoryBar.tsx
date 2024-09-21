interface CategoryBarProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ categories, selectedCategories, onCategoryChange }) => {
  return (
      <div className="flex gap-2 flex-col mt-2 pt-2">
          {categories.map((category) => (
              <div key={category}>
                  <label>
                      <input
                          type="checkbox"
                          value={category}
                          checked={selectedCategories.includes(category)}
                          onChange={() => onCategoryChange(category)}
                          className="mr-2"
                      />
                      {category}
                  </label>
              </div>
          ))}
      </div>
  );
};

export default CategoryBar;
