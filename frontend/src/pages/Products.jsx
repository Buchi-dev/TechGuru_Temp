import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Button, message, Spin, Empty, Modal, Descriptions, Space, Typography, Select, Slider, Form } from 'antd';
import { ShoppingCartOutlined, SearchOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { userService } from '../services/userService';

const { Meta } = Card;
const { Search } = Input;
const { Text } = Typography;
const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: null,
    maxPrice: null,
    sellerUsername: ''
  });
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPossiblePrice, setMaxPossiblePrice] = useState(1000);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    calculateMaxPrice();
  }, []);

  useEffect(() => {
    if (selectedProduct?.sellerId) {
      fetchSellerDetails(selectedProduct.sellerId);
    }
  }, [selectedProduct]);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

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
    setLoading(true);
    try {
      const response = await productService.searchProducts({
        query: value,
        ...filters
      });
      setProducts(response.data);
    } catch (error) {
      message.error('Search failed');
    }
    setLoading(false);
  };

  const handleFilterSubmit = async (values) => {
    setFilters(values);
    setFilterModalVisible(false);
    setLoading(true);
    try {
      const response = await productService.searchProducts({
        query: searchQuery,
        ...values
      });
      setProducts(response.data);
    } catch (error) {
      message.error('Filter application failed');
    }
    setLoading(false);
  };

  const addToCart = async (product) => {
    if (!userId) {
      message.warning('Please login to add items to cart');
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

  const calculateMaxPrice = async () => {
    try {
      const response = await productService.getAllProducts();
      const maxPrice = Math.max(...response.data.map(product => product.price));
      setMaxPossiblePrice(maxPrice || 1000);
      setPriceRange([0, maxPrice || 1000]);
    } catch (error) {
      console.error('Failed to calculate max price:', error);
    }
  };

  const FilterModal = () => (
    <Modal
      title="Advanced Filters"
      open={filterModalVisible}
      onCancel={() => setFilterModalVisible(false)}
      footer={null}
    >
      <Form
        initialValues={{
          ...filters,
          priceRange: [filters.minPrice || 0, filters.maxPrice || maxPossiblePrice]
        }}
        onFinish={(values) => {
          handleFilterSubmit({
            ...values,
            minPrice: values.priceRange[0],
            maxPrice: values.priceRange[1]
          });
        }}
        layout="vertical"
      >
        <Form.Item name="category" label="Category">
          <Select allowClear placeholder="Select category">
            {categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item name="sellerUsername" label="Seller Username">
          <Input placeholder="Enter seller username" />
        </Form.Item>

        <Form.Item name="priceRange" label="Price Range">
          <Slider
            range
            min={0}
            max={maxPossiblePrice}
            tipFormatter={(value) => `$${value}`}
            marks={{
              0: '$0',
              [maxPossiblePrice]: `$${maxPossiblePrice}`
            }}
          />
        </Form.Item>

        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <Text type="secondary">
            Selected Range: ${priceRange[0]} - ${priceRange[1]}
          </Text>
        </div>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Apply Filters
            </Button>
            <Button onClick={() => {
              setPriceRange([0, maxPossiblePrice]);
              setFilters({
                category: '',
                minPrice: null,
                maxPrice: null,
                sellerUsername: ''
              });
              setFilterModalVisible(false);
              fetchProducts();
            }}>
              Reset Filters
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
        <Search
          placeholder="Search products..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          icon={<FilterOutlined />}
          size="large"
          onClick={() => setFilterModalVisible(true)}
        >
          Filters
        </Button>
      </div>

      <FilterModal />

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
              setDetailsModalVisible(false);
              setSellerDetails(null);
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