export const generateDataForTimeFrame = (timeFrame) => {
    switch (timeFrame) {
      case '1D':
        return {
          labels: Array.from({ length: 24 }, (_, i) => 
            `${i + 1} day`
          ),
          data: Array.from({ length: 24 }, () => 
            Math.floor(Math.random() * (330 - 320) + 320)
          )
        };
      
      case '1W':
        return {
          labels: Array.from({ length: 7 }, (_, i) => 
            `${i + 1}`
          ),
          data: Array.from({ length: 7 }, () => 
            Math.floor(Math.random() * (330 - 320) + 320)
          )
        };
      
      case '1M':
        return {
          labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ],
          data: Array.from({ length: 12 }, () => 
            Math.floor(Math.random() * (330 - 320) + 320)
          )
        };
      
      case '1Y':
        return {
          labels: Array.from({ length: 10 }, (_, i) => 
            `${2010 + i}`
          ),
          data: Array.from({ length: 10 }, () => 
            Math.floor(Math.random() * (330 - 320) + 320)
          )
        };
      
      default:
        return {
          labels: [],
          data: []
        };
    }
  }; 