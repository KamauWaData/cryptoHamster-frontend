import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import ArticleCard from './ArticleCard';
import { Article } from '@/integrations/types';

interface RelatedArticlesProps {
  articles: Article[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles }) => {
  return (
    <div className="mt-12 max-w-7x1 mx-auto">
      <Separator className="mb-8" />
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((relArticle) => (
            <Link 
              key={relArticle.id} 
              to={`/article/${relArticle.id}`}
              className="block group"
            >
              <ArticleCard 
                id={String(relArticle.id)}
                title={relArticle.title}
                excerpt={relArticle.excerpt}
                category={relArticle.category}
                image_url={relArticle.image_url}
                author={relArticle.author}
                published_date={new Date(relArticle.published_date)}
              />
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-muted-foreground">
            No related articles found
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedArticles;