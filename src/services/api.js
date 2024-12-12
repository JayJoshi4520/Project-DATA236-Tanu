import axios from 'axios';
import { data } from 'react-router-dom';
import styled from 'styled-components';



const basePath = "https://finnhub.io/api/v1";
const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/getlivedata',
});

export const fetchStockData = async (symbol, timeFrame) => {
  try {
    const response = await instance.get(`/stock/${symbol}`, {
      params: {
        timeFrame: timeFrame
      }
    });
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

export const fetchNews = async (category) => {
  const url = `${basePath}/news?category=${category}&token=${process.env.REACT_APP_API_KEY}`;
  const response = await fetch(url);
  

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};



export const fetchStockDetails = async (stockSymbol) => {
  
  
  const url = `${basePath}/stock/profile2?symbol=${stockSymbol}&token=${process.env.REACT_APP_API_KEY}`;
  const response = await fetch(url)

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};

const BASE_URL = "https://data236-api-168397596336.us-central1.run.app";

export const getLiveStockData = async (ticker) => {
  try {
    console.log('Fetching data for:', ticker); // Debug log

    const response = await fetch(`${BASE_URL}/getlivedata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticker: ticker,
        interval: '1d',
        stockPeriod: '1mo'
      })
    });

    const data = await response.json();
    console.log('Received data:', data); // Debug log

    if (!data.success) {
      console.error('API Error:', data.message);
      return {
        success: false,
        currentPrice: 0,
        change: 0,
        liveData: []
      };
    }

    return data;

  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      currentPrice: 0,
      change: 0,
      liveData: []
    };
  }
};

export const getStocks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getstocks`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, stocks: [] };
  }
};

const getInterval = (timeFrame) => {
  switch (timeFrame) {
    case '1D': return '1d';
    case '1W': return '1d';
    case '1M': return '1d';
    case '1Y': return '1wk';
    default: return '1d';
  }
};

const getStockPeriod = (timeFrame) => {
  switch (timeFrame) {
    case '1D': return '10d';
    case '1W': return '1mo';
    case '1M': return '3mo';
    case '1Y': return '1y';
    default: return '1d';
  }
};

export const testAPIConnection = async () => {
  try {
    const response = await fetch(`${BASE_URL}/ping`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API test response:', data);
    return data;
  } catch (error) {
    console.error('API test failed:', error);
    throw error;
  }
};

export const getStockInfo = async (ticker) => {
  try {
    const response = await fetch(`${BASE_URL}/stockinfo/${ticker}`);
    if (!response.ok) {
      throw new Error('Failed to fetch stock info');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stock info:', error);
    return null;
  }
};

export const getMarketIndices = async (timeFrame) => {
  try {
    const indices = ['%5EGSPC', '%5EIXIC', '%5EDJI']; // S&P 500, NASDAQ, DOW JONES
    const promises = indices.map(index => 
      fetch(`${BASE_URL}/getlivedata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticker: index,
          interval: getInterval(timeFrame),
          stockPeriod: getStockPeriod(timeFrame)
        })
      }).then(res => res.json())
    );

    const results = await Promise.all(promises);
    
    return {
      SP500: formatMarketData(results[0]),
      NASDAQ: formatMarketData(results[1]),
      DOWJONES: formatMarketData(results[2])
    };
  } catch (error) {
    console.error('Error fetching market indices:', error);
    return {
      SP500: { current: 0, change: 0, data: [] },
      NASDAQ: { current: 0, change: 0, data: [] },
      DOWJONES: { current: 0, change: 0, data: [] }
    };
  }
};

const formatMarketData = (response) => {
  if (!response.success || !response.liveData || response.liveData.length === 0) {
    return { current: 0, change: 0, data: [] };
  }

  const data = response.liveData.map(item => [
    new Date(item.date).getTime(),
    item.close
  ]);

  const current = response.liveData[response.liveData.length - 1].close;
  const previous = response.liveData[0].close;
  const change = ((current - previous) / previous) * 100;

  return {
    current,
    change,
    data
  };
};

export default instance; 