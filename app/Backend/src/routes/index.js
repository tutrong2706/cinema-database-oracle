import express from 'express';
import movieRoutes from './movieRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import orderRoutes from './orderRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import roomRoutes from './roomRoutes.js';
import cinemaRoutes from './cinemaRoutes.js';
import promotionRoutes from './promotionRoutes.js';
import reportRoutes from './reportRoutes.js';
import mongoRoutes from './mongoRoutes.js';

const router = express.Router();

/**
 * API Routes mapping
 */

// Public movie routes
router.use('/phim', movieRoutes);

// Cinema and room routes (public)
router.use('/', cinemaRoutes);

// Auth and booking routes
router.use('/auth', authRoutes);

// Admin routes
router.use('/admin', adminRoutes);

// Order routes
router.use('/', orderRoutes);

// Review routes
router.use('/', reviewRoutes);

// Room routes
router.use('/', roomRoutes);

// Promotion routes
router.use('/', promotionRoutes);

// Report routes
router.use('/', reportRoutes);

// MongoDB demo routes (Optimistic Concurrency Control)
router.use('/mongo', mongoRoutes);

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
