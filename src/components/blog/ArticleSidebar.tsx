import React from 'react';
import AdSection from './AdSection';

interface ArticleSidebarProps {
  articleUrl: string;
  articleTitle?: string;
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ articleUrl, articleTitle }) => {
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(articleTitle || '');

  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside className="lg:col-span-4 space-y-6">
      <AdSection position="sidebar-top" />
      
      <div className="bg-secondary p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Share this article</h3>
        <div className="flex space-x-4">
          <button
            className="bg-[#1DA1F2] text-white p-2 rounded"
            onClick={() => handleShare('twitter')}
          >
            X
          </button>
          <button
            className="bg-[#4267B2] text-white p-2 rounded"
            onClick={() => handleShare('facebook')}
          >
            Facebook
          </button>
          <button
            className="bg-[#0077B5] text-white p-2 rounded"
            onClick={() => handleShare('linkedin')}
          >
            LinkedIn
          </button>
        </div>
      </div>
      
      <AdSection position="sidebar-bottom" />
    </aside>
  );
};

export default ArticleSidebar;