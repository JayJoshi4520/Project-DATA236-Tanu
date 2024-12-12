import {React, useState} from 'react';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import StockAnalysis from './pages/StockAnalysis';
import Predictions from './pages/Predictions';
import MarketOverview from './pages/MarketOverview';
import TechnicalAnalysis from './pages/TechnicalAnalysis';
import './styles/components.css';
import Blog from './pages/Blog';


function App() {  

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#6B74E6',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analysis" element={<StockAnalysis />} />
            <Route path="technical" element={<TechnicalAnalysis />} />
            <Route path="predictions" element={<Predictions />} />
            <Route path="market" element={<MarketOverview />} />
            <Route path="blog" element={<Blog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
