import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Button, message, Spin, Empty, Modal, Descriptions, Space, Typography, Select } from 'antd';
import { ShoppingCartOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { userService } from '../services/userService';
import { useNavigate, useLocation } from 'react-router-dom';

const { Meta } = Card;
const { Search } = Input;
const { Text } = Typography;
const { Option } = Select;

// Predefined categories
const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Sports'];

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('product');
  const [searchValue, setSearchValue] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [sellerDetails, setSellerDetails] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Check if we have category data from navigation
    if (location.state?.category && location.state?.searchType) {
      setSearchType(location.state.searchType);
      setSearchValue(location.state.category);
      handleSearch(location.state.category);
      // Clear the location state to prevent re-searching on page refresh
      navigate(location.pathname, { replace: true });
    } else {
      fetchProducts();
    }
  }, [location]);

  useEffect(() => {
    if (selectedProduct?.sellerId) {
      fetchSellerDetails(selectedProduct.sellerId);
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch products');
      setLoading(false);
    }
  };

  const fetchSellerDetails = async (sellerId) => {
    try {
      const response = await userService.getUserById(sellerId);
      setSellerDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch seller details:', error);
      setSellerDetails(null);
    }
  };

  const handleSearch = async (value) => {
    if (!value && searchType === 'category') {
      message.info('Please select a category');
      return;
    }
    
    setSearchValue(value);
    setLoading(true);
    try {
      let searchParams = {};
      
      switch (searchType) {
        case 'seller':
          searchParams.sellerUsername = value;
          break;
        case 'category':
          searchParams.category = value;
          break;
        default:
          searchParams.query = value;
      }
      
      const response = await productService.searchProducts(searchParams);
      setProducts(response.data);
      
      if (response.data.length === 0) {
        switch (searchType) {
          case 'seller':
            message.info(`No products found for seller "${value}"`);
            break;
          case 'category':
            message.info(`No products found in category "${value}"`);
            break;
          default:
            message.info(`No products found matching "${value}"`);
        }
      }
    } catch (error) {
      message.error('Search failed. Please try again.');
    }
    setLoading(false);
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchValue('');
    if (!loading) {
      fetchProducts(); // Reset to all products when switching search type
    }
  };

  const renderSearchInput = () => {
    if (searchType === 'category') {
      return (
        <Select
          value={searchValue}
          style={{ flex: 1 }}
          size="large"
          placeholder="Select a category"
          onChange={(value) => handleSearch(value)}
          allowClear
          onClear={() => {
            setSearchValue('');
            fetchProducts();
          }}
        >
          {CATEGORIES.map(category => (
            <Option key={category} value={category}>{category}</Option>
          ))}
        </Select>
      );
    }

    return (
      <Search
        value={searchValue}
        placeholder={searchType === 'seller' ? "Enter seller username..." : "Search products..."}
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={handleSearch}
        style={{ flex: 1 }}
      />
    );
  };

  const addToCart = async (product) => {
    if (!userId) {
      message.warning('Please login to add items to cart');
      setDetailsModalVisible(false);
      navigate('/login');
      return;
    }

    try {
      await cartService.addToCart({
        userId,
        productId: product._id,
        quantity: 1,
        price: product.price,
        name: product.name
      });
      message.success('Added to cart successfully');
    } catch (error) {
      message.error('Failed to add to cart');
    }
  };

  const showProductDetails = (product) => {
    setSellerDetails(null);
    setSelectedProduct(product);
    setDetailsModalVisible(true);
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
        <Select
          value={searchType}
          style={{ width: 150 }}
          onChange={handleSearchTypeChange}
        >
          <Option value="product">Search Products</Option>
          <Option value="seller">Search by Seller</Option>
          <Option value="category">Search by Category</Option>
        </Select>
        {renderSearchInput()}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : products.length > 0 ? (
        <Row gutter={[16, 16]}>
          {products.map(product => (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
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
                actions={[
                  <Button 
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => showProductDetails(product)}
                  >
                    View Details
                  </Button>,
                  <Button 
                    type="primary" 
                    icon={<ShoppingCartOutlined />}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                ]}
              >
                <Meta
                  title={product.name}
                  description={
                    <>
                      <p>{product.description}</p>
                      <p style={{ color: '#f50' }}>${product.price}</p>
                      <Text type="secondary">
                        Stock: <span style={{ color: product.quantity > 0 ? '#52c41a' : '#f5222d' }}>
                          {product.quantity} units
                        </span>
                      </Text>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No products found" />
      )}

      <Modal
        title="Product Details"
        open={detailsModalVisible}
        onCancel={() => {
          setDetailsModalVisible(false);
          setSellerDetails(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setDetailsModalVisible(false);
            setSellerDetails(null);
          }}>
            Close
          </Button>,
          <Button
            key="addToCart"
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => {
              addToCart(selectedProduct);
            }}
          >
            Add to Cart
          </Button>
        ]}
        width={600}
      >
        {selectedProduct && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              {selectedProduct.images?.[0] ? (
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ height: 200, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  No Image
                </div>
              )}
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Product Name">{selectedProduct.name}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedProduct.description}</Descriptions.Item>
              <Descriptions.Item label="Price">${selectedProduct.price}</Descriptions.Item>
              <Descriptions.Item label="Category">{selectedProduct.category}</Descriptions.Item>
              <Descriptions.Item label="Stock Available">
                <span style={{ color: selectedProduct.quantity > 0 ? '#52c41a' : '#f5222d' }}>
                  {selectedProduct.quantity} units
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Seller">
                {sellerDetails ? (
                  <Text>
                    {sellerDetails.username || sellerDetails.name || 'Anonymous Seller'}
                  </Text>
                ) : (
                  <Spin size="small" />
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Products;