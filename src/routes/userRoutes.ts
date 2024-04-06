import { Router } from 'express';
import {
    getAvailableGroceryItems, placeOrder, getUserOrders, getOrderItems
} from '../controllers/userController';

import { authorizeUser, authorizeUserForPlacingOrder } from '../middleware/checkUserRole';

const router = Router();

// Route for getting available items
router.get('/grocery-items/available', getAvailableGroceryItems);

// Route for placing an order
router.post('/grocery-items/order', authorizeUserForPlacingOrder, placeOrder);

// Get all orders by userId 
router.get('/orders/:userId', authorizeUser, getUserOrders);

// Get orders items based on order id of the userid
router.get('/orders/:userId/items/:orderId?', authorizeUser, getOrderItems);
export { router };
