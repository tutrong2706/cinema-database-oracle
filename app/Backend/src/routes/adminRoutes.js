import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateToken, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * All admin routes require authentication and admin role
 */

// Movie management
router.get('/phims', authenticateToken, adminOnly, adminController.getAllMoviesAdmin);
router.post('/phims', authenticateToken, adminOnly, adminController.createMovie);
router.put('/phims/:id', authenticateToken, adminOnly, adminController.updateMovie);
router.delete('/phims/:id', authenticateToken, adminOnly, adminController.deleteMovie);

// Screening management
router.get('/suats', authenticateToken, adminOnly, adminController.getAllScreenings);
router.post('/suats', authenticateToken, adminOnly, adminController.createScreening);
router.put('/suats/:id', authenticateToken, adminOnly, adminController.updateScreening);
router.delete('/suats/:id', authenticateToken, adminOnly, adminController.deleteScreening);

// Order and Revenue reports
router.get('/orders', authenticateToken, adminOnly, adminController.getAllOrders);
router.get('/revenue', authenticateToken, adminOnly, adminController.getRevenue);
router.get('/revenue/movie', authenticateToken, adminOnly, adminController.getRevenueByMovie);
router.get('/revenue/cinema', authenticateToken, adminOnly, adminController.getRevenueBycinema);
router.get('/reports/top-movies', authenticateToken, adminOnly, adminController.getTopMovies);

// User and Admin management
router.post('/create-admin', authenticateToken, adminOnly, adminController.createAdmin);
router.patch('/users/:userId/role', authenticateToken, adminOnly, adminController.changeUserRole);
router.get('/users', authenticateToken, adminOnly, adminController.getAllUsers);
router.get('/users/count', authenticateToken, adminOnly, adminController.getUserStats);

export default router;
