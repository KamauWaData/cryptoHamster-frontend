import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import FeaturedArticle from '@/components/blog/FeaturedArticle';
import ArticleCard from '@/components/blog/ArticleCard';
import CryptoTicker from '@/components/cryptoprices/CryptoTicker';
import HotTabs from '@/components/blog/HotTabs';
import CategoryList from '@/components/blog/CategoryList';
import Sidebar from '@/components/blog/Sidebar';
import AdBanner from '@/components/blog/AdBanner';
import { Separator } from '@/components/ui/separator';
import { apiClient } from '@/integrations/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Section } from 'lucide-react';


const Index = () => {
  const [featuredArticle, setFeaturedArticle] = useState([]);
  const [categories, setCategories] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [editorPicks, setEditorPicks] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  //Extract Image URL
  const getFirstImageFromContent = (content: string): string => {
            const div = document.createElement('div');
            div.innerHTML = content;
            const img = div.querySelector('img');
            return img ? img.src : '/fallback.jpg';
          };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {

        // Fetch featured article
        const featuredResponse = await apiClient.get('/articles/featured/');
        const mappedArticles = featuredResponse.data.map((article: any) => ({
          ...article,
          image_url: article.image_url || '',  // Map image_url to imageUrl and provide a fallback
        }));
        setFeaturedArticle(mappedArticles);

        // Fetch categories
        const categoriesResponse = await apiClient.get('categories/');
        
        setCategories(categoriesResponse.data);


        // Fetch latest articles
        const latestArticlesResponse = await apiClient.get('articles/latest/');
        const mappedLatestArticles =latestArticlesResponse.data.map((article: any) => ({
          ...article,
          image_url: article.image_url || '',
        }));
        
        setLatestArticles(mappedLatestArticles);

        // Fetch editor's picks
        const editorPicksResponse = await apiClient.get('articles/editors-picks/');
        setEditorPicks(editorPicksResponse.data);

        // Fetch trending articles for the sidebar
        const trendingResponse = await apiClient.get('articles/trending/');
        setTrendingArticles(trendingResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
  }, []);

  return (
    <Layout>
      
      {/* Featured Articles Carousel */}
      <div className='flex flex-row lg:ml-[100px] mt-[55px] lg:mr-[100px] lg:border lg:border-border-default rounded-lg lg:shadow-default lg:p-5'>
      <section className="hidden md:block relative">
        {/*class="flex overflow-hidden shadow-default lg:rounded-none rounded-lg lg:shadow-none border lg:border-0 border-border-default" (new css)*/}

        <Carousel 
            className="min-w-[730px] max-w-[730px] border border-border-default rounded-lg overflow-hidden"
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
          <CarouselContent>
            {featuredArticle.length > 0 ? (
              featuredArticle.map((article) => (
                <CarouselItem key={article.id}>
                  <FeaturedArticle 
                  id={article.id}
                  title={article.title}
                  image_url={article.image_url}  // Pass the mapped imageUrl
                  author={article.author}
                  excerpt={article.excerpt}
                  category={article.category}
                  published_date={article.published_date}
                   />
                </CarouselItem>
              ))
            ) : (
              <div className="text-center text-muted-foreground left:-8">No featured articles available.</div>
            )}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      <section className='flex w-full overflow-hidden shadow-default lg:rounded-none rounded-lg lg:shadow-none border lg:border-0 border-border-default  '>
        <HotTabs />
      </section>
      </div>

      

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <section className="mb-8">
          <CategoryList categories={categories} />
        </section>

        {/* Ad Banner - Leaderboard */}
        <section className="mb-8">
          <AdBanner type="leaderboard" className="mx-auto max-w-4xl" />
        </section>

        {/* Main Content and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Latest Articles */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {latestArticles.map((article) => (
                  
                  <ArticleCard 
                  key={article.id} 
                  {...article}  // Spread all properties of the article object
                  image_url={article.image_url || getFirstImageFromContent(article.content)}
                  publishedDate={new Date(article.published_date)}  // Explicitly pass the formatted date
                  />
                ))}
              
              </div>
            </section>

            {/* Mid-content Ad */}
            <section className="my-8">
              <AdBanner type="rectangle" />
            </section>

            {/* Editor's Picks */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Editor's Picks</h2>
              <div className="grid grid-cols-1 gap-6">
                {editorPicks.map((article) => (
                  <div key={article.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <Link to={`/article/${article.id}`} className="aspect-video overflow-hidden rounded-lg">
                      <img 
                        src={article.image_url} 
                        alt={article.title} 
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="md:col-span-2">
                      <Link to={`/category/${article.category.toLowerCase()}`}>
                        <span className="text-sm text-trendforge-700 font-medium hover:text-trendforge-800 transition-colors">{article.category}</span>
                      </Link>
                      <Link to={`/article/${article.id}`}>
                        <h3 className="text-xl font-bold mt-1 mb-2 hover:text-trendforge-700 transition-colors">{article.title}</h3>
                      </Link>
                      <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>
                    </div>
                    <Separator className="md:hidden my-3" />
                  </div>
                ))}
              </div>
            </section>
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

export default Index;
