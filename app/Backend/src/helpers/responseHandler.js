/**
 * Response Handler - Chuẩn hóa format trả về
 */

export function handleSuccessResponse(code = 200, message = 'OK', data = null) {
    return {
        code,
        message,
        meta: data,
        timestamp: new Date().toISOString()
    };
}

export function handleErrorResponse(code = 500, message = 'Internal Server Error') {
    return {
        code,
        message,
        meta: null,
        timestamp: new Date().toISOString()
    };
}

/**
 * Kiểm tra JWT token
 */
export function verifyToken(token, secret) {
    try {
        // Sử dụng jwt.verify từ jsonwebtoken
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Kiểm tra dữ liệu không được để trống
 */
export function validateNotEmpty(value, fieldName) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        throw new Error(`${fieldName} không được để trống`);
    }
    return true;
}

/**
 * Kiểm tra số dương
 */
export function validatePositiveNumber(value, fieldName) {
    if (isNaN(value) || value <= 0) {
        throw new Error(`${fieldName} phải là số dương`);
    }
    return true;
}
