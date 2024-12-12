import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const StockChart = ({ data }) => {
  const seriesData = Object.entries(data).map(([ticker, stockData]) => ({
    name: ticker,
    data: stockData.liveData.map(item => [
      new Date(item.date).getTime(),
      item.close
    ])
  }));

  const options = {
    chart: {
      type: 'spline',
      backgroundColor: '#1F1F1F',
      height: 400
    },
    title: {
      text: 'Stock Price Trends',
      style: { color: '#ffffff' }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        style: { color: '#ffffff' }
      }
    },
    yAxis: {
      title: {
        text: 'Price ($)',
        style: { color: '#ffffff' }
      },
      labels: {
        style: { color: '#ffffff' }
      }
    },
    legend: {
      itemStyle: {
        color: '#ffffff'
      }
    },
    series: seriesData,
    tooltip: {
      shared: true,
      valuePrefix: '$'
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default StockChart;