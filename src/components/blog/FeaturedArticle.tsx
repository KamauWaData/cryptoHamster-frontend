
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from 'date-fns';

interface FeaturedArticleProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  author: string;
  published_date: Date;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  id,
  title,
  excerpt,
  category,
  image_url,
  author,
  published_date,
}) => {
  return (
    <div className="relative overflow-hidden group">
      {/* Background image with gradient overlay */}
      <div className="relative h-[70vh] max-h-[480px] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80 z-10" />
        <img
          src={image_url}
          alt={title}
          className="object-cover h-full w-full transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
        <Link to={`/category/${category.toLowerCase()}`}>
          <Badge className="bg-trendforge-600 hover:bg-trendforge-700 mb-4">{category}</Badge>
        </Link>
        <Link to={`/article/${id}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 hover:text-trendforge-300 transition-colors">
            {title}
          </h2>
        </Link>
        <p className="text-white/80 line-clamp-2 mb-4 max-w-2xl">{excerpt}</p>
        <div className="flex items-center text-white/70 text-sm">
          <span>{author}</span>
          <span className="mx-2">•</span>
          <time>{formatDistance(published_date, new Date(), { addSuffix: true })}</time>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;
