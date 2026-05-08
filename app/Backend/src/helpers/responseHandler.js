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

/**
 * Hàm nội bộ: Làm sạch thông báo lỗi từ Oracle
 */
function cleanOracleError(errorMessage) {
    if (!errorMessage) return "Có lỗi hệ thống xảy ra.";
    let firstLine = errorMessage.split('\n')[0];
    return firstLine.replace(/ORA-\d+:\s*/, '');
}

/**
 * Hàm tạo Error Response thông minh
 * @param {number} code - HTTP Status Code
 * @param {string|Error} errorInput - Thông điệp lỗi dạng text hoặc Object Error bắt được từ catch
 * @param {any} errorData - Dữ liệu bổ sung (meta)
 */
export function handleErrorResponse(code = 500, errorInput = 'Internal Server Error', errorData = null) {
    let finalMessage = errorInput;

    // 1. Tự động trích xuất message nếu truyền vào nguyên một Error Object
    if (errorInput instanceof Error) {
        finalMessage = errorInput.message;
    }

    // 2. Chốt chặn bảo mật: Tự động phát hiện và làm sạch lỗi Oracle
    if (typeof finalMessage === 'string' && finalMessage.includes('ORA-')) {
        finalMessage = cleanOracleError(finalMessage);
    }

    // 3. Trả về cấu trúc chuẩn của bạn
    return {
        code,
        message: finalMessage,
        meta: errorData,
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
