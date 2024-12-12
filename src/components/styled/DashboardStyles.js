import styled from 'styled-components';

export const DashboardTitle = styled.h1`
  color: #ffffff;
  font-size: 24px;
  text-align: center;
  margin: 0;
  padding: 16px 0;
`;

export const MarqueeContainer = styled.div`
  background: transparent;
  padding: 8px 0;
  overflow: hidden;
  border-top: 1px solid #303030;
  border-bottom: 1px solid #303030;
  margin: 20px 0;
`;

export const DashboardContainer = styled.div`
  padding: 24px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 140px);
  background: #1A1A1A;
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 24px;
  padding: 20px;
  width: calc(100% - 40px);
  margin-top: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  background: #1F1F1F;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
`; 