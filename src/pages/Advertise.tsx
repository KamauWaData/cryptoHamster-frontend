
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, TrendingUp, Users, Eye } from 'lucide-react';

const Advertise = () => {
  const adPackages = [
    {
      name: 'Banner Ad',
      price: '$500/month',
      description: 'Perfect for brand awareness and reaching our engaged audience',
      features: [
        'Leaderboard banner placement',
        '100,000+ monthly impressions',
        'Desktop and mobile visibility',
        'Click-through tracking',
      ],
    },
    {
      name: 'Sponsored Content',
      price: '$650/article',
      description: 'Native advertising that provides value to our readers',
      features: [
        'Custom written article',
        'Editorial review process',
        'Social media promotion',
        'Performance analytics',
      ],
    },
    {
      name: 'Newsletter Sponsorship',
      price: '$600/edition',
      description: 'Direct access to our most engaged subscribers',
      features: [
        '25,000+ newsletter subscribers',
        'Dedicated sponsor section',
        'Logo and brief description',
        'Link to your landing page',
      ],
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Advertise with CryptoHamster</h1>
            <p className="text-xl text-muted-foreground">
              Reach crypto enthusiasts, blockchain developers, and digital innovation leaders
            </p>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-trendforge-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-trendforge-600" />
              </div>
              <h3 className="text-2xl font-bold">15K+</h3>
              <p className="text-muted-foreground">Monthly Readers</p>
            </div>
            <div className="text-center">
              <div className="bg-trendforge-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Eye className="h-8 w-8 text-trendforge-600" />
              </div>
              <h3 className="text-2xl font-bold">100K+</h3>
              <p className="text-muted-foreground">Page Views</p>
            </div>
            <div className="text-center">
              <div className="bg-trendforge-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-trendforge-600" />
              </div>
              <h3 className="text-2xl font-bold">25K+</h3>
              <p className="text-muted-foreground">Newsletter Subscribers</p>
            </div>
          </div>
          
          {/* Advertising Packages */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Advertising Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {adPackages.map((pkg, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <CardTitle>{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                    <div className="text-2xl font-bold text-trendforge-600">{pkg.price}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Why Advertise */}
          <div className="bg-secondary rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Why Advertise with TrendForge?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Targeted Audience</h3>
                <p className="text-muted-foreground mb-4">
                  Our readers are crypto enthusiasts, blockchain developers, investors, and technology leaders actively seeking the latest insights and opportunities.
                </p>
                
                <h3 className="font-semibold mb-2">High Engagement</h3>
                <p className="text-muted-foreground">
                  Our community is highly engaged with average session times of 4+ minutes and low bounce rates, ensuring your message reaches interested audiences.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quality Content</h3>
                <p className="text-muted-foreground mb-4">
                  Your brand will be associated with high-quality, trusted content that our audience relies on for making informed decisions.
                </p>
                
                <h3 className="font-semibold mb-2">Flexible Options</h3>
                <p className="text-muted-foreground">
                  From banner ads to sponsored content, we offer various advertising formats to meet your specific marketing goals and budget.
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Contact our advertising team to discuss custom packages and opportunities
            </p>
            <Button size="lg">
              Contact Our Ad Team
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Advertise;
