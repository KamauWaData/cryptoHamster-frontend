
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';


interface ReadMoreProps {
  content: string;
  previewLength?: number;
  className?: string;
}

const ReadMore: React.FC<ReadMoreProps> = ({
  content,
  previewLength = 300,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Strip HTML tags for length calculation but preserve for display
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const textContent = stripHtml(content);
  const isLongContent = textContent.length > previewLength;
  
  // For preview, we'll show first part of HTML content
  const getPreviewContent = () => {
    if (!isLongContent) return content;
    
    // Simple approach: find a good breaking point in the HTML
    const textUntilLimit = textContent.substring(0, previewLength);
    const lastPeriod = textUntilLimit.lastIndexOf('.');
    const breakPoint = lastPeriod > previewLength * 0.7 ? lastPeriod + 1 : previewLength;
    
    // This is a simplified approach - for production, you'd want more sophisticated HTML truncation
    const previewText = textContent.substring(0, breakPoint);
    
    // Find the HTML content that corresponds to this text length
    let htmlLength = 0;
    let htmlIndex = 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // This is a basic implementation - for better results, consider using a library like truncate-html
    return previewText + '...';
  };

  const displayContent = isExpanded || !isLongContent ? content : getPreviewContent();

  
  return (
    <div className={className}>
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: displayContent }}
      />
      
      {isLongContent && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-trendforge-600 hover:text-trendforge-700 hover:bg-trendforge-50"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </Button>
          
        </div>
      )}
    </div>
  );
};

export default ReadMore;
