# User Microservice

## Overview
The User Microservice handles user management in the e-commerce system. It provides basic user authentication and profile management with a simplified approach - no encryption, tokens, or sessions. User data is stored directly in MongoDB.

## Features
- Basic user registration
- Simple login (username/password matching)
- User profile management
- Buyer and seller user types
- Direct MongoDB authentication

## Technical Stack
- MongoDB for user data storage
- RabbitMQ for event communication
- RESTful API endpoints

## Data Model
```json
{
  "userId": "string",
  "firstName": "string",
  "middleName": "string",
  "lastName": "string",
  "username": "string",
  "password": "string", // stored as plaintext for educational purposes
  "userType": "string", // buyer or seller
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## RabbitMQ Events
- `user.registered`: When a new user registers
- `user.updated`: When user details are updated
- `user.login`: When user logs in

## API Endpoints
- `POST /users/register`: Register new user
- `POST /users/login`: User login
- `GET /users/:userId`: Get user profile
- `PUT /users/:userId`: Update user profile
- `GET /users/type/:userType`: Get users by type (buyer/seller)

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
- MongoDB URL: `mongodb://localhost:27017/userdb`
- RabbitMQ URL: `amqp://localhost`

## Note
This is a simplified implementation for educational purposes. It uses hardcoded credentials and stores passwords in plaintext. This approach is NOT suitable for production use but is designed for learning microservices architecture.
