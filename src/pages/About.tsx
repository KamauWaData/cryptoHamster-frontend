
import React from 'react';
import Layout from '@/components/layout/Layout';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About CryptoHamster</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              CryptoHamster is your premier destination for cutting-edge insights on cryptocurrency, blockchain technology, and digital innovation.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-6">
              We believe in democratizing access to high-quality information about the rapidly evolving world of digital assets and blockchain technology. Our mission is to provide our readers with accurate, timely, and actionable insights that help them navigate the complex landscape of cryptocurrency and emerging technologies.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">What We Cover</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Cryptocurrency market analysis and trends</li>
              <li>Blockchain technology developments</li>
              <li>NFT market insights and collection reviews</li>
              <li>AI and emerging technology integration</li>
              <li>DeFi protocols and market opportunities</li>
              <li>Technical analysis and trading strategies</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="mb-6">
              Our team consists of experienced journalists, blockchain developers, and industry experts who are passionate about the future of digital finance. We combine deep technical knowledge with clear, accessible writing to bring you the most important developments in the crypto space.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Why cryptoHamster?</h2>
            <p>
              In a space filled with noise and speculation, CryptoHamster stands out by focusing on factual reporting, thorough analysis, and educational content. We don't just tell you what's happening – we help you understand why it matters and what it means for the future of digital finance.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
