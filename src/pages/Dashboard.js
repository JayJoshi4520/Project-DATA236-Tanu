import React, { useState, useEffect } from 'react';
import { getLiveStockData } from '../api';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsStock from 'highcharts/modules/stock';
import './Dashboard.css';

// Initialize Highcharts modules
HighchartsStock(Highcharts);

const Dashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [searchSymbol, setSearchSymbol] = useState(() => {
    const localStock = localStorage.getItem("ticker");
    return localStock || 'AAPL';
  });
  const [stockData, setStockData] = useState({
    AAPL: { price: 0, change: 0 },
    GOOGL: { price: 0, change: 0 },
    MSFT: { price: 0, change: 0 },
    AMZN: { price: 0, change: 0 },
    META: { price: 0, change: 0 }
  });
  const [selectedStockData, setSelectedStockData] = useState({
    symbol: '',
    chartData: []
  });

  // Add ticker data for the scrolling banner
  const tickerData = [
    { symbol: 'AAPL', price: '0', change: '0%' },
    { symbol: 'GOOGL', price: '0', change: '0%' },
    { symbol: 'MSFT', price: '0', change: '0%' },
    { symbol: 'AMZN', price: '0', change: '0%' },
    { symbol: 'META', price: '0', change: '0%' },
    { symbol: 'TSLA', price: '0', change: '0%' },
    { symbol: 'NVDA', price: '0', change: '0%' },
    { symbol: 'JPM', price: '0', change: '0%' },
  ];

  const handleSearch = async () => {
    if (!searchSymbol) return;
    localStorage.setItem("ticker", searchSymbol);
    try {
      
      const response = await getLiveStockData(searchSymbol.toUpperCase(), selectedTimeframe);
      if (response?.success && response?.liveData?.length > 0) {
        setSelectedStockData({
          symbol: searchSymbol,
          chartData: generateCandlestickData(searchSymbol, selectedTimeframe)
        })
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };


  const renderStockCards = () => {
    return Object.entries(stockData).map(([symbol, data]) => (
      <div key={symbol} className="stock-card">
        <h2>{symbol}</h2>
        <div className={`price ${data.change > 0 ? 'positive' : data.change < 0 ? 'negative' : ''}`}>
          ${(data.price || 0).toFixed(2)}
        </div>
        <div className={`change ${data.change > 0 ? 'positive' : data.change < 0 ? 'negative' : ''}`}>
          {(data.change || 0).toFixed(2)}%
        </div>
      </div>
    ));
  };

  const chartOptions = {
    chart: {
      type: 'line',
      backgroundColor: '#1E1E1E',
      height: 400
    },
    title: {
      text: selectedStockData.symbol ? `${selectedStockData.symbol} Stock Price` : '',
      style: { color: '#FFFFFF' }
    },
    navigator: {
      enabled: true,
      series: {
        color: '#4CAF50',
        lineWidth: 1
      },
      xAxis: {
        labels: {
          style: { color: '#FFFFFF' }
        }
      }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        style: { color: '#FFFFFF' },
        formatter: function() {
          const date = new Date(this.value);
          switch(selectedTimeframe) {
            case '1D':
              return Highcharts.dateFormat('%H:%M', this.value);
            case '1W':
              return Highcharts.dateFormat('%a', this.value);
            case '1M':
              return Highcharts.dateFormat('%d %b', this.value);
            case '1Y':
              return Highcharts.dateFormat('%b %Y', this.value);
          }
        }
      },
      gridLineColor: '#333333',
      tickInterval: (() => {
        switch(selectedTimeframe) {
          case '1D': return 60 * 60 * 1000; // 1 hour
          case '1W': return 24 * 3600 * 1000; // 1 day
          case '1M': return 7 * 24 * 3600 * 1000; // 1 week
          case '1Y': return 30 * 24 * 3600 * 1000; // 1 month
          default: return 60 * 60 * 1000;
        }
      })()
    },
    yAxis: {
      title: { text: 'Price', style: { color: '#808080' } },
      labels: { style: { color: '#808080' } }
    },
    series: [{
      type: 'candlestick',
      name: selectedStockData.symbol,
      data: selectedStockData.chartData,
      upColor: 'green', // Color for bullish candles
      color: '#db0413'
    }],
    credits: { enabled: false }
  };

  // Modify the generateCandlestickData function for better timeframe handling
  const generateCandlestickData = (symbol, timeframe) => {
    const data = [];
    const now = new Date();
    let startTime;
    let interval;
    let points;

    switch(timeframe) {
      case '1D':
        startTime = new Date(now);
        startTime.setHours(9, 30, 0, 0);
        interval = 5 * 60 * 1000; // 5 minutes
        points = 78; // Trading day points
        break;
      case '1W':
        startTime = new Date(now);
        startTime.setDate(now.getDate() - 7);
        startTime.setHours(9, 30, 0, 0);
        interval = 60 * 60 * 1000; // 1 hour
        points = 35; // 7 trading days * 5 points per day
        break;
      case '1M':
        startTime = new Date(now);
        startTime.setMonth(now.getMonth() - 1);
        interval = 24 * 60 * 60 * 1000; // 1 day
        points = 22; // Trading days in a month
        break;
      case '1Y':
        startTime = new Date(now);
        startTime.setFullYear(now.getFullYear() - 1);
        interval = 7 * 24 * 60 * 60 * 1000; // 1 week
        points = 52; // Weeks in a year
        break;
      default:
        return [];
    }

    let basePrice = getBasePrice(symbol);
    let time = startTime.getTime();
    let lastClose = basePrice;

    for (let i = 0; i < points; i++) {
      const date = new Date(time);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      if (!isWeekend || timeframe === '1M' || timeframe === '1Y') {
        const volatility = getVolatility(timeframe);
        const trend = Math.random() - 0.5;
        const open = lastClose;
        const change = basePrice * volatility * trend;
        const high = open + Math.abs(change);
        const low = open - Math.abs(change);
        const close = open + change;

        data.push([
          time,
          roundPrice(open),
          roundPrice(high),
          roundPrice(low),
          roundPrice(close)
        ]);

        lastClose = close;
        basePrice = close;
      }
      time += interval;
    }

    return data;
  };

  

  // Helper functions for better price generation
  const getBasePrice = (symbol) => {
    const prices = {
      'AAPL': 246.81,
      'GOOGL': 175.36,
      'MSFT': 445.90,
      'AMZN': 226.09,
      'META': 613.81,
      'NOW': 1115.00
    };
    return prices[symbol] || 100;
  };

  const getVolatility = (timeframe) => {
    const volatilities = {
      '1D': 0.002,
      '1W': 0.005,
      '1M': 0.01,
      '1Y': 0.02
    };
    return volatilities[timeframe] || 0.002;
  };

  const roundPrice = (price) => {
    return Math.round(price * 100) / 100;
  };

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META'];
        const responses = await Promise.all(
          stocks.map(stock => getLiveStockData(stock, '1D'))
        );

        const newData = { ...stockData };
        responses.forEach((response, index) => {
          if (response?.success && response?.liveData?.length > 0) {
            const latestData = response.liveData[response.liveData.length - 1];
            const prevData = response.liveData[0];
            const priceChange = ((latestData.close - prevData.close) / prevData.close) * 100;

            newData[stocks[index]] = {
              price: latestData.close || 0,
              change: priceChange || 0
            };
          }
        });

        setStockData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };



    fetchData();
    handleSearch()

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [selectedTimeframe]);




  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="ticker-wrap">
        <div className="ticker">
          {[...tickerData, ...tickerData].map((stock, index) => (
            <div key={index} className="ticker-item">
              <span className="ticker-symbol">{stock.symbol}</span>
              <span className="ticker-price">${stock.price}</span>
              <span className={`ticker-change ${parseFloat(stock.change) >= 0 ? 'positive' : 'negative'}`}>
                {stock.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="stock-cards-container">
        {renderStockCards()}
      </div>

      <div className="search-section">
        <div className="search-container">
          <input 
            type="text" 
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            placeholder="Enter stock symbol..." 
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">Search</button>
        </div>

        <div className="timeframe-buttons">
          <button 
            className={selectedTimeframe === '1D' ? 'active' : ''} 
            onClick={() => setSelectedTimeframe('1D')}
          >1D</button>
          <button 
            className={selectedTimeframe === '1W' ? 'active' : ''} 
            onClick={() => setSelectedTimeframe('1W')}
          >1W</button>
          <button 
            className={selectedTimeframe === '1M' ? 'active' : ''} 
            onClick={() => setSelectedTimeframe('1M')}
          >1M</button>
          <button 
            className={selectedTimeframe === '1Y' ? 'active' : ''} 
            onClick={() => setSelectedTimeframe('1Y')}
          >1Y</button>
        </div>
      </div>

      {selectedStockData.symbol && (
        <div className="chart-container">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
