import { handleErrorResponse } from '../helpers/responseHandler.js';

/**
 * Middleware kiểm tra quyền dựa trên role
 * Sử dụng: roleRequired(['Admin']) hoặc roleRequired(['Admin', 'Khach'])
 */
export function roleRequired(allowedRoles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json(handleErrorResponse(401, 'Token không được cung cấp'));
        }

        const userRole = req.user.vaiTro;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json(
                handleErrorResponse(
                    403,
                    `Bạn không có quyền truy cập. Yêu cầu: ${allowedRoles.join(', ')}`
                )
            );
        }

        next();
    };
}

/**
 * Middleware cho Admin-only routes
 */
export function adminOnly(req, res, next) {
    return roleRequired(['Admin'])(req, res, next);
}

/**
 * Middleware cho Customer-only routes
 */
export function customerOnly(req, res, next) {
    return roleRequired(['Khach'])(req, res, next);
}

/**
 * Middleware cho cả Admin và Customer
 */
export function adminOrCustomer(req, res, next) {
    return roleRequired(['Admin', 'Khach'])(req, res, next);
}

/**
 * Middleware log user actions (audit trail)
 */
export function auditLog(req, res, next) {
    const user = req.user;
    console.log(`[AUDIT] ${new Date().toISOString()} | User: ${user?.userId} | Role: ${user?.vaiTro} | ${req.method} ${req.path}`);
    next();
}
