import React from 'react';
import styled from 'styled-components';

const StockCardsContainer = styled.div`
  margin-top: 40px;
  margin-left: 40px;
  margin-right: 40px;
  padding: 20px 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: calc(100% - 80px);
`;

const StockCard = styled.div`
  background: #1f1f1f;
  border: 1px solid #303030;
  border-radius: 8px;
  padding: 16px;
  
  .stock-name {
    color: #ffffff;
    font-size: 16px;
    margin-bottom: 12px;
  }
  
  .stock-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .stock-price {
    color: #ffffff;
    font-size: 24px;
    font-weight: bold;
  }
  
  .stock-change {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    &.up {
      color: #3f8600;
    }
    &.down {
      color: #cf1322;
    }
  }
`;

const StockCards = ({ data }) => {
  return (
    <StockCardsContainer>
      {Object.entries(data).map(([ticker, stockData]) => {
        const priceChange = stockData.liveData.length > 1
          ? ((stockData.currentPrice - stockData.liveData[0].close) / stockData.liveData[0].close) * 100
          : 0;

        return (
          <StockCard key={ticker}>
            <div className="stock-name">{ticker}</div>
            <div className="stock-info">
              <span className="stock-price">
                ${stockData.currentPrice?.toFixed(2)}
              </span>
              <span className={`stock-change ${priceChange >= 0 ? 'up' : 'down'}`}>
                {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
              </span>
            </div>
          </StockCard>
        );
      })}
    </StockCardsContainer>
  );
};

export default StockCards; 