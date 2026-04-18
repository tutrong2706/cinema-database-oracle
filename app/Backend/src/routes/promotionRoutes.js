import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import * as promotionController from '../controllers/promotionController.js';

const router = express.Router();

// Public routes
router.get('/promotions', promotionController.getAllPromotions);
router.get('/promotions/active', promotionController.getActivePromotions);
router.get('/promotions/:id', promotionController.getPromotionById);

// Admin routes (authenticated + admin role)
router.post('/admin/promotions', authMiddleware, roleMiddleware('Admin'), promotionController.createPromotion);
router.put('/admin/promotions/:id', authMiddleware, roleMiddleware('Admin'), promotionController.updatePromotion);
router.delete('/admin/promotions/:id', authMiddleware, roleMiddleware('Admin'), promotionController.deletePromotion);

// Report routes
router.get('/reports/top-promotions', authMiddleware, roleMiddleware('Admin'), promotionController.getTopUsedPromotions);
router.get('/reports/promotion-savings', authMiddleware, roleMiddleware('Admin'), promotionController.getPromotionSavings);

export default router;
