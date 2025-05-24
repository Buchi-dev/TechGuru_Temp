import React, { useState, useEffect } from 'react';
import { List, Card, Tag, Timeline, Empty, Spin, message } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';

const statusColors = {
  pending: 'orange',
  confirmed: 'blue',
  completed: 'green'
};

const statusIcons = {
  pending: <ClockCircleOutlined />,
  confirmed: <ShoppingOutlined />,
  completed: <CheckCircleOutlined />
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      message.warning('Please login to view orders');
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getUserOrders(userId);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  const renderOrderTimeline = (order) => (
    <Timeline
      items={[
        {
          color: statusColors[order.status],
          children: `Order ${order.status}`,
          dot: statusIcons[order.status]
        },
        {
          color: 'gray',
          children: `Order placed on ${new Date(order.orderDate).toLocaleDateString()}`
        }
      ]}
    />
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Card title="My Orders" bordered={false}>
        {orders.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={orders}
            renderItem={(order) => (
              <List.Item>
                <Card
                  type="inner"
                  title={`Order #${order._id}`}
                  extra={
                    <Tag color={statusColors[order.status]}>
                      {order.status.toUpperCase()}
                    </Tag>
                  }
                >
                  <List
                    size="small"
                    dataSource={order.items}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.name}
                          description={`Quantity: ${item.quantity}`}
                        />
                        <div>${item.price.toFixed(2)}</div>
                      </List.Item>
                    )}
                  />
                  <div style={{ 
                    marginTop: 16,
                    padding: '16px 0',
                    borderTop: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong>Total Amount: </strong>
                      <span style={{ color: '#f50', fontSize: '16px' }}>
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    {renderOrderTimeline(order)}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Empty
            description="No orders found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
};

export default Orders; 