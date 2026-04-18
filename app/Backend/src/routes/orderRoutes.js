import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

// Public routes
router.get('/orders/:id', orderController.getOrderById);

// Customer routes (authenticated)
router.get('/customer/orders', authMiddleware, orderController.getMyOrders);
router.post('/orders', authMiddleware, orderController.createOrder);

// Admin routes (authenticated + admin role)
router.get('/orders', authMiddleware, roleMiddleware('Admin'), orderController.getAllOrders);
router.put('/orders/:id/status', authMiddleware, roleMiddleware('Admin'), orderController.updateOrderStatus);
router.delete('/orders/:id', authMiddleware, roleMiddleware('Admin'), orderController.deleteOrder);

// Report routes
router.get('/reports/revenue', authMiddleware, roleMiddleware('Admin'), orderController.getRevenueByDateRange);
router.get('/reports/revenue-by-movie', authMiddleware, roleMiddleware('Admin'), orderController.getRevenueByMovie);
router.get('/reports/revenue-by-cinema', authMiddleware, roleMiddleware('Admin'), orderController.getRevenueBycinema);

export default router;
