import React from 'react';
import { Card } from 'antd';
import { Pie } from '@ant-design/plots';

const MarketDistribution = ({ data }) => {
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    theme: {
      colors10: ['#6b74e6', '#4CAF50', '#FF9800', '#E91E63'],
    },
  };

  return (
    <Card className="stock-chart-card" title="Market Distribution">
      <Pie {...config} />
    </Card>
  );
};

export default MarketDistribution;