import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

const CandlestickChart = ({ data, ticker }) => {
  const candleData = data[ticker]?.liveData.map(item => [
    new Date(item.date).getTime(),
    item.open,
    item.high,
    item.low,
    item.close
  ]) || [];

  const options = {
    chart: {
      type: 'candlestick',
      backgroundColor: '#1F1F1F',
      height: 400
    },
    title: {
      text: `${ticker} Price Movement`,
      style: { color: '#ffffff' }
    },
    rangeSelector: {
      enabled: false
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
      enabled: false
    },
    series: [{
      name: ticker,
      data: candleData,
      tooltip: {
        valueDecimals: 2
      }
    }]
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={options}
      />
    </div>
  );
};

export default CandlestickChart; 