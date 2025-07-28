
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface CategoryListProps {
  categories: Category[];
  activeCategory?: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, activeCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link to="/">
        <Button 
          variant={!activeCategory ? "default" : "outline"}
          size="sm"
          className={!activeCategory ? "bg-trendforge-700 hover:bg-trendforge-800" : ""}
        >
          All
        </Button>
      </Link>
      {categories.map((category) => (
        <Link key={category.id} to={`/category/${category.slug}`}>
          <Button 
            variant={activeCategory === category.slug ? "default" : "outline"}
            size="sm"
            className={activeCategory === category.slug ? "bg-trendforge-700 hover:bg-trendforge-800" : ""}
          >
            {category.name} <span className="ml-1 text-xs opacity-70">({category.count})</span>
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
