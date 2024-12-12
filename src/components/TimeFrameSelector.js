import React from 'react';
import { Radio } from 'antd';
import '../styles/components.css';

const TimeFrameSelector = ({ timeFrame, onChange }) => {
  return (
    <Radio.Group 
      className="time-frame-selector"
      value={timeFrame} 
      onChange={e => onChange(e.target.value)}
      style={{ marginBottom: '16px' }}
    >
      <Radio.Button value="1m">1 Min</Radio.Button>
      <Radio.Button value="1d">1 Day</Radio.Button>
      <Radio.Button value="1w">1 Week</Radio.Button>
      <Radio.Button value="1y">1 Year</Radio.Button>
    </Radio.Group>
  );
};

export default TimeFrameSelector; 