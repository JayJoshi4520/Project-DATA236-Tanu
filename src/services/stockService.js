// Mock data for testing
const mockStockData = {
    prices: [
      { date: 'Nov 25', price: 234 },
      { date: 'Nov 26', price: 235 },
      { date: 'Nov 28', price: 237 },
      { date: 'Dec 1', price: 239 },
      { date: 'Dec 2', price: 242 },
      { date: 'Dec 3', price: 243 },
      { date: 'Dec 4', price: 243 }
    ],
    indicators: {
      movingAverage: 83.78,
      rsi: 98.42,
      bollingerBand: 439.58
    }
  };
  
  export const getLiveStockData = async () => {
    try {
      // For now, return mock data
      // Replace this with actual API call when ready
      return mockStockData;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return null;
    }
  }; 