# Cart Microservice

## Overview
The Cart Microservice is part of a beginner-friendly e-commerce system that manages shopping carts for both buyers and sellers. It provides basic cart functionality with MongoDB for storage and RabbitMQ for event communication.

## Features
- Add items to cart
- Remove items from cart
- View cart contents
- Cart management for both buyers and sellers
- Event notifications for cart actions

## Technical Stack
- MongoDB for cart data storage
- RabbitMQ for event communication
- RESTful API endpoints

## Data Model
```json
{
  "userId": "string",
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "price": "number"
    }
  ],
  "lastUpdated": "timestamp"
}
```

## RabbitMQ Events
- `cart.item.added`: When an item is added to cart
- `cart.item.removed`: When an item is removed from cart
- `cart.cleared`: When a cart is cleared

## API Endpoints
- `POST /cart/add`: Add item to cart
- `POST /cart/remove`: Remove item from cart
- `GET /cart`: Get cart contents
- `DELETE /cart`: Clear cart

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
- MongoDB URL: `mongodb://localhost:27017/cartdb`
- RabbitMQ URL: `amqp://localhost`

## Note
This is a simplified implementation for educational purposes. It uses hardcoded credentials and basic authentication for ease of understanding.
