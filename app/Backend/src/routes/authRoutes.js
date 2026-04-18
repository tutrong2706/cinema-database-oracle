import express from 'express';
import * as authController from '../controllers/authController.js';
import * as bookingController from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Sai email hoặc mật khẩu
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/raps:
 *   get:
 *     summary: Lấy danh sách rạp chiếu
 *     tags: [Booking]
 */
router.get('/raps', bookingController.getRaps);

/**
 * @swagger
 * /auth/combos:
 *   get:
 *     summary: Lấy danh sách combo (bắp, nước)
 *     tags: [Booking]
 */
router.get('/combos', bookingController.getCombos);

/**
 * @swagger
 * /auth/suat-chieus:
 *   get:
 *     summary: Lấy danh sách suất chiếu
 *     tags: [Booking]
 */
router.get('/suat-chieus', bookingController.getScreenings);

/**
 * @swagger
 * /auth/suat-chieus/{id}/booked-seats:
 *   get:
 *     summary: Lấy ghế đã đặt của suất chiếu
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.get('/suat-chieus/:id/booked-seats', bookingController.getBookedSeats);

/**
 * Protected routes - Cần authentication
 */

// GET /auth/profile - Lấy thông tin profile
router.get('/profile', authenticateToken, authController.getProfile);

// PUT /auth/profile/:userId - Cập nhật profile
router.put('/profile/:userId', authenticateToken, authController.updateProfile);

// GET /auth/orders - Lấy đơn hàng của user
router.get('/orders', authenticateToken, bookingController.getUserOrders);

// GET /auth/orders/:id - Lấy chi tiết đơn hàng
router.get('/orders/:id', authenticateToken, bookingController.getOrderDetail);

// GET /auth/tickets - Lấy vé của user
router.get('/tickets', authenticateToken, bookingController.getUserTickets);

export default router;
