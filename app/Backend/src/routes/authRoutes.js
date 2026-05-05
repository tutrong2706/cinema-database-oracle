import express from 'express';
import * as authController from '../controllers/authController.js';
import * as bookingController from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { handleSuccessResponse, handleErrorResponse } from '../helpers/responseHandler.js';
import { getMyOrders } from '../controllers/orderController.js';
import { getOrderById } from '../controllers/orderController.js'
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
 * TEST ENDPOINTS - Mock login và kiểm tra DB
 */
router.post('/login-mock', (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Mock data
        const mockUsers = {
            'admin1': { userId: 'mock-admin', email: 'admin1', vaiTro: 'Admin' },
            'user1': { userId: 'mock-user', email: 'user1', vaiTro: 'Khach' }
        };

        const user = mockUsers[email];
        if (!user || password !== 'ad1') {
            return res.status(401).json(handleErrorResponse(401, 'Email hoặc mật khẩu sai'));
        }

        const token = jwt.sign(
            { userId: user.userId, email: user.email, vaiTro: user.vaiTro },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '24h' }
        );

        return res.status(200).json(handleSuccessResponse(200, 'Mock login thành công', {
            token,
            userInfo: { userId: user.userId, email: user.email, vaiTro: user.vaiTro }
        }));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
});

/**
 * Kiểm tra kết nối database
 */
router.get('/db-test', async (req, res) => {
    try {
        const result = await query('SELECT * FROM TAI_KHOAN WHERE ROWNUM <= 1');
        return res.status(200).json(handleSuccessResponse(200, 'Kết nối DB OK', {
            dbConnected: true,
            sampleData: result.length > 0 ? result[0] : 'Không có dữ liệu'
        }));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, `Lỗi kết nối DB: ${error.message}`));
    }
});

/**
 * Lấy tất cả admin accounts (for debug)
 */
router.get('/debug/admins', async (req, res) => {
    try {
        const result = await query(`SELECT MaNguoiDung, Email, VaiTro FROM TAI_KHOAN WHERE VaiTro = 'Admin'`);
        return res.status(200).json(handleSuccessResponse(200, 'Admin accounts', result));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
});

/**
 * Lấy tài khoản theo email (for debug)
 */
router.get('/debug/account/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await query(`SELECT MaNguoiDung, HoTen, Email, MatKhau, VaiTro FROM TAI_KHOAN WHERE LOWER(Email) = LOWER(:1)`, [email]);
        return res.status(200).json(handleSuccessResponse(200, 'Account info', result.length > 0 ? result[0] : 'Không tìm thấy'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
});

/**
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
 * @swagger
 * /auth/suat-chieus/{id}/seats:
 *   get:
 *     summary: Láº¥y sÆ¡ Ä‘á»“ gháº¿ cá»§a suáº¥t chiáº¿u
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.get('/suat-chieus/:id/seats', bookingController.getSeatMap);

/**
 * Protected routes - Cần authentication
 */

// GET /auth/profile - Lấy thông tin profile
router.post('/booking', authenticateToken, bookingController.createBooking);
router.get('/profile', authenticateToken, authController.getProfile);

// PUT /auth/profile/:userId - Cập nhật profile
router.put('/profile/:userId', authenticateToken, authController.updateProfile);

// POST /auth/booking - Tạo đơn hàng mới
router.post('/booking', authenticateToken, bookingController.createBooking);

<<<<<<< Updated upstream
// GET /auth/orders - Lấy đơn hàng của user
router.get('/orders', authenticateToken, getMyOrders);

// GET /auth/orders/:id - Lấy chi tiết đơn hàng (với phim, rạp, suất chiếu, ghế)
router.get('/orders/:id', authenticateToken, getOrderById);

// POST /auth/orders/:id/pay - Thanh toán đơn hàng
router.post('/orders/:id/pay', authenticateToken, bookingController.payOrder);

// POST /auth/orders/:id/cancel - Hủy đơn hàng
=======
// GET /auth/orders/:id - Lấy chi tiết đơn hàng
router.get('/orders/:id', authenticateToken, bookingController.getOrderDetail);
router.post('/orders/:id/pay', authenticateToken, bookingController.payOrder);
>>>>>>> Stashed changes
router.post('/orders/:id/cancel', authenticateToken, bookingController.cancelOrder);

// GET /auth/tickets - Lấy vé của user
router.get('/tickets', authenticateToken, bookingController.getUserTickets);



export default router;
