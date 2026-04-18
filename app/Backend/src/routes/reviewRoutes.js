import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();

// Public routes
router.get('/reviews/:maPhim', reviewController.getMovieReviews);
router.get('/reviews/detail/:reviewId', reviewController.getReviewById);

// Customer routes (authenticated)
router.post('/reviews/:maPhim', authMiddleware, reviewController.createReview);
router.get('/customer/reviews', authMiddleware, reviewController.getMyReviews);
router.put('/reviews/:reviewId', authMiddleware, reviewController.updateReview);
router.delete('/reviews/:reviewId', authMiddleware, reviewController.deleteReview);

export default router;
