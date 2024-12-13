import {React, useState} from 'react';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import StockAnalysis from './pages/StockAnalysis';
import Predictions from './pages/Predictions';
import TechnicalAnalysis from './pages/TechnicalAnalysis';
import './styles/components.css';
import Blog from './pages/Blog';
import StockContext from "./context/StockContext";


function App() {
  const [stockSymbol, setStockSymbol] = useState(() => {
      const localStock = localStorage.getItem("ticker");
      return localStock || "AAPL";
    });

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#6B74E6',
        },
      }}
    >
    <StockContext.Provider value={{ stockSymbol, setStockSymbol }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analysis" element={<StockAnalysis />} />
            <Route path="technical" element={<TechnicalAnalysis />} />
            <Route path="predictions" element={<Predictions />} />
            <Route path="blog" element={<Blog />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </StockContext.Provider>
    </ConfigProvider>
  );
}

export default App;
