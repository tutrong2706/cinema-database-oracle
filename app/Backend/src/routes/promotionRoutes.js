import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { roleRequired } from '../middleware/roleMiddleware.js';
import * as promotionController from '../controllers/promotionController.js';

const router = express.Router();

// Public routes
router.get('/promotions', promotionController.getAllPromotions);
router.get('/promotions/active', promotionController.getActivePromotions);
router.get('/promotions/:id', promotionController.getPromotionById);

// Admin routes (authenticated + admin role)
router.post('/admin/promotions', authenticateToken, roleRequired(['Admin']), promotionController.createPromotion);
router.put('/admin/promotions/:id', authenticateToken, roleRequired(['Admin']), promotionController.updatePromotion);
router.delete('/admin/promotions/:id', authenticateToken, roleRequired(['Admin']), promotionController.deletePromotion);

// Report routes
router.get('/reports/top-promotions', authenticateToken, roleRequired(['Admin']), promotionController.getTopUsedPromotions);
router.get('/reports/promotion-savings', authenticateToken, roleRequired(['Admin']), promotionController.getPromotionSavings);

export default router;
