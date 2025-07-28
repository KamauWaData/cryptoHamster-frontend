
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  author: string;
  published_date: Date;
  size?: 'small' | 'medium' | 'large';
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  excerpt,
  category,
  image_url,
  author,
  published_date,
  size = 'medium',
}) => {
  // Ensure published_date is valid
  //const formattedDate = formatDistance(new Date(published_date), new Date(), { addSuffix: true });

  const formattedDate = 
  published_date && !isNaN(new Date(published_date).getTime())
  ?format(new Date(published_date), 'MMMM dd, yyyy')
  : 'Unknown date';
  return (
    <article className="group">
      {/* Image container */}
      <div className="relative overflow-hidden rounded-lg mb-3 aspect-video">
        <Link to={`/article/${id}`}>
          <img
            src={image_url}
            alt={title}
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <Link to={`/category/${category.toLowerCase()}`}>
          <Badge className="absolute top-3 left-3 bg-trendforge-600 hover:bg-trendforge-700">
            {category}
          </Badge>
        </Link>
      </div>

      {/* Content */}
      <Link to={`/article/${id}`}>
        <h3 className={`font-bold text-foreground group-hover:text-trendforge-700 transition-colors ${
          size === 'small' ? 'text-base line-clamp-2' : 
          size === 'medium' ? 'text-xl line-clamp-2' : 
          'text-2xl line-clamp-3'
        }`}>
          {title}
        </h3>
      </Link>

      {size !== 'small' && (
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{excerpt}</p>
      )}

      <div className="mt-2 flex items-center text-xs text-muted-foreground">
        <span>{author}</span>
        <span className="mx-1">•</span>
        <time>{formattedDate}</time>
      </div>
    </article>
  );
};

export default ArticleCard;
