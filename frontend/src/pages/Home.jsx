import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Button, Carousel, Statistic, Space } from 'antd';
import { ShoppingOutlined, UserOutlined, ShoppingCartOutlined, TagOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';

// Import hero images
import hero1 from '../assets/heroes/1.svg';
import hero2 from '../assets/heroes/2.svg';
import hero3 from '../assets/heroes/3.svg';
import hero4 from '../assets/heroes/4.svg';
import hero5 from '../assets/heroes/5.svg';
import hero6 from '../assets/heroes/6.svg';
import hero7 from '../assets/heroes/7.svg';

const { Title, Paragraph } = Typography;
const { Meta } = Card;

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      // Get first 4 products as featured
      setFeaturedProducts(response.data.slice(0, 4));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Electronics', icon: <ShoppingOutlined />, color: '#1890ff' },
    { name: 'Fashion', icon: <TagOutlined />, color: '#f5222d' },
    { name: 'Home & Living', icon: <ShoppingCartOutlined />, color: '#52c41a' },
    { name: 'Sports', icon: <UserOutlined />, color: '#faad14' },
  ];

  const carouselItems = [
    {
      image: hero1,
      title: 'Welcome to TechGuru',
      description: 'Your One-Stop Shop for Everything Tech',
      action: 'Shop Now'
    },
    {
      image: hero2,
      title: 'Special Offers',
      description: 'Get up to 50% off on selected items',
      action: 'View Deals'
    },
    {
      image: hero3,
      title: 'New Arrivals',
      description: 'Check out our latest products',
      action: 'Explore'
    },
    {
      image: hero4,
      title: 'Top-Rated Gear',
      description: 'Shop customer favorites and bestsellers',
      action: 'See Top Picks'
    },
    {
      image: hero5,
      title: 'Smart Devices',
      description: 'Upgrade your home with the latest tech',
      action: 'Browse Devices'
    },
    {
      image: hero6,
      title: 'Work From Anywhere',
      description: 'Laptops and accessories for productivity',
      action: 'View Products'
    },
    {
      image: hero7,
      title: 'Game On',
      description: 'Gear up with pro-level gaming equipment',
      action: 'Level Up'
    }
  ];
  

  const carouselStyle = {
    height: '500px',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '8px',
    marginBottom: '24px'
  };

  const contentStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    textAlign: 'center',
    padding: '0 20px'
  };

  return (
    <div>
      <Carousel autoplay effect="fade">
        {carouselItems.map((item, index) => (
          <div key={index}>
            <div style={carouselStyle}>
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={contentStyle}>
                <Title level={2} style={{ color: '#fff', margin: 0 }}>
                  {item.title}
                </Title>
                <Paragraph style={{ color: '#fff', fontSize: '18px', margin: '16px 0' }}>
                  {item.description}
                </Paragraph>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => navigate('/products')}
                  style={{ marginTop: '16px' }}
                >
                  {item.action}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <div style={{ marginBottom: 24 }}>
        <Title level={3}>Shop by Category</Title>
        <Row gutter={[16, 16]}>
          {categories.map((category) => (
            <Col xs={12} sm={6} key={category.name}>
              <Card
                hoverable
                onClick={() => navigate('/products')}
                style={{ textAlign: 'center' }}
              >
                <Space direction="vertical" size="small">
                  {React.cloneElement(category.icon, { 
                    style: { fontSize: '24px', color: category.color } 
                  })}
                  <span>{category.name}</span>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Row justify="space-around" gutter={[16, 16]}>
          <Col span={6}>
            <Statistic title="Active Users" value={1000} prefix={<UserOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Products" value={500} prefix={<ShoppingOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Orders" value={2000} prefix={<ShoppingCartOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Categories" value={20} prefix={<TagOutlined />} />
          </Col>
        </Row>
      </div>

      <div>
        <Title level={3}>Featured Products</Title>
        <Row gutter={[16, 16]}>
          {featuredProducts.map(product => (
            <Col xs={24} sm={12} md={6} key={product._id}>
              <Card
                hoverable
                cover={product.images?.[0] ? (
                  <img 
                    alt={product.name}
                    src={product.images[0]}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: 200, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    No Image
                  </div>
                )}
                onClick={() => navigate('/products')}
              >
                <Meta
                  title={product.name}
                  description={
                    <div>
                      <p>{product.description}</p>
                      <p style={{ color: '#f50' }}>${product.price}</p>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Button type="primary" size="large" onClick={() => navigate('/products')}>
          View All Products
        </Button>
      </div>
    </div>
  );
};

export default Home; 