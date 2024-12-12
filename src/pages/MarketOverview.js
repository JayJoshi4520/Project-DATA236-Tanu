import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './MarketOverview.css';

const MarketOverview = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [marketData, setMarketData] = useState({
    sp500: { 
      value: 6088.76, 
      change: '+1.2%',
      data: [] 
    },
    nasdaq: { 
      value: 19854.69, 
      change: '+0.8%',
      data: [] 
    },
    dowJones: { 
      value: 44634.44, 
      change: '+0.5%',
      data: [] 
    }
  });

  // Generate mock data
  const generateMockData = (baseValue, timeframe) => {
    const points = [];
    const now = new Date();
    let startTime;
    let interval;
    let numberOfPoints;

    switch(timeframe) {
      case '1D':
        startTime = new Date(now.setHours(9, 30, 0, 0));
        interval = 5 * 60 * 1000; // 5 minutes
        numberOfPoints = 78; // Regular trading day
        break;
      case '1W':
        startTime = new Date(now.setDate(now.getDate() - 7));
        interval = 15 * 60 * 1000; // 15 minutes
        numberOfPoints = 5 * 26; // 5 trading days
        break;
      case '1M':
        startTime = new Date(now.setMonth(now.getMonth() - 1));
        interval = 24 * 60 * 60 * 1000; // 1 day
        numberOfPoints = 22; // Average trading days in a month
        break;
      case '1Y':
        startTime = new Date(now.setFullYear(now.getFullYear() - 1));
        interval = 7 * 24 * 60 * 60 * 1000; // 1 week
        numberOfPoints = 52; // Weeks in a year
        break;
      default:
        startTime = new Date(now.setHours(9, 30, 0, 0));
        interval = 5 * 60 * 1000;
        numberOfPoints = 78;
    }

    let currentTime = startTime.getTime();
    let currentValue = baseValue;

    for (let i = 0; i < numberOfPoints; i++) {
      const randomChange = (Math.random() - 0.5) * 0.002; // Smaller random changes
      currentValue = currentValue * (1 + randomChange);
      points.push([currentTime, currentValue]);
      currentTime += interval;
    }

    return points;
  };

  const calculateChange = (data) => {
    if (!data || data.length < 2) return '+0.00%';
    const firstPrice = data[0][1];
    const lastPrice = data[data.length - 1][1];
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const updateMarketData = () => {
    try {
      const sp500Data = generateMockData(6088.76, selectedTimeframe);
      const nasdaqData = generateMockData(19854.69, selectedTimeframe);
      const dowData = generateMockData(44634.44, selectedTimeframe);

      if (sp500Data.length && nasdaqData.length && dowData.length) {
        setMarketData({
          sp500: {
            value: sp500Data[sp500Data.length - 1][1].toFixed(2),
            change: calculateChange(sp500Data),
            data: sp500Data
          },
          nasdaq: {
            value: nasdaqData[nasdaqData.length - 1][1].toFixed(2),
            change: calculateChange(nasdaqData),
            data: nasdaqData
          },
          dowJones: {
            value: dowData[dowData.length - 1][1].toFixed(2),
            change: calculateChange(dowData),
            data: dowData
          }
        });
      }
    } catch (error) {
      console.error('Error updating market data:', error);
    }
  };

  useEffect(() => {
    updateMarketData();
    const interval = setInterval(updateMarketData, 60000);
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const chartOptions = {
    chart: {
      backgroundColor: '#1E1E1E',
      height: 500,
      animation: true,
      style: {
        fontFamily: 'Arial, sans-serif'
      }
    },
    title: {
      text: 'Market Indices',
      style: { color: '#FFFFFF' }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        style: { color: '#808080' },
        format: selectedTimeframe === '1D' ? '{value:%H:%M}' : 
               selectedTimeframe === '1W' ? '{value:%a %H:%M}' :
               '{value:%Y-%m-%d}'
      },
      gridLineColor: '#333333',
      crosshair: true
    },
    yAxis: {
      title: {
        text: 'Points',
        style: { color: '#808080' }
      },
      labels: { style: { color: '#808080' } },
      gridLineColor: '#333333'
    },
    series: [{
      name: 'S&P 500',
      data: marketData.sp500.data,
      color: '#4CAF50',
      lineWidth: 2
    }, {
      name: 'NASDAQ',
      data: marketData.nasdaq.data,
      color: '#FFA726',
      lineWidth: 2
    }, {
      name: 'DOW JONES',
      data: marketData.dowJones.data,
      color: '#2196F3',
      lineWidth: 2
    }],
    legend: {
      enabled: true,
      itemStyle: { color: '#808080' },
      itemHoverStyle: { color: '#FFFFFF' }
    },
    tooltip: {
      backgroundColor: '#1E1E1E',
      style: { color: '#FFFFFF' },
      xDateFormat: selectedTimeframe === '1D' ? '%H:%M:%S' : 
                  selectedTimeframe === '1W' ? '%A, %b %e, %H:%M' :
                  '%Y-%m-%d',
      shared: true,
      split: false
    },
    credits: { enabled: false }
  };

  return (
    <div className="market-overview">
      <div className="market-indices-grid">
        <div className={`index-card ${parseFloat(marketData.sp500.change) >= 0 ? 'positive' : 'negative'}`}>
          <h2>S&P 500</h2>
          <div className="index-value">{marketData.sp500.value}</div>
          <div className="index-change">{marketData.sp500.change}</div>
        </div>
        <div className={`index-card ${parseFloat(marketData.nasdaq.change) >= 0 ? 'positive' : 'negative'}`}>
          <h2>NASDAQ</h2>
          <div className="index-value">{marketData.nasdaq.value}</div>
          <div className="index-change">{marketData.nasdaq.change}</div>
        </div>
        <div className={`index-card ${parseFloat(marketData.dowJones.change) >= 0 ? 'positive' : 'negative'}`}>
          <h2>DOW JONES</h2>
          <div className="index-value">{marketData.dowJones.value}</div>
          <div className="index-change">{marketData.dowJones.change}</div>
        </div>
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

      <div className="chart-container">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default MarketOverview; 