import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { roleRequired } from '../middleware/roleMiddleware.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

// Public routes
router.get('/orders/:id', orderController.getOrderById);

// Customer routes (authenticated)
router.get('/customer/orders', authenticateToken, orderController.getMyOrders);
router.post('/orders', authenticateToken, orderController.createOrder);

// Admin routes (authenticated + admin role)
router.get('/orders', authenticateToken, roleRequired(['Admin']), orderController.getAllOrders);
router.put('/orders/:id/status', authenticateToken, roleRequired(['Admin']), orderController.updateOrderStatus);
router.delete('/orders/:id', authenticateToken, roleRequired(['Admin']), orderController.deleteOrder);

// Report routes
router.get('/reports/revenue', authenticateToken, roleRequired(['Admin']), orderController.getRevenueByDateRange);
router.get('/reports/revenue-by-movie', authenticateToken, roleRequired(['Admin']), orderController.getRevenueByMovie);
router.get('/reports/revenue-by-cinema', authenticateToken, roleRequired(['Admin']), orderController.getRevenueBycinema);

export default router;
