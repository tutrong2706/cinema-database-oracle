import express from 'express';
import * as mongoDemoController from '../controllers/mongoDemoController.js';

const router = express.Router();

/**
 * MongoDB Demo Routes - Optimistic Concurrency Control
 */

// GET /api/mongo/booking?bookingId=xxx - Lấy booking với version
router.get('/booking', mongoDemoController.getBookingWithVersion);

// POST /api/mongo/booking/update - Cập nhật booking (Optimistic Lock)
router.post('/booking/update', mongoDemoController.updateBookingOptimistic);

// POST /api/mongo/booking/init - Khởi tạo booking mới
router.post('/booking/init', mongoDemoController.initBooking);

// GET /api/mongo/booking/demo-info - Lấy thông tin demo
router.get('/booking/demo-info', mongoDemoController.getDemoInfo);

export default router;
