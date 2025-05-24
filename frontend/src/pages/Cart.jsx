import React, { useState, useEffect } from 'react';
import { Table, Button, InputNumber, message, Card, Space } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      message.warning('Please login to view cart');
      navigate('/login');
      return;
    }
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart(userId);
      setCart(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch cart');
      setLoading(false);
    }
  };

  const handleQuantityChange = async (record, quantity) => {
    try {
      await cartService.updateCartItem({
        userId,
        productId: record.productId,
        quantity
      });
      fetchCart();
    } catch (error) {
      message.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (record) => {
    try {
      await cartService.removeFromCart({
        userId,
        productId: record.productId
      });
      fetchCart();
      message.success('Item removed from cart');
    } catch (error) {
      message.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    try {
      await orderService.createOrder({
        userId,
        items: cart.items,
        totalAmount: cart.totalAmount
      });
      await cartService.clearCart(userId);
      message.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      message.error('Checkout failed');
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(record, value)}
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (_, record) => `$${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card title="Shopping Cart" bordered={false}>
        <Table
          loading={loading}
          columns={columns}
          dataSource={cart.items}
          rowKey="productId"
          pagination={false}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong>${cart.totalAmount?.toFixed(2) || '0.00'}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Button
                    type="primary"
                    icon={<ShoppingOutlined />}
                    onClick={handleCheckout}
                    disabled={!cart.items?.length}
                  >
                    Checkout
                  </Button>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </div>
  );
};

export default Cart; 