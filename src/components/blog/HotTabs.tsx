// HotTabs.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiClient } from '@/integrations/client';
import { Article } from '@/integrations/types';

export default function HotTabs() {
  const [activeTab, setActiveTab] = useState<'editors' | 'hot'>('editors');
  const [editorsArticles, setEditorsArticles] = useState<Article[]>([]);
  const [hotArticles, setHotArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [editorsRes, hotRes] = await Promise.all([
          apiClient.get('articles/editors-picks/'),
          apiClient.get('articles/trending/')
        ]);

        setEditorsArticles(editorsRes.data || []);
        setHotArticles(hotRes.data || []);
       
      } catch (err) {
        setError('Failed to load articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const articles = activeTab === 'editors' ? editorsArticles : hotArticles;

  return (
    <div className="ltr:lg:ml-6 rtl:lg:mr-6 w-full p-4 lg:max-h-24 ">
      <div className="flex flex-row w-full">
        <div
          className={`w-full select-none py-3 text-lg font-medium border-b-2 cursor-pointer text-center rounded-t
            ${activeTab === 'editors'
              ? 'bg-trendforge-500 text-white border-trendforge-500'
              : 'bg-gray-100 border-transparent text-blue-700 hover:bg-gray-200'
            }`}
          onClick={() => setActiveTab('editors')}
        >
          Editor's choice
        </div>
        <div
          className={`w-full select-none py-3 text-lg font-medium border-b-2 cursor-pointer text-center rounded-t
            ${activeTab === 'hot'
              ? 'bg-trendforge-500 text-white border-trendforge-500'
              : 'bg-gray-100 border-transparent text-yellow-700 hover:bg-gray-200'
            }`}
          onClick={() => setActiveTab('hot')}
        >
          Hot stories
        </div>
      </div>

      {loading ? (
        <p className="p-4">Loading...</p>
      ) : error ? (
        <p className="p-4 text-red-500">{error}</p>
      ) : (
        <ul className="p-0 flex flex-col">
          {articles.map((article) => (
            <li
              key={article.id}
              className="text-lg text-gray-900 font-normal border-b border-gray-200 cursor-pointer focus:outline-none hover:bg-bg-subtle transition-colors"
            >
              <div className="px-4 lg:px-0 py-4 lg:py-6">
                <a href={`/article/${article.id}`} className="block transition-transform hover:font-bold hover:scale-105">
                  <div className="font-semibold">{article.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</div>
                </a>
                {/*<div className="text-right pt-xs">
                  <span className="text-uiXsWeak text-fg-subtle">{article.views.toLocaleString()} views</span>
                </div>*/}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


