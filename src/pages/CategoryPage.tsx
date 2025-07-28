
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ArticleCard from '@/components/blog/ArticleCard';
import CategoryList from '@/components/blog/CategoryList';
import Sidebar from '@/components/blog/Sidebar';
import AdBanner from '@/components/blog/AdBanner';
import { apiClient } from '@/integrations/client';

const CategoryPage: React.FC<{ category: string }> = ({ category }) => { 
  const { slug } = useParams<{ slug: string }>(); // Get the category slug from the URL
  const [categoryName, setCategoryName] = useState('');
  const [articles, setArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

// extract image from img element
const getFirstImageFromContent = (content: string | null): string => {
  if (!content) return '/placeholder.jpg'; // Return placeholder if content is null
  const div = document.createElement('div');
  div.innerHTML = content;
  const img = div.querySelector('img');
  return img ? img.src : '/placeholder.jpg'; // Return placeholder if no image is found
};

  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      try {
        // Fetch articles for the selected category
        const response = await apiClient.get(`/categories/${slug}/`);
        setArticles(response.data);

        // Optionally fetch trending articles for the sidebar
        const trendingResponse = await apiClient.get('/articles/trending/');
        setTrendingArticles(trendingResponse.data);

        // Set the category name (assuming the backend provides it)
        setCategoryName(slug.charAt(0).toUpperCase() + slug.slice(1));
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{categoryName}</h1>
          <CategoryList categories={articles.map((article) => article.category)} activeCategory={slug} />
        </div>

        {/* Ad Banner */}
        <section className="mb-8">
          <AdBanner type="leaderboard" className="mx-auto max-w-4xl" />
        </section>

        {/* Main Content and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles Grid */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <p>Loading articles...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} {...article} 
                  image_url={article.image_url || getFirstImageFromContent(article.content)}/>
                ))}
              </div>
            )}

            {/* Mid-content Ad */}
            <div className="my-8">
              <AdBanner type="rectangle" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar trendingArticles={trendingArticles} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
