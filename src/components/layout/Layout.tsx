
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CryptoTicker from '../cryptoprices/CryptoTicker';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CryptoTicker />
      {/* Main content area */}
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
