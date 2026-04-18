import jwt from 'jsonwebtoken';
import { handleErrorResponse } from '../helpers/responseHandler.js';

/**
 * Middleware xác thực JWT Token
 * Token phải được gửi trong header: Authorization: Bearer <token>
 */
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token sau "Bearer "

    if (!token) {
        return res.status(401).json(handleErrorResponse(401, 'Token không được cung cấp'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json(handleErrorResponse(401, 'Token không hợp lệ hoặc hết hạn'));
    }
}

/**
 * Middleware kiểm tra quyền admin
 */
export function adminOnly(req, res, next) {
    if (!req.user || req.user.vaiTro !== 'Admin') {
        return res.status(403).json(handleErrorResponse(403, 'Chỉ admin mới có quyền truy cập'));
    }
    next();
}

/**
 * Middleware xử lý lỗi toàn cục
 */
export function errorHandler(error, req, res, next) {
    console.error('Error:', error);
    return res.status(500).json(handleErrorResponse(500, error.message || 'Lỗi server'));
}
