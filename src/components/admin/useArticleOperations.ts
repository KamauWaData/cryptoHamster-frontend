import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/integrations/client';
import { Article } from '@/integrations/types';

export const useArticleOperations = () => {
  const { toast } = useToast();

  const handleAddArticle = async (
    newArticle: Partial<Article>,
    articles: Article[],
    setArticles: (articles: Article[]) => void,
    setNewArticle: (article: Partial<Article>) => void,
    setIsAddingArticle: (isAdding: boolean) => void
  ) => {
    if (!newArticle.title || !newArticle.category || !newArticle.author) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const now = new Date().toISOString();
      const articleToAdd: Partial<Article> = {
        ...newArticle,
        published_date: now,
        created_at: now,
        last_updated: now,
      };

      const response = await apiClient.post('/articles/', articleToAdd);
      setArticles([response.data, ...articles]);
      setNewArticle({
        title: '',
        excerpt: '',
        category: '',
        image_url: '',
        author: '',
        content: '',
        status: 'draft',
        is_auto_update: false,
        is_featured: false,
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

  const handleUpdateArticle = async (
    editingArticle: Article,
    articles: Article[],
    setArticles: (articles: Article[]) => void,
    setEditingArticle: (article: Article | null) => void
  ) => {
    try {
      const now = new Date().toISOString();
      const articleToUpdate = {
        ...editingArticle,
        last_updated: now,
      };

      const response = await apiClient.put(`/articles/${editingArticle.id}/`, articleToUpdate);
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

  const handleDeleteArticle = async (
    id: number,
    articles: Article[],
    setArticles: (articles: Article[]) => void
  ) => {
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

  const handleManualContentRefresh = async (
    fetchArticles: () => Promise<void>,
    setIsUpdating: (isUpdating: boolean) => void
  ) => {
    setIsUpdating(true);
    try {
      await fetchArticles();

      toast({
        title: 'Content check completed',
        description: 'Checked for new article content updates',
      });
    } catch (error: any) {
      toast({
        title: 'Error checking content',
        description: error.response?.data?.detail || 'Could not check for content updates',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    handleAddArticle,
    handleUpdateArticle,
    handleDeleteArticle,
    handleManualContentRefresh,
  };
};