'use client'
import { useState } from 'react';
import { cn } from '@/lib/utils'; // Make sure you have this utility

interface Category {
  id: string;
  name: string;
}

interface SortOption {
  id: string;
  name: string;
}

const categories: Category[] = [
  { id: 'all', name: 'All' },
  { id: 'apparel', name: 'Apparel & Accessories' },
  { id: 'fabric', name: 'Fabric' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'packaging', name: 'Packaging and Printing' },
];

const sortOptions: SortOption[] = [
  { id: 'popular', name: 'Most Popular' },
  { id: 'hot', name: 'Hot Selling' },
  { id: 'ai', name: 'AI Matched' },
];

interface FilterNavProps {
  selectedCategory?: string;
  selectedSort?: string;
  onCategoryChange?: (category: string) => void;
  onSortChange?: (sort: string) => void;
}

const FilterNav = ({
  selectedCategory = 'all',
  selectedSort = 'popular',
  onCategoryChange,
  onSortChange,
}: FilterNavProps) => {
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [activeSort, setActiveSort] = useState(selectedSort);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  const handleSortChange = (sortId: string) => {
    setActiveSort(sortId);
    onSortChange?.(sortId);
  };

  return (
    <div className="flex flex-col gap-6 max-w-full mx-10 lg:mx-20 sm:mx-10 px-4">
      {/* Main Categories */}
      <div className="flex items-center gap-8 border-b">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={cn(
              'py-4 px-1 relative text-gray-600 hover:text-gray-900 transition-colors',
              activeCategory === category.id && 'text-gray-900'
            )}
          >
            {category.name}
            {activeCategory === category.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-800 to-orange-500" />
            )}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex gap-4">
        {sortOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSortChange(option.id)}
            className={cn(
              'px-4 py-2 rounded-full text-sm transition-colors',
              activeSort === option.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterNav;
