import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import * as reportController from '../controllers/reportController.js';

const router = express.Router();

// All report routes require admin authentication
router.get('/reports/daily-revenue', authMiddleware, roleMiddleware('Admin'), reportController.getDailyRevenue);
router.get('/reports/monthly-revenue', authMiddleware, roleMiddleware('Admin'), reportController.getMonthlyRevenue);
router.get('/reports/revenue-by-movie', authMiddleware, roleMiddleware('Admin'), reportController.getRevenueByMovie);
router.get('/reports/revenue-by-cinema', authMiddleware, roleMiddleware('Admin'), reportController.getRevenueBycinema);
router.get('/reports/popular-movies', authMiddleware, roleMiddleware('Admin'), reportController.getPopularMovies);
router.get('/reports/customer-stats', authMiddleware, roleMiddleware('Admin'), reportController.getCustomerStats);
router.get('/reports/top-spenders', authMiddleware, roleMiddleware('Admin'), reportController.getTopSpenders);
router.get('/reports/overview', authMiddleware, roleMiddleware('Admin'), reportController.getOverviewStats);
router.get('/reports/occupancy-rate', authMiddleware, roleMiddleware('Admin'), reportController.getRoomOccupancyRate);

export default router;
