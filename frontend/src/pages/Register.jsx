import React from 'react';
import { Form, Input, Button, Card, Radio, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/userService';

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { confirm, ...userData } = values;
      await userService.register(userData);
      message.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      message.error('Registration failed: ' + error.response?.data?.message || 'Unknown error');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '24px' }}>
      <Card title="Register for TechGuru" bordered={false}>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              {
                required: true,
                message: 'Please input your first name!',
                whitespace: true
              }
            ]}
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
            rules={[
              {
                required: true,
                message: 'Please input your last name!',
                whitespace: true
              }
            ]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
                whitespace: true
              },
              {
                min: 3,
                message: 'Username must be at least 3 characters long'
              }
            ]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!'
              },
              {
                min: 6,
                message: 'Password must be at least 6 characters long'
              }
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="userType"
            label="Account Type"
            rules={[
              {
                required: true,
                message: 'Please select an account type!'
              }
            ]}
          >
            <Radio.Group>
              <Radio.Button value="buyer">Buyer</Radio.Button>
              <Radio.Button value="seller">Seller</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Register
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            Already have an account? <Link to="/login">Login now!</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 