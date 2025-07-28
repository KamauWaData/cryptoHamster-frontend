import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X } from 'lucide-react';
import { apiClient } from '@/integrations/client';

const Header = () => {
  const [categories, setCategories] = useState<{ name: string; path: string }[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/categories/');
        const fetchedCategories = response.data.map((category: { name: string; slug: string }) => ({
          name: category.name,
          path: `/category/${category.slug}`,
        }));
        setCategories(fetchedCategories);
      } catch (error: any) {
        console.error('Error fetching categories:', error.response?.data || error.message);
      }
    };

    fetchCategories();
  }, []);

  // handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchExpanded(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-trendforge-900">
              Crypto<span className="text-trendforge-600">Hamster</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="text-foreground/80 hover:text-trendforge-700 text-sm font-medium transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {/* Search and Mobile Menu Toggle */}
        {/* Search and Mobile Menu Toggle */}
        <div className="flex items-center space-x-2">
          <form
            onSubmit={handleSearchSubmit}
            className={`relative ${
              searchExpanded ? 'w-40 md:w-60' : 'w-0'
            } transition-all duration-300 ease-in-out overflow-hidden`}
          >
            <Input
              placeholder="Search articles..."
              className="h-9 pr-8 rounded-full bg-secondary/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchExpanded(true)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              tabIndex={-1}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </button>
          </form>

          <Button variant="ghost" size="icon" onClick={() => setSearchExpanded(!searchExpanded)}>
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white pb-4">
          <div className="container mx-auto px-4 space-y-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="block py-2 px-4 text-foreground/80 hover:bg-secondary rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;