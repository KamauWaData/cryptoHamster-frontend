import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Article } from '@/integrations/types';
import ArticleForm from './ArticleForm';
import ArticleTable from './ArticleTable';
import { apiClient } from '@/integrations/client';

const ArticleManager: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [newArticle, setNewArticle] = useState<Partial<Article & { image_url?: File | string }>>({
    title: '',
    excerpt: '',
    category: '',
    image_url: '',
    author_name: '',
    content: '',
    status: 'draft',
    is_auto_update: false,
    is_featured: false,
    is_editors_pick: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/articles/');
      setArticles(response.data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching articles',
        description: error.response?.data?.detail || 'Could not fetch articles',
        variant: 'destructive',
      });
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddArticle = async () => {
    if (!newArticle.title || !newArticle.category ) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newArticle.title || '');
      formData.append('excerpt', newArticle.excerpt || '');
      formData.append('category', newArticle.category || '');
      //formData.append('author', newArticle.author_name || '');
      formData.append('content', newArticle.content || '');
      formData.append('status', newArticle.status || 'draft');
      formData.append('is_auto_update', String(newArticle.is_auto_update || false));
      formData.append('is_featured', String(newArticle.is_featured || false));
      formData.append('is_editors_pick', String(newArticle.is_editors_pick || false));
  
      // Append the file if it exists
      if (newArticle.image_url && (newArticle.image_url as any) instanceof File) {
        formData.append('image_url', newArticle.image_url as File);
      }

      const response = await apiClient.post('/articles/', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setArticles([response.data, ...articles]);
      setNewArticle({
        title: '',
        excerpt: '',
        category: '',
        image_url: '',
        author_name: '',
        content: '',
        status: 'draft',
        is_auto_update: false,
        is_featured: false,
        is_editors_pick: false,
      });
      setIsAddingArticle(false);

      toast({
        title: 'Article added',
        description: 'The article has been added successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error adding article',
        description: error.response?.data?.detail || 'Could not add the article',
        variant: 'destructive',
      });
      console.error('Error adding article:', error);
    }
  };


  const handleUpdateArticle = async () => {
    if (!editingArticle) return;

    try {
      const response = await apiClient.put(`/articles/${editingArticle.id}/`, editingArticle);
      setArticles(
        articles.map((article) =>
          article.id === editingArticle.id ? response.data : article
        )
      );
      setEditingArticle(null);

      toast({
        title: 'Article updated',
        description: 'The article has been updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating article',
        description: error.response?.data?.detail || 'Could not update the article',
        variant: 'destructive',
      });
      console.error('Error updating article:', error);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      await apiClient.delete(`/articles/${id}/`);
      setArticles(articles.filter((article) => article.id !== id));

      toast({
        title: 'Article deleted',
        description: 'The article has been deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting article',
        description: error.response?.data?.detail || 'Could not delete the article',
        variant: 'destructive',
      });
      console.error('Error deleting article:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Articles</h2>
        <div className="flex space-x-2">
          <Button
            onClick={fetchArticles}
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
                Refresh Articles
              </>
            )}
          </Button>
          <Button
            onClick={() => setIsAddingArticle(!isAddingArticle)}
            className="bg-trendforge-600 hover:bg-trendforge-700"
          >
            {isAddingArticle ? 'Cancel' : 'Add New Article'}
          </Button>
        </div>
      </div>

      {isAddingArticle && (
        <ArticleForm
          article={newArticle}
          onArticleChange={setNewArticle}
          onSubmit={handleAddArticle}
          onCancel={() => setIsAddingArticle(false)}
          title="Add New Article"
          submitText="Add Article"
        />
      )}

      {editingArticle && (
        <ArticleForm
          article={editingArticle}
          onArticleChange={(updatedArticle) => setEditingArticle
                          ({ ...editingArticle, ...updatedArticle } as Article)}
          onSubmit={handleUpdateArticle}
          onCancel={() => setEditingArticle(null)}
          isEditing={true}
          title="Edit Article"
          submitText="Update Article"
        />
      )}

      <ArticleTable
        articles={articles}
        isLoading={isLoading}
        onEditArticle={setEditingArticle}
        onDeleteArticle={handleDeleteArticle}
      />
    </div>
  );
};

export default ArticleManager;