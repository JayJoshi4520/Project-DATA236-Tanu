import React from "react";
import { Card, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const StockInfo = ({ ticker, data }) => {
    return (
        <Card className="stock-info-card" bordered={false}>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Statistic
                        title="Stock Price"
                        value={data?.price || 0}
                        precision={2}
                        valueStyle={{
                            color: data?.priceChange > 0 ? '#3f8600' : '#cf1322',
                        }}
                        prefix={data?.priceChange > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        suffix="$"
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Market Cap"
                        value={data?.marketCap || 0}
                        prefix="$"
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Volume"
                        value={data?.volume || 0}
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="24h Change"
                        value={data?.priceChange || 0}
                        precision={2}
                        suffix="%"
                        valueStyle={{
                            color: data?.priceChange > 0 ? '#3f8600' : '#cf1322',
                        }}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default StockInfo; 