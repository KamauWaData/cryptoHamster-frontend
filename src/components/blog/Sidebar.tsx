
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import AdBanner from './AdBanner';
import NewsletterSignup from './NewsletterSignup';

interface Article {
  id: string;
  title: string;
  imageUrl: string;
  published_date: Date;
}

interface SidebarProps {
  trendingArticles: Article[];
}

const Sidebar: React.FC<SidebarProps> = ({ trendingArticles }) => {
  return (
    <aside className="space-y-8">
      {/* Ad Banner */}
      <AdBanner type="sidebar" />
      
      {/* Trending Articles */}
      <div>
        <h3 className="text-lg font-bold mb-4 pb-2 border-b">Trending</h3>
        <div className="space-y-4">
          {trendingArticles.map((article, index) => (
            <div key={article.id} className="flex gap-3 items-start">
              <div className="text-xl font-bold text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div>
                <Link to={`/article/${article.id}`}>
                  <h4 className="font-medium hover:text-trendforge-700 transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </Link>
                <time className="text-xs text-muted-foreground">
                  {formatDistance(article.published_date, new Date(), { addSuffix: true })}
                </time>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Newsletter Signup */}
      <NewsletterSignup />
      
      {/* Second Ad Banner */}
      <AdBanner type="sidebar" />
    </aside>
  );
};

export default Sidebar;
