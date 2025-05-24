import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Tabs, List, Tag, Spin, Empty } from 'antd';
import { UserOutlined, ShopOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    if (!userId) {
      message.warning('Please login to view profile');
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // First fetch user profile
      const profileRes = await userService.getProfile(userId);
      setUserProfile(profileRes.data);

      // Set form values
      form.setFieldsValue({
        firstName: profileRes.data.firstName,
        middleName: profileRes.data.middleName,
        lastName: profileRes.data.lastName,
        username: profileRes.data.username
      });

      // Then fetch orders and products in parallel
      try {
        const ordersRes = await orderService.getUserOrders(userId);
        setOrders(ordersRes.data || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      }

      if (userType === 'seller') {
        try {
          const productsRes = await productService.getSellerProducts(userId);
          setProducts(productsRes.data || []);
        } catch (error) {
          console.error('Failed to fetch products:', error);
          setProducts([]);
        }
      }
    } catch (error) {
      message.error('Failed to fetch profile: ' + (error.response?.data?.message || 'Unknown error'));
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      await userService.updateProfile(userId, values);
      message.success('Profile updated successfully');
      fetchUserData();
    } catch (error) {
      message.error('Failed to update profile: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    navigate('/login');
    message.success('Logged out successfully');
  };

  const items = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined />
          Profile Information
        </span>
      ),
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please input your first name!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="middleName"
            label="Middle Name"
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please input your last name!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} disabled />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Profile
            </Button>
            <Button type="link" danger onClick={handleLogout} style={{ marginLeft: 8 }}>
              Logout
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <HistoryOutlined />
          Order History
        </span>
      ),
      children: orders.length > 0 ? (
        <List
          dataSource={orders}
          renderItem={order => (
            <List.Item>
              <Card style={{ width: '100%' }}>
                <List.Item.Meta
                  title={`Order #${order._id}`}
                  description={`Date: ${new Date(order.orderDate).toLocaleDateString()}`}
                />
                <div>
                  <Tag color={
                    order.status === 'completed' ? 'green' :
                    order.status === 'confirmed' ? 'blue' : 'orange'
                  }>
                    {order.status.toUpperCase()}
                  </Tag>
                  <div style={{ marginTop: 8 }}>
                    Total: ${order.totalAmount.toFixed(2)}
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No orders found" />
      ),
    },
    userType === 'seller' && {
      key: '3',
      label: (
        <span>
          <ShopOutlined />
          My Products
        </span>
      ),
      children: products.length > 0 ? (
        <List
          dataSource={products}
          renderItem={product => (
            <List.Item>
              <Card style={{ width: '100%' }}>
                <List.Item.Meta
                  title={product.name}
                  description={product.description}
                />
                <div>
                  <Tag color="blue">${product.price}</Tag>
                  <Tag color="green">Stock: {product.quantity}</Tag>
                </div>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No products found" />
      ),
    }
  ].filter(Boolean);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card title="My Profile" bordered={false}>
      <Tabs defaultActiveKey="1" items={items} />
    </Card>
  );
};

export default Profile; 