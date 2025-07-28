
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AdSection from '@/components/blog/AdSection';
import ArticleHeader from '@/components/blog/ArticleHeader';
import ArticleContent from '@/components/blog/ArticleContent';
import AuthorBio from '@/components/blog/AuthorBio';
import ArticleSidebar from '@/components/blog/ArticleSidebar';
import RelatedArticles from '@/components/blog/RelatedArticles';
import ArticleLoadingState from '@/components/blog/ArticleLoadingState';
import ArticleErrorState from '@/components/blog/ArticleErrorState';
import { apiClient } from '@/integrations/client';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Article } from '@/integrations/types';
// Styles for the rich text content
const richTextStyles = `
  .article-content {
    font-family: Georgia, serif;
    line-height: 1.7;
    color: #333;
    
  }
  
  .article-content img {
    max-width: 85%;
    max-height: 300px;
    border-radius: 0.5rem;
    margin: 2rem auto;
    display: block;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .article-content p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
  
  .article-content blockquote {
    border-left: 4px solid #e2e8f0;
    padding-left: 1.5rem;
    font-style: italic;
    margin: 2rem 0;
    font-size: 1.2rem;
    color: #64748b;
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 0.5rem;
  }
  
  .article-content h1, .article-content h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    color: #1e293b;
  }
  
  .article-content h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #334155;
  }
  
  .article-content ul, .article-content ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }
  
  .article-content ul li, .article-content ol li {
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }
  
  .article-content a {
    color: #3b82f6;
    text-decoration: underline;
  }
  
  .article-content a:hover {
    color: #1d4ed8;
  }
  
  .article-content strong {
    font-weight: 600;
  }
  
  .article-content em {
    font-style: italic;
  }
  
  /* Quill editor specific styles */
  .article-content .ql-editor {
    padding: 0;
    font-size: inherit;
    line-height: inherit;
  }
`;

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [editorPicks, setEditorPicks] = useState<any[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState(false);


  const getFirstImageFromContent = (content: string | null): string => {
    if (!content) return '/placeholder.jpg'; // Return placeholder if content is null
    const div = document.createElement('div');
    div.innerHTML = content;
    const img = div.querySelector('img');
    return img ? img.src : '/placeholder.jpg'; // Return placeholder if no image is found
  };

  const [user, setUser] = useState<{ name: string; image_url: string; bio: string } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);
      setConnectionError(false);

      try {
        if (!id) {
          throw new Error('Article ID is required');
        }

        const articleId = Number(id); // Convert id to a number

        // Fetch the main article
        const articleResponse = await apiClient.get(`articles/${articleId}/`);
        setArticle(articleResponse.data);

        // Fetch related articles
        {/* 
        const relatedResponse = await apiClient.get(`articles/?category=${articleResponse.data.category}`);
        setRelatedArticles(relatedResponse.data.filter((related: Article) => related.id !== articleId));*/}
        const response = await apiClient.get(`articles/${id}/related/`);
        const mappedArticles = response.data.map((article: any) => ({
          ...article,
          image_url: article.image_url || getFirstImageFromContent(article.content), // Use fallback logic
        }));
        setRelatedArticles(mappedArticles);
      } catch (err: any) {
        if (err.message === 'Network Error') {
          setConnectionError(true);
        } else {
          setError(err.response?.data?.detail || 'Failed to fetch the article.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();

    const fetchEditorPicks = async () => {
      try {
        const response = await apiClient.get('/articles/editors-picks/');
        setEditorPicks(response.data || []);
      } catch (error) {
        console.error('Error fetching editor picks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEditorPicks();


  }, [id]); //Track route param


  if (isLoading) {
    return <ArticleLoadingState />;
  }
  // Error states
  if (connectionError || error || !article) {
    return <ArticleErrorState error={error} connectionError={connectionError} />;
  }

  // Prepare author data with fallbacks
  const author = article.author ||{
    name:  'Fred',
    image_url: '/authorPlaceholder.jpg', // Fallback image
    bio: 'Fred is a passionate writer and developer, he is also the founder of cryptohamster.',
  };

  // Parse tags from a comma-separated string or use defaults
  const tags = article.tags
    ? typeof article.tags === 'string'
      ? article.tags.split(',').map(tag => tag.trim())
      : article.tags
    : [article.category, 'TrendForge', 'Article'];
  
  return (
    <Layout>
      <style>{richTextStyles}</style>
      <article className="container mx-auto px-4 py-8">
        {/* Top Advertisement */}
        <AdSection position="top" className="mb-8 max-w-4xl mx-auto" />
        
        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Compact Article Header */}
            <div className="mb-8">
              <Link to={`/category/${article.category.toLowerCase()}`}>
                <Badge className="bg-trendforge-600 hover:bg-trendforge-700 mb-4">
                  {article.category}
                </Badge>
              </Link>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {article.title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={author.image_url || '/authorPlaceholder.jpg'} 
                  alt={author.name || 'Fred'} 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium">{author.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {article.published_date ? new Date(article.published_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'N/A'}
                    {article.last_updated && (
                      <span className="ml-2">
                        (Updated: {new Date(article.last_updated).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })})
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Compact Banner Image */}
              {article.image_url && (
                <div className="relative h-[40vh] max-h-[400px] w-full mb-8 rounded-lg overflow-hidden">
                  <img 
                    src={article.image_url} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Article Content */}
            <ArticleContent content={article.content} tags={tags} />

            {/* Author Bio */}
            <AuthorBio author={author} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Editor's Picks */}
            <div className="bg-secondary p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Editor's Picks</h3>
            <div className="space-y-4">
              {editorPicks.map((pick) => (
                <Link 
                  key={pick.id} 
                  to={`/article/${pick.id}`}
                  className="block group"
                >
                  <div className="flex space-x-3">
                    <img 
                      src={pick.image_url} 
                      alt={pick.title}
                      className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <Badge className="text-xs mb-1" variant="outline">
                        {pick.category}
                      </Badge>
                      <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-trendforge-700 transition-colors">
                        {pick.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(pick.published_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
            
            {/* Article Sidebar (existing share buttons and ads) */}
            <ArticleSidebar />
          </div>
        </div>

        {/* Related Articles */}
        <div className="max-w-7xl mx-auto mt-12">
          {<RelatedArticles articles={relatedArticles}
           />}
        </div>
        
        {/* Bottom Advertisement */}
        <AdSection position="bottom" className="mt-12 max-w-4xl mx-auto" />
      </article>
    </Layout>
  );
};
export default ArticlePage;

//const [user, setUser] = useState<{ name: string; image_url: string; bio: string } | null>(null);

