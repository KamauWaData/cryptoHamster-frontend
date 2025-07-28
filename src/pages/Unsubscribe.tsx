import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { apiClient } from '@/integrations/client'; // Replace Supabase with Axios or your HTTP client

const Unsubscribe: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const { toast } = useToast();
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      handleTokenUnsubscribe();
    }
  }, [token]);

  const handleTokenUnsubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/newsletter/unsubscribe/', { token });

      if (response.status === 200) {
        setIsUnsubscribed(true);
        toast({
          title: "Successfully unsubscribed",
          description: "You have been removed from our mailing list.",
        });
      } else {
        throw new Error(response.data.error || "Failed to unsubscribe.");
      }
    } catch (error: any) {
      toast({
        title: "Unsubscribe failed",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post('/newsletter/unsubscribe/', { email });

      if (response.status === 200) {
        setIsUnsubscribed(true);
        toast({
          title: "Successfully unsubscribed",
          description: "You have been removed from our mailing list.",
        });
      } else {
        throw new Error(response.data.error || "Failed to unsubscribe.");
      }
    } catch (error: any) {
      toast({
        title: "Unsubscribe failed",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {isUnsubscribed ? 'Unsubscribed' : 'Unsubscribe from Newsletter'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isUnsubscribed ? (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    You have been successfully unsubscribed from our newsletter.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We're sorry to see you go! You can always subscribe again if you change your mind.
                  </p>
                </div>
              ) : token ? (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Processing your unsubscribe request...
                  </p>
                  {isLoading && <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>}
                </div>
              ) : (
                <form onSubmit={handleEmailUnsubscribe} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Enter the email address you used to subscribe to our newsletter.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Unsubscribe;