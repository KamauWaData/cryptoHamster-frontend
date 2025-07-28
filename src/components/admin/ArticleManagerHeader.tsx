import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';

interface ArticleManagerHeaderProps {
  isUpdating: boolean;
  isAddingArticle: boolean;
  onManualContentRefresh: () => void;
  onToggleAddArticle: () => void;
}

const ArticleManagerHeader: React.FC<ArticleManagerHeaderProps> = ({
  isUpdating,
  isAddingArticle,
  onManualContentRefresh,
  onToggleAddArticle
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Manage Articles</h2>
      <div className="flex space-x-2">
        <Button 
          onClick={onManualContentRefresh}
          variant="outline"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Checking...
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" /> 
              Check for Updates
            </>
          )}
        </Button>
        <Button 
          onClick={onToggleAddArticle}
          className="bg-trendforge-600 hover:bg-trendforge-700"
        >
          {isAddingArticle ? 'Cancel' : 'Add New Article'}
        </Button>
      </div>
    </div>
  );
};

export default ArticleManagerHeader;