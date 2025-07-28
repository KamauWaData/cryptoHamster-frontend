
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ArticleHeaderProps {
  category: string;
  title: string;
  author: {
    name: string;
    image_url: string;
    bio: string;
  };
  published_date: string;
  last_updated?: string;
  image_url: string;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  category,
  title,
  author,
  published_date,
  last_updated,
  image_url,
}) => {
  return (
    <div className="max-w-6xl mx-auto mb-8">
      {/* Banner Image */}
      {image_url && (
        <div className="relative h-[60vh] max-h-[500px] w-full mb-8 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
          <img 
            src={image_url} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
            <Link to={`/category/${category.toLowerCase()}`}>
              <Badge className="bg-trendforge-600 hover:bg-trendforge-700 mb-4">
                {category}
              </Badge>
            </Link>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {title}
            </h1>
            
            <div className="flex items-center space-x-4">
              <img 
                src={author.image_url} 
                alt={author.name} 
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <div className="text-white">
                <div className="font-medium text-lg">{author.name}</div>
                <div className="text-sm text-white/80">
                  {published_date ? format(new Date(published_date), 'MMMM dd, yyyy') : 'N/A'}
                  {last_updated && (
                    <span className="ml-2">
                      (Updated: {format(new Date(last_updated), 'MMMM dd, yyyy')})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Fallback for articles without banner images */}
      {!image_url && (
        <div className="max-w-4xl mx-auto">
          <Link to={`/category/${category.toLowerCase()}`}>
            <Badge className="bg-trendforge-600 hover:bg-trendforge-700 mb-4">
              {category}
            </Badge>
          </Link>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {title}
          </h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <img 
              src={author.image_url} 
              alt={author.name} 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-medium">{author.name}</div>
              <div className="text-sm text-muted-foreground">
                {published_date ? format(new Date(published_date), 'MMMM dd, yyyy') : 'N/A'}
                {last_updated && (
                  <span className="ml-2">
                    (Updated: {format(new Date(last_updated), 'MMMM dd, yyyy')})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleHeader;
