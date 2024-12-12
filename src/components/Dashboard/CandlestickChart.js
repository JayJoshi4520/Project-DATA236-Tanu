import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const CandlestickChart = ({ timeFrame }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#808A9D',
      },
      grid: {
        vertLines: { color: 'rgba(128, 138, 157, 0.1)' },
        horzLines: { color: 'rgba(128, 138, 157, 0.1)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      timeScale: {
        borderColor: 'rgba(128, 138, 157, 0.2)',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: 'rgba(128, 138, 157, 0.2)',
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Sample data based on timeframe
    const generateData = () => {
      // Add your data generation logic here based on timeFrame
      return [
        { time: '2024-01-01', open: 171, high: 175, low: 171, close: 174 },
        { time: '2024-01-02', open: 174, high: 178, low: 175, close: 177 },
        { time: '2024-01-03', open: 177, high: 180, low: 174, close: 175 },
        { time: '2024-01-04', open: 175, high: 176, low: 172, close: 174 },
        { time: '2024-01-05', open: 174, high: 181, low: 176, close: 180 },
      ];
    };

    candlestickSeries.setData(generateData());
    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [timeFrame]);

  return <div ref={chartContainerRef} style={{ width: '100%' }} />;
};

export default CandlestickChart;