import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/getlivedata`,
});

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;
let ws = null;

export const subscribeToStockUpdates = (symbol, onUpdate) => {
  if (ws) {
    ws.close();
  }

  ws = new WebSocket(`ws://localhost:8000/ws/${symbol}`);

  ws.onopen = () => {
    console.log(`WebSocket Connected for ${symbol}`);
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.success && data.data) {
        onUpdate(data.data);
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket Disconnected');
  };

  return () => {
    if (ws) {
      ws.close();
    }
  };
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


export const getLiveStockData = async (symbol, timeframe) => {



  try {
    // Make the data request directly without health check
    const response = await fetch(`${BASE_URL}/getlivedata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticker: symbol,
        timeframe: timeframe
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.liveData || data.liveData.length === 0) {
      return {
        success: false,
        message: 'No data available',
        liveData: []
      };
    }



    return {
      success: true,
      liveData: data.liveData,
      company: data.company
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: error.message,
      liveData: [],
    };
  }
};



export const trainModel = async(symbol) => {
  try{  
    const response = await fetch(`${BASE_URL}/training`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticker: symbol,
      })
    });

    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }else{

      return {
        success: true,
        message: 'Training Done',
      };
    }

    

  }catch (error){
    console.error('API Error:', error);
    return {
      success: false,
      message: error.message,
    };
    
  }
}



export const getStockDataPrediction = async (symbol, timeframe) => {


  
  try {
    // Make the data request directly without health check
    const response = await fetch(`${BASE_URL}/prediction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticker: symbol,
        timeframe: timeframe
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.liveData || data.liveData.length === 0) {
      return {
        success: false,
        message: 'No data available',
        prediction: [],
        liveData: []
      };
    }
    
    

    return {
      success: true,
      liveData: data.liveData,
      company: data.company,
      prediction: data.prediction
    };
  } catch (error) {
    if(TypeError){
      return {
        success: false,
        message: error.message,
        liveData: [],
      };
    }else{
      return {
        success: false,
        message: error.message,
        liveData: [],
      };
    }
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

export const formatMarketData = (response) => {
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





// Simplified WebSocket setup
export const setupWebSocket = (symbol, onMessage) => {
  try {
    const ws = new WebSocket(`ws://localhost:5000/ws`);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      // Send subscription message
      ws.send(JSON.stringify({
        action: 'subscribe',
        symbol: symbol
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        console.error('WebSocket message parse error:', e);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => setupWebSocket(symbol, onMessage), 5000);
    };

    return ws;
  } catch (error) {
    console.error('WebSocket Setup Error:', error);
    return null;
  }
};

// Simplified error handler
export const handleApiError = (error) => {
  return {
    success: false,
    message: error.message || 'An error occurred',
    liveData: []
  };
};

export default instance;
