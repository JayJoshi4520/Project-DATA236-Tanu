import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Predictions.css';

const Predictions = () => {
  const [searchSymbol, setSearchSymbol] = useState(() => {
    const localStock = localStorage.getItem("ticker");
    return localStock || 'AAPL';
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [stockData, setStockData] = useState({
    stock: 'AAPL',
    currentPrice: 242.86,
    predictedPrice: 240.96,
    recommendation: 'Hold',
    actualPrices: [],
    predictedPrices: []
  });

  const generateMockData = (basePrice, timeframe) => {
    const points = [];
    const predictedPoints = [];
    const now = new Date();
    let startTime;
    let interval;
    let numberOfPoints;

    switch(timeframe) {
      case '1D':
        startTime = new Date(now.setHours(9, 30, 0, 0));
        interval = 5 * 60 * 1000; // 5 minutes
        numberOfPoints = 78;
        break;
      case '1W':
        startTime = new Date(now.setDate(now.getDate() - 7));
        interval = 15 * 60 * 1000;
        numberOfPoints = 5 * 26;
        break;
      case '1M':
        startTime = new Date(now.setMonth(now.getMonth() - 1));
        interval = 24 * 60 * 60 * 1000;
        numberOfPoints = 22;
        break;
      case '1Y':
        startTime = new Date(now.setFullYear(now.getFullYear() - 1));
        interval = 7 * 24 * 60 * 60 * 1000;
        numberOfPoints = 52;
        break;
      default:
        startTime = new Date(now.setHours(9, 30, 0, 0));
        interval = 5 * 60 * 1000;
        numberOfPoints = 78;
    }

    let currentTime = startTime.getTime();
    let currentPrice = basePrice;
    let predictedPrice = basePrice;

    for (let i = 0; i < numberOfPoints; i++) {
      // Actual price with random movement
      const randomChange = (Math.random() - 0.5) * 0.002;
      currentPrice = currentPrice * (1 + randomChange);
      points.push([currentTime, currentPrice]);

      // Predicted price with slight deviation
      const predictionOffset = (Math.random() - 0.5) * 0.001;
      predictedPrice = currentPrice * (1 + predictionOffset);
      predictedPoints.push([currentTime, predictedPrice]);

      currentTime += interval;
    }

    return { actual: points, predicted: predictedPoints };
  };

  const determineRecommendation = (currentPrice, predictedPrice) => {
    const percentChange = ((predictedPrice - currentPrice) / currentPrice) * 100;
    if (percentChange > 1) return 'Buy';
    if (percentChange < -1) return 'Sell';
    return 'Hold';
  };

  const handleSearch = () => {
    if (searchSymbol) {
      localStorage.setItem("ticker", searchSymbol);
      const basePrice = 100 + Math.random() * 200; // Random base price for demo
      const { actual, predicted } = generateMockData(basePrice, selectedTimeframe);
      
      setStockData({
        stock: searchSymbol.toUpperCase(),
        currentPrice: actual[actual.length - 1][1],
        predictedPrice: predicted[predicted.length - 1][1],
        recommendation: determineRecommendation(
          actual[actual.length - 1][1],
          predicted[predicted.length - 1][1]
        ),
        actualPrices: actual,
        predictedPrices: predicted
      });
    }
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    const { actual, predicted } = generateMockData(stockData.currentPrice, timeframe);
    
    setStockData(prev => ({
      ...prev,
      actualPrices: actual,
      predictedPrices: predicted,
      currentPrice: actual[actual.length - 1][1],
      predictedPrice: predicted[predicted.length - 1][1]
    }));
  };

  useEffect(() => {
    if(searchSymbol){
      handleSearch()
    }else{

      const { actual, predicted } = generateMockData(242.86, '1D');
      setStockData(prev => ({
        ...prev,
        actualPrices: actual,
        predictedPrices: predicted,
        currentPrice: actual[actual.length - 1][1],
        predictedPrice: predicted[predicted.length - 1][1]
      }));
    }

  }, []);

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
      text: `${stockData.stock} Stock Price Prediction`,
      style: { color: '#FFFFFF' }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        style: { color: '#808080' },
        format: selectedTimeframe === '1D' ? '{value:%H:%M}' : 
                selectedTimeframe === '1W' ? '{value:%a, %b %d}' :
                selectedTimeframe === '1M' ? '{value:%b %d}' :
                '{value:%b %Y}'
      },
      gridLineColor: '#333333',
      crosshair: true
    },
    yAxis: {
      title: {
        text: 'Price ($)',
        style: { color: '#808080' }
      },
      labels: { style: { color: '#808080' } },
      gridLineColor: '#333333'
    },
    series: [{
      name: 'Actual Price',
      data: stockData.actualPrices,
      color: '#4CAF50',
      lineWidth: 2
    }, {
      name: 'Predicted Price',
      data: stockData.predictedPrices,
      color: '#FFA726',
      lineWidth: 2,
      dashStyle: 'dash'
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
                  selectedTimeframe === '1W' ? '%A, %b %d' :
                  selectedTimeframe === '1M' ? '%B %d, %Y' :
                  '%B %Y',
      shared: true,
      split: false
    },
    credits: { enabled: false }
  };

  return (
    <div className="predictions">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value)}
          placeholder="Search stock symbol..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      <div className="prediction-summary">
        <div className="prediction-grid">
          <div className="summary-card">
            <h3>Stock</h3>
            <p className="value">{stockData.stock}</p>
          </div>
          <div className="summary-card">
            <h3>Current Price</h3>
            <p className="value">${stockData.currentPrice.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h3>Predicted Price</h3>
            <p className="value">${stockData.predictedPrice.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h3>Recommendation</h3>
            <div className={`recommendation-badge ${stockData.recommendation.toLowerCase()}`}>
              {stockData.recommendation}
            </div>
          </div>
        </div>
      </div>

      <div className="timeframe-buttons">
        <button 
          className={selectedTimeframe === '1D' ? 'active' : ''} 
          onClick={() => handleTimeframeChange('1D')}
        >1D</button>
        <button 
          className={selectedTimeframe === '1W' ? 'active' : ''} 
          onClick={() => handleTimeframeChange('1W')}
        >1W</button>
        <button 
          className={selectedTimeframe === '1M' ? 'active' : ''} 
          onClick={() => handleTimeframeChange('1M')}
        >1M</button>
        <button 
          className={selectedTimeframe === '1Y' ? 'active' : ''} 
          onClick={() => handleTimeframeChange('1Y')}
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

export default Predictions; 