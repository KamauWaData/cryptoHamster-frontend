
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ArticleErrorStateProps {
  error?: string;
  connectionError?: boolean;
}

const ArticleErrorState: React.FC<ArticleErrorStateProps> = ({ 
  error, 
  connectionError 
}) => {
  if (connectionError) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              Unable to connect to the database. Please check your internet connection or try again later.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-8">
            <Link to="/" className="bg-trendforge-600 text-white px-4 py-2 rounded hover:bg-trendforge-700">
              Go back to homepage
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-center mb-4">Article Not Found</h1>
        <p className="text-center text-muted-foreground mb-8">
          {error || 'The article you are looking for does not exist or has been removed.'}
        </p>
        <div className="flex justify-center">
          <Link to="/" className="bg-trendforge-600 text-white px-4 py-2 rounded hover:bg-trendforge-700">
            Go back to homepage
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default ArticleErrorState;
