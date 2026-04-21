import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { roleRequired } from '../middleware/roleMiddleware.js';
import * as reportController from '../controllers/reportController.js';

const router = express.Router();

// All report routes require admin authentication
router.get('/reports/daily-revenue', authenticateToken, roleRequired(['Admin']), reportController.getDailyRevenue);
router.get('/reports/monthly-revenue', authenticateToken, roleRequired(['Admin']), reportController.getMonthlyRevenue);
router.get('/reports/revenue-by-movie', authenticateToken, roleRequired(['Admin']), reportController.getRevenueByMovie);
router.get('/reports/revenue-by-cinema', authenticateToken, roleRequired(['Admin']), reportController.getRevenueBycinema);
router.get('/reports/popular-movies', authenticateToken, roleRequired(['Admin']), reportController.getPopularMovies);
router.get('/reports/customer-stats', authenticateToken, roleRequired(['Admin']), reportController.getCustomerStats);
router.get('/reports/top-spenders', authenticateToken, roleRequired(['Admin']), reportController.getTopSpenders);
router.get('/reports/overview', authenticateToken, roleRequired(['Admin']), reportController.getOverviewStats);
router.get('/reports/occupancy-rate', authenticateToken, roleRequired(['Admin']), reportController.getRoomOccupancyRate);

export default router;
