# Product Microservice

## Overview
The Product Microservice manages all product-related operations in the e-commerce system. It allows buyers to browse and search products, while sellers can manage their product listings. All product changes are communicated to other services via RabbitMQ.

## Features
- Product browsing and searching
- Product management (CRUD operations) for sellers
- Seller product listing management
- Search products by seller
- Event notifications for product changes

## Technical Stack
- MongoDB for product data storage
- RabbitMQ for event communication
- RESTful API endpoints

## Data Model
```json
{
  "productId": "string",
  "sellerId": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "quantity": "number",
  "category": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## RabbitMQ Events
- `product.created`: When a new product is added
- `product.updated`: When a product is modified
- `product.deleted`: When a product is removed
- `product.quantity.updated`: When product quantity changes

## API Endpoints
- `POST /products`: Create new product
- `GET /products`: List all products
- `GET /products/search`: Search products
- `GET /products/:productId`: Get product details
- `PUT /products/:productId`: Update product
- `DELETE /products/:productId`: Delete product
- `GET /sellers/:sellerId/products`: Get seller's products

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
- MongoDB URL: `mongodb://localhost:27017/productdb`
- RabbitMQ URL: `amqp://localhost`

## Note
This is a simplified implementation for educational purposes. It uses hardcoded credentials and basic authentication for ease of understanding.
