import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { getLiveStockData } from '../api';
import './StockAnalysis.css';
import { fetchStockDetails } from '../services/api';

const StockAnalysis = () => {
  const [searchSymbol, setSearchSymbol] = useState(() => {
    const localStock = localStorage.getItem("ticker");
    return localStock || 'AAPL';
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [stockInfo, setStockInfo] = useState({
    name: 'Loading...',
    ipoDate: 'Loading...',
    country: 'Loading...',
    marketCap: 'Loading...',
    currency: 'Loading...',
    industry: 'Loading...',
    exchange: 'Loading...'
  });
  const [chartData, setChartData] = useState([]);

  const fetchStockData = async (symbol, timeframe) => {
    try {
      const response = await getLiveStockData(symbol, timeframe);

      const stockDetailResponse = fetchStockDetails(symbol)
      
      stockDetailResponse.then((res) => {
        setStockInfo({
          name: res.name,
          ipoDate: res.ipo,
          country : res.country,
          marketCap : res.marketCapitalization,
          currency : res.currency,
          industry : res.finnhubIndustry,
          exchange: res.exchange,
        })
      })



      if (response?.success && response?.liveData?.length > 0) {
        setChartData(response.liveData.map(item => ({
          date: new Date(item.date).getTime(),
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close
        })));

        // Update stock info if available in response
        if (response.stockInfo) {
          setStockInfo({
            name: response.stockInfo.name || 'N/A',
            ipoDate: response.stockInfo.ipoDate || 'N/A',
            country: response.stockInfo.country || 'N/A',
            marketCap: response.stockInfo.marketCap || 'N/A',
            currency: response.stockInfo.currency || 'N/A',
            industry: response.stockInfo.industry || 'N/A',
            exchange: response.stockInfo.exchange || 'N/A'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchSymbol) return;
    localStorage.setItem("ticker", searchSymbol);
    await fetchStockData(searchSymbol.toUpperCase(), selectedTimeframe);
  };

  const handleTimeframeChange = async (timeframe) => {
    setSelectedTimeframe(timeframe);
    if (searchSymbol) {
      await fetchStockData(searchSymbol.toUpperCase(), timeframe);
    }
  };

  // Set up polling for live updates
  useEffect(() => {
    fetchStockData(searchSymbol, selectedTimeframe);
    if (searchSymbol) {
      const interval = setInterval(() => {
        fetchStockData(searchSymbol.toUpperCase(), selectedTimeframe);
      }, 60000); 

      return () => clearInterval(interval);
    }
  }, [searchSymbol, selectedTimeframe]);

  const chartOptions = {
    chart: {
      backgroundColor: '#1E1E1E',
      height: 500,
      type: 'line',
      animation: true,
      events: {
        load: function() {
          // Store the chart instance for live updates
          const chart = this;
          setInterval(() => {
            if (searchSymbol) {
              fetchStockData(searchSymbol.toUpperCase(), selectedTimeframe)
                .then(newData => {
                  if (chart.series[0]) {
                    chart.series[0].setData(newData);
                  }
                });
            }
          }, 60000); // Update every minute
        }
      }
    },
    title: {
      text: `${stockInfo.name} Stock Price`,
      style: { color: '#FFFFFF' }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        style: { color: '#808080' },
        format: selectedTimeframe === '1D' ? '{value:%H:%M}' : 
               selectedTimeframe === '1W' ? '{value:%e %b}' : 
               '{value:%Y-%m-%d}'
      },
      gridLineColor: '#333333',
      lineColor: '#333333',
      tickColor: '#333333'
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
      name: searchSymbol,
      data: chartData.map(item => [
        item.date,
        item.close // Using close price for line graph
      ]),
      color: '#4CAF50',
      lineWidth: 2,
      marker: {
        enabled: true,
        radius: 2,
        symbol: 'circle'
      }
    }],
    legend: {
      enabled: true,
      itemStyle: { color: '#808080' }
    },
    tooltip: {
      backgroundColor: '#1E1E1E',
      style: { color: '#FFFFFF' },
      borderColor: '#333333',
      borderWidth: 1,
      xDateFormat: selectedTimeframe === '1D' ? '%H:%M:%S' : '%Y-%m-%d',
      shared: true
    },
    plotOptions: {
      line: {
        animation: true,
        states: {
          hover: {
            lineWidth: 3
          }
        }
      }
    },
    rangeSelector: {
      enabled: false
    },
    navigator: {
      enabled: true,
      series: {
        color: '#4CAF50',
        lineWidth: 1
      },
      xAxis: {
        labels: {
          style: { color: '#808080' }
        }
      }
    },
    scrollbar: {
      enabled: true,
      barBackgroundColor: '#333333',
      barBorderColor: '#666666',
      buttonBackgroundColor: '#333333',
      buttonBorderColor: '#666666',
      trackBackgroundColor: '#1E1E1E',
      trackBorderColor: '#666666'
    },
    credits: { enabled: false }
  };

  return (
    <div className="stock-analysis">
      <div className="search-container">
        <input
          type="text"
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value)}
          placeholder="Search stock symbol..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      <div className="stock-info-grid">
        <div className="info-item">
          <label>Name</label>
          <span>{stockInfo.name}</span>
        </div>
        <div className="info-item">
          <label>IPO Date</label>
          <span>{stockInfo.ipoDate}</span>
        </div>
        <div className="info-item">
          <label>Country</label>
          <span>{stockInfo.country}</span>
        </div>
        <div className="info-item">
          <label>Market Capitalization</label>
          <span>{stockInfo.marketCap}</span>
        </div>
        <div className="info-item">
          <label>Currency</label>
          <span>{stockInfo.currency}</span>
        </div>
        <div className="info-item">
          <label>Industry</label>
          <span>{stockInfo.industry}</span>
        </div>
        <div className="info-item">
          <label>Exchange</label>
          <span>{stockInfo.exchange}</span>
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
          constructorType={'stockChart'}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default StockAnalysis;