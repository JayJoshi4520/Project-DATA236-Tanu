import React, { useState, useEffect } from 'react';
import { getLiveStockData } from '../services/api';
import {
  DashboardTitle,
  MarqueeContainer,
  DashboardContainer,
  StockCards,
  ChartsGrid,
  ChartWrapper,
  StockChart,
  PieChart,
  CandlestickChart
} from './styled-components';

const Dashboard = () => {
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN'];

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Starting to fetch data...');

      const results = await Promise.all(
        tickers.map(async (ticker) => {
          console.log(`Fetching data for ${ticker}...`);
          try {
            const data = await getLiveStockData(ticker, '1m');
            console.log(`Received data for ${ticker}:`, data);
            return { ticker, data };
          } catch (error) {
            console.error(`Error fetching ${ticker}:`, error);
            return { ticker, error };
          }
        })
      );

      const newData = {};
      results.forEach(({ ticker, data, error: tickerError }) => {
        if (data) {
          newData[ticker] = data;
        } else {
          console.error(`Failed to load ${ticker}:`, tickerError);
        }
      });

      console.log('Setting live data:', newData);
      setLiveData(newData);
      setError(null);
    } catch (err) {
      console.error('Error in fetchData:', err);
      setError('Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Dashboard mounted, fetching data...');
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading stock data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  // Transform data for StockChart
  const getStockChartData = () => {
    return tickers.map(ticker => ({
      name: ticker,
      data: liveData[ticker]?.liveData?.map(item => [
        new Date(item.date).getTime(),
        item.adjClose
      ]) || []
    }));
  };

  // Transform data for CandlestickChart
  const getCandlestickData = (ticker = 'AAPL') => {
    return liveData[ticker]?.liveData?.map(item => [
      new Date(item.date).getTime(),
      item.open,
      item.high,
      item.low,
      item.close
    ]) || [];
  };

  const testAPI = async () => {
    console.log('Testing API connection...');
    try {
      setLoading(true);
      const data = await getLiveStockData('AAPL', '1m');
      console.log('API Response:', data);
      alert('API call successful! Check console for details.');
    } catch (error) {
      console.error('API Error:', error);
      alert('API call failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DashboardTitle>
        Stock Market Prediction
        <button
          onClick={testAPI}
          style={{
            marginLeft: '20px',
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Test API
        </button>
      </DashboardTitle>

      <MarqueeContainer>
        <Marquee gradient={false} speed={40}>
          {tickers.map(ticker => {
            const currentPrice = liveData[ticker]?.currentPrice;
            const previousPrice = liveData[ticker]?.liveData?.[0]?.close;
            const priceChange = currentPrice && previousPrice 
              ? ((currentPrice - previousPrice) / previousPrice) * 100 
              : 0;

            return (
              <MarqueeItem key={ticker}>
                {ticker} ${currentPrice?.toFixed(2) || '0.00'}
                <span className={`stock-change ${priceChange >= 0 ? 'up' : 'down'}`}>
                  {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
                </span>
              </MarqueeItem>
            );
          })}
        </Marquee>
      </MarqueeContainer>

      <DashboardContainer>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        
        <StockCards data={liveData} />
        <ChartsGrid>
          <ChartWrapper>
            <StockChart data={getStockChartData()} />
          </ChartWrapper>
          <ChartWrapper>
            <PieChart data={liveData} />
          </ChartWrapper>
          <ChartWrapper style={{ gridColumn: '1 / -1' }}>
            <CandlestickChart data={getCandlestickData('AAPL')} />
          </ChartWrapper>
        </ChartsGrid>
      </DashboardContainer>
    </div>
  );
};

export default Dashboard; 