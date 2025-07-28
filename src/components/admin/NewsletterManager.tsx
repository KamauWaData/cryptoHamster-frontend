import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/integrations/client';
import { Badge } from '@/components/ui/badge';

interface Subscriber {
  id: string;
  email: string;
  status: string;
  subscription_date: string;
  created_at: string;
}

const NewsletterManager: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/newsletter/subscribers/');
      setSubscribers(response.data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching subscribers",
        description: error.response?.data?.detail || error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both subject and content.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await apiClient.post('/newsletter/send-newsletter/', {
        subject: emailSubject,
        content: emailContent,
        recipientType: 'active',
      });

      if (response.status === 200) {
        toast({
          title: "Newsletter sent!",
          description: "Your newsletter has been sent to all active subscribers.",
        });
        setEmailSubject('');
        setEmailContent('');
      } else {
        throw new Error(response.data?.error || "Failed to send newsletter.");
      }
    } catch (error: any) {
      toast({
        title: "Failed to send newsletter",
        description: error.response?.data?.detail || error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const activeSubscribers = subscribers.filter(sub => sub.status === 'active');
  const unsubscribedCount = subscribers.filter(sub => sub.status === 'unsubscribed');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeSubscribers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Unsubscribed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unsubscribedCount.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Newsletter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Enter email content (HTML supported)"
              rows={8}
            />
          </div>
          
          <Button 
            onClick={handleSendNewsletter}
            disabled={isSending}
            className="w-full"
          >
            {isSending ? 'Sending...' : `Send to ${activeSubscribers.length} Active Subscribers`}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subscribers.slice(0, 10).map((subscriber) => (
              <div key={subscriber.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <div className="font-medium">{subscriber.email}</div>
                  <div className="text-sm text-muted-foreground">
                    Subscribed: {new Date(subscriber.subscription_date).toLocaleDateString()}
                  </div>
                </div>
                <Badge variant={subscriber.status === 'active' ? 'default' : 'secondary'}>
                  {subscriber.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManager;