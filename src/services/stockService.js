// Mock data for testing

const basePath = "https://finnhub.io/api/v1";
/**
 * Searches best stock matches based on a user's query
 * @param {string} query - The user's query, e.g. 'fb'
 * @returns {Promise<Object[]>} Response array of best stock matches
 */

export const searchSymbol = async (query) => {
  const url = `${basePath}/search?q=${query}&token=${process.env.REACT_APP_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};



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
