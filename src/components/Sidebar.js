import React from 'react';
import { Menu } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const SidebarHeader = styled.div`
  padding: 20px;
  color: white;
  font-size: 24px;
  font-weight: 600;
  background: #1A1A1A;
  border-bottom: 1px solid #303030;
  width: 100%;
  display: flex;
  align-items: center;
  height: 80px;
`;

const Sidebar = () => {
  return (
    <>
      <SidebarHeader>
        Stock Market Prediction
      </SidebarHeader>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['dashboard']}
        items={[
          {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
          },
        ]}
      />
    </>
  );
};

export default Sidebar;
