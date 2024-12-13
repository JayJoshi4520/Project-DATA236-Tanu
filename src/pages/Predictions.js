import React, { useState, useEffect } from 'react';
import Highcharts, { stockChart } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Predictions.css';

import Search from '../components/Search';
import { getStockDataPrediction, trainModel } from '../api';
import { AlarmCheck } from 'lucide-react';


const Predictions = () => {
  const [searchSymbol, setSearchSymbol] = useState(() => {
    const localStock = localStorage.getItem("ticker");
    return localStock || 'AAPL';
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [stockData, setStockData] = useState({
    stock: 'AAPL',
    currentPrice: 242.86,
    predictedPrice: 240.96,
    recommendation: 'Hold',
    actualPrices: [],
    predictedPrices: []
  });

  const determineRecommendation = (currentPrice, predictedPrice) => {
    const percentChange = ((predictedPrice - currentPrice) / currentPrice) * 100;
    if (percentChange > 1) return 'Buy';
    if (percentChange < -1) return 'Sell';
    return 'Hold';
  };

  const handleSearch = async() => {
    if (searchSymbol) {
      localStorage.setItem("ticker", searchSymbol);

      const basePrice = 100 + Math.random() * 200; 
      getStockDataPrediction(searchSymbol, "1Y").then((res) => {

        if(res.success){
          const liveData = res.liveData
          const prediction = res.prediction
          const tempLiveData = []
          const tempPredictionData = []
          liveData.forEach(element => {
            tempLiveData.push([element.date ,element.close - (Math.floor(Math.random() * (2 - (-1) + 1)) + (-1))])
          });
          prediction.forEach(element => {
            tempPredictionData.push([element.date ,element.prediction])

          });     
        setStockData({
          stock: res.company,
          currentPrice: tempLiveData[tempLiveData.length-1][1],
          predictedPrice: tempPredictionData[tempPredictionData.length-1][1],
          recommendation: determineRecommendation(
            liveData[liveData.length - 1].close,
            prediction[prediction.length - 1]
          ),
          actualPrices: tempLiveData,
          predictedPrices: tempPredictionData
        });
        }else{
          alert("Model is being Prepared, Please Do not referesh the page....")
          trainModel(searchSymbol).then((res) => {
            if(res.success){
              handleSearch()
            }
          })
          
        }
        
      }).catch()
    }
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);

  };

  useEffect(() => {

    if(searchSymbol){
      handleSearch()
    }else{
      alert("Please Enter Stock Ticker")
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
      data: stockData.actualPrices.slice(-stockData.predictedPrices.length),
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
      <div className="search-form">
      <Search/>
      </div>

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
