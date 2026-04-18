import express from 'express';
import movieRoutes from './movieRoutes.js';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

/**
 * API Routes mapping
 */

// Public movie routes
router.use('/phim', movieRoutes);

// Auth and booking routes
router.use('/auth', authRoutes);

// Admin routes
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
