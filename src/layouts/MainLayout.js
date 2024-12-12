import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  LineChartOutlined,
  RiseOutlined,
  GlobalOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/analysis',
      icon: <LineChartOutlined />,
      label: <Link to="/analysis">Stock Analysis</Link>,
    },
    {
      key: '/technical',
      icon: <BarChartOutlined />,
      label: <Link to="/technical">Technical Analysis</Link>,
    },
    {
      key: '/predictions',
      icon: <RiseOutlined />,
      label: <Link to="/predictions">Predictions</Link>,
    },
    {
      key: '/market',
      icon: <GlobalOutlined />,
      label: <Link to="/market">Market Overview</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ padding: '16px' }}>
          <Title
            level={5}
            style={{
              color: '#fff',
              margin: 0,
              textAlign: 'center',
              display: collapsed ? 'none' : 'block',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
          >
            Stock Market Prediction
          </Title>
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#141414' }} />
        <Content style={{ margin: '16px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 