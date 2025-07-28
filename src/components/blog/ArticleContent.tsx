
import React from 'react';
import { Badge } from '@/components/ui/badge';
import AdSection from './AdSection';
import ReadMore from './ReadMore';

interface ArticleContentProps {
  content: string;
  tags: string[];
}

const ArticleContent: React.FC<ArticleContentProps> = ({
  content,
  tags,
}) => {
  return (
    <div className="lg:col-span-8">
      {/* Article Body with Read More functionality */}
      <div className="article-content prose prose-lg max-w-none mb-8 font-black">
        <ReadMore 
          content={content} 
          previewLength={500}
          className="mb-8"
        />
      </div>
      
      {/* Middle Advertisement */}
      <AdSection position="middle" className="my-8" />
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ArticleContent;
