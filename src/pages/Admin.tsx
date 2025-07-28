import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleManager from '@/components/admin/ArticleManager';
import CategoryManager from '@/components/admin/CategoryManager';
import AdManager from '@/components/admin/AdManager';
import AuthorProfileUpdate from '@/components/admin/AuthorProfileUpdate';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Shield, Loader2 } from 'lucide-react';
import { apiClient } from '@/integrations/client'; // Axios client for Django API

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('token/', credentials); // Django JWT login endpoint
      const { access, refresh } = response.data;

      // Save tokens to localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      setIsAuthenticated(true);
      toast({
        title: 'Login Successful',
        description: 'You are now logged in.',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.response?.data?.detail || 'Invalid email or password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    toast({
      title: 'Logged Out',
      description: 'You have been logged out.',
      variant: 'default',
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-trendforge-600" />
          <span className="ml-2">Loading...</span>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Shield className="h-12 w-12 text-trendforge-600 mb-4" />
            <h1 className="text-3xl font-bold text-center">Admin Login</h1>
            <p className="text-muted-foreground text-center mt-2">Login to manage your blog content</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input 
                type="email"
                id="email"
                className="w-full p-2 border rounded-md"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <input 
                type="password"
                id="password"
                className="w-full p-2 border rounded-md"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-trendforge-600 hover:bg-trendforge-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Logging In...
                </>
              ) : (
                'Log In'
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Use your Supabase credentials to login
            </p>
          </form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log Out'}
          </Button>
        </div>
        
        <Tabs defaultValue="articles">
          <TabsList className="mb-8">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="ads">Ad Management</TabsTrigger>
            <TabsTrigger value="author-profile">Author Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles">
            <ArticleManager />
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>
          
          <TabsContent value="ads">
            <AdManager />
          </TabsContent>

          <TabsContent value="author-profile">
            <AuthorProfileUpdate />
          </TabsContent>

          
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
