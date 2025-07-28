
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/integrations/client';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await apiClient.post('/newsletter/subscribe/', { email });
      toast({
        title: 'Subscribed!',
        description: response.data.message,
      });
      setEmail('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to subscribe.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-secondary p-6 rounded-lg">
      <h3 className="text-lg font-bold mb-3">Stay updated</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Subscribe to our newsletter to receive the latest crypto and tech news directly in your inbox.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          required
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          className="w-full bg-trendforge-700 hover:bg-trendforge-800"
          disabled={isLoading}
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
