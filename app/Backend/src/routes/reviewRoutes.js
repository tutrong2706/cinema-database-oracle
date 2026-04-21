import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { roleRequired } from '../middleware/roleMiddleware.js';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();

// Public routes
router.get('/reviews/:maPhim', reviewController.getMovieReviews);
router.get('/reviews/detail/:reviewId', reviewController.getReviewById);

// Customer routes (authenticated)
router.post('/reviews/:maPhim', authenticateToken, reviewController.createReview);
router.get('/customer/reviews', authenticateToken, reviewController.getMyReviews);
router.put('/reviews/:reviewId', authenticateToken, reviewController.updateReview);
router.delete('/reviews/:reviewId', authenticateToken, reviewController.deleteReview);

export default router;
