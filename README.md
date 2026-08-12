# ShoppyGlobe Backend API

Backend API for the ShoppyGlobe e-commerce application built using Node.js, Express.js, MongoDB, and JWT authentication.

# Github Link
https://github.com/WitcherxSN/shoppyglobe-backend.git


## Features

- Fetch all products
- Fetch a single product by ID
- Add products to cart
- Update cart quantity
- Delete cart items
- User registration
- User login
- JWT-based authentication
- Protected cart routes
- Input validation and error handling
- MongoDB integration

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Thunder Client

## API Endpoints

### Products

GET `/products`  
Fetch all products.

GET `/products/:id`  
Fetch a single product by ID.

### Authentication

POST `/register`  
Register a new user.

POST `/login`  
Login user and receive JWT token.

### Cart

POST `/cart`  
Add a product to cart.

PUT `/cart/:id`  
Update cart item quantity.

DELETE `/cart/:id`  
Delete a cart item.

Cart routes are protected using JWT authentication.


### Create .env file
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

### Start the development server
npm run dev

## Testing

All API routes were tested using Thunder Client.

Testing includes:

- Product APIs
- User registration
- User login
- JWT authentication
- Cart operations
- Validation errors
- Unauthorized access

### MongoDB

MongoDB Atlas is used to store:

- Products
- Cart items
- Users


### Author
Shravan Naik





