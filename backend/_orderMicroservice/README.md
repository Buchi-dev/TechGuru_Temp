# Order Microservice

## Overview
The Order Microservice handles the checkout process in the e-commerce system. It processes orders when users confirm their cart contents, stores order information in MongoDB, and communicates order events through RabbitMQ.

## Features
- Process checkout from cart
- Store order history
- Generate order confirmations
- Event notifications for order status

## Technical Stack
- MongoDB for order data storage
- RabbitMQ for event communication
- RESTful API endpoints

## Data Model
```json
{
  "orderId": "string",
  "userId": "string",
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "price": "number"
    }
  ],
  "totalAmount": "number",
  "orderDate": "timestamp",
  "status": "string" // pending, confirmed, completed
}
```

## RabbitMQ Events
- `order.created`: When a new order is created
- `order.confirmed`: When an order is confirmed
- `order.completed`: When an order is completed

## API Endpoints
- `POST /order/create`: Create new order from cart
- `GET /order/:orderId`: Get order details
- `GET /orders/user/:userId`: Get user's order history
- `PUT /order/:orderId/status`: Update order status

## Setup and Installation
1. Install MongoDB
2. Install RabbitMQ
3. Install dependencies: `npm install`
4. Start the service: `npm start`

## Dependencies
- MongoDB
- RabbitMQ
- Express.js
- Mongoose

## Connection Details (Hardcoded for Development)
- MongoDB URL: `mongodb://localhost:27017/orderdb`
- RabbitMQ URL: `amqp://localhost`

## Note
This is a simplified implementation for educational purposes. It uses hardcoded credentials and basic authentication for ease of understanding.
