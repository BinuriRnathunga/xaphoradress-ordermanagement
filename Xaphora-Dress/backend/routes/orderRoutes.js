// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  addItemToOrder,
  removeItemFromOrder,
  getAllProducts
} = require('../controllers/orderController');

// Create a new order
router.post('/', createOrder);

// Get all orders
router.get('/', getAllOrders);

// Get a specific order by ID
router.get('/:orderId', getOrderById);

// Update entire order
router.put('/:orderId', updateOrder);

// Delete an order
router.delete('/:orderId', deleteOrder);

// Add item to an order
router.post('/:orderId/items', addItemToOrder);

// Remove item from an order
router.delete('/:orderId/items/:itemId', removeItemFromOrder);

// Get all products (for product selection)
router.get('/products/all', getAllProducts);

module.exports = router;