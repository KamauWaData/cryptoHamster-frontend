
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/integrations/client';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use apiClient with POST method and correct endpoint
      const response = await apiClient.post('/newsletter/subscribe/', { email });

      if (response.status === 200) {
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail(''); // Clear the email input field
      } else {
        throw new Error(response.data?.error || "Subscription failed.");
      }
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">Crypto<span className="text-trendforge-300">Hamster</span></span>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Cutting-edge insights on cryptocurrency, blockchain technology, and digital innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  Advertise
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {['Blockchain', 'Crypto', 'NFTs', 'AI', 'Tech', 'Markets'].map((item) => (
                <li key={item}>
                  <Link to={`/category/${item.toLowerCase()}`} className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-3 py-2 text-sm text-foreground bg-white rounded-l-md focus:outline-none"
                required
                disabled={isLoading}
              />
              <button 
                type="submit"
                className="bg-trendforge-600 hover:bg-trendforge-700 px-4 py-2 rounded-r-md text-white text-sm transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? '...' : 'Subscribe'}
              </button>
              </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-primary-foreground/70">
            © {new Date().getFullYear()} CryptoHamster. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {['Twitter', 'Facebook', 'LinkedIn', 'Instagram'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-primary-foreground/70 hover:text-white transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
