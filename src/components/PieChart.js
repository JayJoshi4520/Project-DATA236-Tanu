import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PieChart = ({ data }) => {
  const pieData = Object.entries(data).map(([ticker, stockData]) => ({
    name: ticker,
    y: stockData.currentPrice
  }));

  const options = {
    chart: {
      type: 'pie',
      backgroundColor: '#1F1F1F',
      height: 400
    },
    title: {
      text: 'Portfolio Distribution',
      style: { color: '#ffffff' }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: ${point.y:.2f}',
          style: {
            color: '#ffffff'
          }
        }
      }
    },
    legend: {
      itemStyle: {
        color: '#ffffff'
      }
    },
    series: [{
      name: 'Value',
      colorByPoint: true,
      data: pieData
    }],
    tooltip: {
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

export default PieChart; 