import React, { useEffect, useState} from "react";
import { useLocation } from 'react-router-dom';
import { apiClient } from "@/integrations/client";
import layout from '@/components/layout/Layout';
import Layout from "@/components/layout/Layout";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchResults: React.FC = () => {
    const query = useQuery().get('query') || '';
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query) return;
        setLoading(true);
        apiClient
            .get(`/articles/search/?query=${encodeURIComponent(query)}`)
            .then(res => setResults(res.data))
            .catch(() => setError('Failed to fetch search results'))
            .finally(() => setLoading(false));
    }, [query]);

    return (
      <Layout>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && results.length === 0 && <p>No results found.</p>}
        <ul>
          {results.map(article => (
            <li key={article.id} className="mb-4">
              <a href={`/article/${article.id}`} className="text-lg font-semibold hover:underline">{article.title}</a>
              <p className="text-gray-600">{article.excerpt}</p>
            </li>
          ))}
        </ul>
      </div>

    </Layout>
    );
};

export default SearchResults;