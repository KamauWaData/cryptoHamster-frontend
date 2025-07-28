
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';

const ArticleLoadingState: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-trendforge-600 mb-4" />
          <p>Loading article...</p>
        </div>
      </div>
    </Layout>
  );
};

export default ArticleLoadingState;
