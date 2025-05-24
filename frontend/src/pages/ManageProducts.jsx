import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, InputNumber, 
  message, Upload, Space, Popconfirm, Select 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  UploadOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';

const { Option } = Select;

const categories = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Sports'
];

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const compressImage = (base64String, maxWidth = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Compress as JPEG with 0.7 quality
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG files!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must be smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    if (!userId || userType !== 'seller') {
      message.warning('Please login as a seller to manage products');
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [userId]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getSellerProducts(userId);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleAddEdit = async (values) => {
    try {
      const productData = {
        ...values,
        sellerId: userId,
        images: imageUrl ? [imageUrl] : []
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, productData);
        message.success('Product updated successfully');
      } else {
        await productService.createProduct(productData);
        message.success('Product created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingProduct(null);
      setImageUrl('');
      setFileList([]);
      fetchProducts();
    } catch (error) {
      message.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const showEditModal = (product) => {
    setEditingProduct(product);
    setImageUrl(product.images?.[0] || '');
    setFileList(product.images?.[0] ? [{
      uid: '-1',
      name: 'product-image.png',
      status: 'done',
      url: product.images[0]
    }] : []);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category
    });
    setModalVisible(true);
  };

  const handleImageChange = async (info) => {
    setFileList(info.fileList);

    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      try {
        const base64 = await getBase64(info.file.originFileObj);
        const compressedImage = await compressImage(base64);
        setImageUrl(compressedImage);
        setUploading(false);
      } catch (error) {
        message.error('Failed to process image');
        setUploading(false);
      }
    }
  };

  const customUploadRequest = async ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess();
    }, 0);
  };

  const columns = [
    {
      title: 'Image',
      key: 'image',
      render: (_, record) => (
        <img 
          src={record.images?.[0]} 
          alt={record.name}
          style={{ width: 50, height: 50, objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/50';
          }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            title="Edit Product"
          />
          <Popconfirm
            title="Delete this product?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
              title="Delete Product"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Manage Products</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProduct(null);
            setImageUrl('');
            setFileList([]);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Add New Product
        </Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={products}
        rowKey="_id"
      />

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingProduct(null);
          setImageUrl('');
          setFileList([]);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEdit}
        >
          <Form.Item
            name="image"
            label="Product Image"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              showUploadList={false}
              customRequest={customUploadRequest}
              beforeUpload={beforeUpload}
              onChange={handleImageChange}
              maxCount={1}
            >
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="product" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100';
                  }}
                />
              ) : (
                <div>
                  {uploading ? 'Uploading...' : (
                    <>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </>
                  )}
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please input product name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input product description!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please input product price!' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              prefix="$"
            />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Stock Quantity"
            rules={[{ required: true, message: 'Please input stock quantity!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select placeholder="Select a category">
              {categories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingProduct(null);
                setImageUrl('');
                setFileList([]);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageProducts; 