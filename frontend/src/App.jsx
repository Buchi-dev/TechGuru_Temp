import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import {
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  ShoppingOutlined,
  HistoryOutlined,
  ShopOutlined
} from '@ant-design/icons';

// Import pages
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ManageProducts from './pages/ManageProducts';

// Import logo
import logo from './assets/logo.png';

const { Header, Content, Footer } = Layout;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { token } = theme.useToken();
  const userType = localStorage.getItem('userType');

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
    { key: '/products', icon: <ShoppingOutlined />, label: <Link to="/products">Products</Link> },
    { key: '/cart', icon: <ShoppingCartOutlined />, label: <Link to="/cart">Cart</Link> },
    { key: '/orders', icon: <HistoryOutlined />, label: <Link to="/orders">Orders</Link> },
    { key: '/profile', icon: <UserOutlined />, label: <Link to="/profile">Profile</Link> },
    userType === 'seller' && { 
      key: '/manage-products', 
      icon: <ShopOutlined />, 
      label: <Link to="/manage-products">Manage Products</Link> 
    }
  ].filter(Boolean);

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          position: 'fixed', 
          zIndex: 1, 
          width: '100%', 
          background: token.colorBgContainer,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Link to="/" style={{ 
            display: 'flex',
            alignItems: 'center',
            marginRight: '24px'
          }}>
            <img 
              src={logo} 
              alt="TechGuru Logo" 
              style={{ 
                height: '40px',
                marginRight: '8px'
              }}
            />
          </Link>
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['/']}
            items={menuItems}
            style={{ flex: 1 }}
          />
        </Header>
        
        <Content style={{ 
          padding: '0 50px', 
          marginTop: 64,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{ 
            padding: 24, 
            minHeight: 380,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            width: '100%',
            maxWidth: 1200
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/manage-products" element={<ManageProducts />} />
            </Routes>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          TechGuru E-commerce ©{new Date().getFullYear()} Created with Ant Design
        </Footer>
      </Layout>
    </BrowserRouter>
  );
};

export default App;