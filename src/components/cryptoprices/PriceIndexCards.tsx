import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PriceData {
  symbol: string;
  price: number;
  changePercent: number;
  icon?: string;
}

const tokens = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', icon: '/btc.svg' },
  { symbol: 'ETHUSDT', name: 'Ethereum', icon: '/eth.svg' },
  { symbol: 'BNBUSDT', name: 'BNB', icon: '/bnb.svg' },
  { symbol: 'SOLUSDT', name: 'Solana', icon: '/sol.svg' },
  { symbol: 'XRPUSDT', name: 'XRP', icon: '/xrp.svg' },
];

const PriceIndexCards: React.FC = () => {
  const [prices, setPrices] = useState<PriceData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/crypto/prices/');
        setPrices(res.data);
      } catch (err) {
        console.error('Error fetching cached prices:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {tokens.map((token) => {
        const priceInfo = prices.find(p => p.symbol === token.symbol);
        if (!priceInfo) return null;

        return (
          <div
            key={token.symbol}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4 flex flex-col items-center text-center"
          >
            <img src={token.icon} alt={token.name} className="w-8 h-8 mb-2" />
            <p className="font-semibold text-sm">{token.name}</p>
            <p className="text-lg font-bold">${priceInfo.price.toFixed(2)}</p>
            <p
              className={`text-sm font-medium ${
                priceInfo.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {priceInfo.changePercent.toFixed(2)}%
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default PriceIndexCards;