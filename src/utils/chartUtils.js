import Highcharts from 'highcharts';
require('highcharts/modules/stock')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);

export const initHighcharts = () => {
  Highcharts.setOptions({
    chart: {
      style: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }
    },
    credits: {
      enabled: false
    },
    colors: ['#2196F3', '#4CAF50', '#FFC107', '#F44336', '#9C27B0', '#3F51B5']
  });
}; 