import * as promotionModel from '../models/promotionModel.js';
import { handleSuccessResponse, handleErrorResponse } from '../helpers/responseHandler.js';

/**
 * GET /api/promotions - Lấy tất cả khuyến mãi
 */
export async function getAllPromotions(req, res) {
    try {
        const promotions = await promotionModel.getAllPromotions();
        return res.status(200).json(handleSuccessResponse(200, 'OK', promotions));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/promotions/active - Lấy khuyến mãi đang hoạt động
 */
export async function getActivePromotions(req, res) {
    try {
        const promotions = await promotionModel.getActivePromotions();
        return res.status(200).json(handleSuccessResponse(200, 'OK', promotions));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/promotions/:id - Lấy chi tiết khuyến mãi
 */
export async function getPromotionById(req, res) {
    try {
        const { id } = req.params;

        const promotion = await promotionModel.getPromotionById(id);
        if (!promotion) {
            return res.status(404).json(handleErrorResponse(404, 'Khuyến mãi không tồn tại'));
        }

        return res.status(200).json(handleSuccessResponse(200, 'OK', promotion));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /api/admin/promotions - Tạo khuyến mãi (admin only)
 */
export async function createPromotion(req, res) {
    try {
        const { TenChuongTrinh, PhanTramGiam, NgayBatDau, NgayKetThuc } = req.body;

        if (!TenChuongTrinh || !PhanTramGiam) {
            return res.status(400).json(handleErrorResponse(400, 'TenChuongTrinh và PhanTramGiam bắt buộc'));
        }

        if (PhanTramGiam < 0 || PhanTramGiam > 100) {
            return res.status(400).json(handleErrorResponse(400, 'PhanTramGiam phải từ 0 đến 100'));
        }

        const result = await promotionModel.createPromotion({
            TenChuongTrinh,
            PhanTramGiam,
            NgayBatDau: NgayBatDau || new Date(),
            NgayKetThuc: NgayKetThuc || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

        return res.status(201).json(handleSuccessResponse(201, 'Tạo khuyến mãi thành công', result));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * PUT /api/admin/promotions/:id - Cập nhật khuyến mãi (admin only)
 */
export async function updatePromotion(req, res) {
    try {
        const { id } = req.params;
        const { TenChuongTrinh, PhanTramGiam, NgayBatDau, NgayKetThuc } = req.body;

        const promotion = await promotionModel.getPromotionById(id);
        if (!promotion) {
            return res.status(404).json(handleErrorResponse(404, 'Khuyến mãi không tồn tại'));
        }

        if (PhanTramGiam && (PhanTramGiam < 0 || PhanTramGiam > 100)) {
            return res.status(400).json(handleErrorResponse(400, 'PhanTramGiam phải từ 0 đến 100'));
        }

        await promotionModel.updatePromotion(id, {
            TenChuongTrinh,
            PhanTramGiam,
            NgayBatDau,
            NgayKetThuc
        });

        return res.status(200).json(handleSuccessResponse(200, 'Cập nhật khuyến mãi thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * DELETE /api/admin/promotions/:id - Xóa khuyến mãi (admin only)
 */
export async function deletePromotion(req, res) {
    try {
        const { id } = req.params;

        const promotion = await promotionModel.getPromotionById(id);
        if (!promotion) {
            return res.status(404).json(handleErrorResponse(404, 'Khuyến mãi không tồn tại'));
        }

        await promotionModel.deletePromotion(id);
        return res.status(200).json(handleSuccessResponse(200, 'Xóa khuyến mãi thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/reports/top-promotions - Lấy khuyến mãi được dùng nhiều nhất
 */
export async function getTopUsedPromotions(req, res) {
    try {
        const { limit = 10 } = req.query;

        const promotions = await promotionModel.getTopUsedPromotions(parseInt(limit));
        return res.status(200).json(handleSuccessResponse(200, 'OK', promotions));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/reports/promotion-savings - Tính tiền tiết kiệm từ khuyến mãi
 */
export async function getPromotionSavings(req, res) {
    try {
        const savings = await promotionModel.getPromotionSavings();
        return res.status(200).json(handleSuccessResponse(200, 'OK', savings));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}
