import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

interface TickerData {
    symbol: string;
    lastPrice: string;
    priceChangePercent: string;
}

const symbolsToShow = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
  'ADAUSDT', 'DOGEUSDT', 'MATICUSDT', 'DOTUSDT', 'LTCUSDT', 'AVAXUSDT',
  'LINKUSDT', 'TRXUSDT', 'UNIUSDT', 'SHIBUSDT', 'CROUSDT', 'XLMUSDT', 'ETCUSDT', 'FILUSDT', 'ALGOUSDT',
  'WLD', 'ARBUSDT', 'OPUSDT', 'SUIUSDT', 'AAVEUSDT', 'XECUSDT', 'PEPEUSDT', 'TONUSDT', 'INJUSDT'
];

const CryptoTicker: React.FC = () => {
    const [data, setData] = useState<TickerData[]>([]);

    useEffect(() => {
        const fetchTicker = async () => {
            try {
                const res = await axios.get('https://api.binance.com/api/v3/ticker/24hr')
                const filtered = res.data.filter((item: any) =>
                    symbolsToShow.includes(item.symbol)
                );
                setData(filtered);
            } catch (error) {
                console.error('Error fetching crypto data:', error);
            }
        };

        fetchTicker();
        const interval = setInterval(fetchTicker, 10000);
        return () => clearInterval(interval);
    }, []);

    // Duplicate the ticker items for seamless animation
    const tickerItems = data.map((coin) => {
        const change = parseFloat(coin.priceChangePercent);
        return (
            <div key={coin.symbol} className="flex space-x-2 items-center min-w-max px-2">
                <span className="font-semibold">{coin.symbol.replace('USDT', '')}</span>
                <span>${parseFloat(coin.lastPrice).toFixed(2)}</span>
                <span className={change >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {change.toFixed(2)}%
                </span>
            </div>
        );
    });

    return (
        <div className="bg-secondary text-foreground dark:bg-trendforge-900 dark:text-white py-2 overflow-hidden whitespace-nowrap w-full">
            <div className="flex animate-marquee space-x-8 px-4">
                {tickerItems}
                {tickerItems /* duplicate for seamless loop */}
            </div>
        </div>
    );
};

export default CryptoTicker;