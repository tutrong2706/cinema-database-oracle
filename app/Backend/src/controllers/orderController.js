import * as orderModel from '../models/orderModel.js';
import * as accountModel from '../models/accountModel.js';
import { handleSuccessResponse, handleErrorResponse } from '../helpers/responseHandler.js';

/**
 * GET /api/orders - Lấy tất cả đơn hàng (admin only)
 */
export async function getAllOrders(req, res) {
    try {
        const orders = await orderModel.getAllOrders();
        return res.status(200).json(handleSuccessResponse(200, 'OK', orders));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/orders/:id - Lấy chi tiết đơn hàng
 */
export async function getOrderById(req, res) {
    try {
        const { id } = req.params;
        const order = await orderModel.getOrderById(id);

        if (!order) {
            return res.status(404).json(handleErrorResponse(404, 'Đơn hàng không tồn tại'));
        }

        const items = await orderModel.getOrderItems(id);
        return res.status(200).json(handleSuccessResponse(200, 'OK', {
            ...order,
            items: items
        }));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/customer/orders - Lấy đơn hàng của customer hiện tại
 */
export async function getMyOrders(req, res) {
    try {
        const maNguoiDung = req.user?.MaNguoiDung;
        if (!maNguoiDung) {
            return res.status(401).json(handleErrorResponse(401, 'Chưa đăng nhập'));
        }

        const orders = await orderModel.getCustomerOrders(maNguoiDung);
        return res.status(200).json(handleSuccessResponse(200, 'OK', orders));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /api/orders - Tạo đơn hàng mới
 */
export async function createOrder(req, res) {
    try {
        const { MaNguoiDung, NgayDat, TongTien, TrangThai } = req.body;

        if (!MaNguoiDung || !TongTien) {
            return res.status(400).json(handleErrorResponse(400, 'MaNguoiDung và TongTien bắt buộc'));
        }

        const result = await orderModel.createOrder({
            MaNguoiDung,
            NgayDat: NgayDat || new Date(),
            TongTien,
            TrangThai: TrangThai || 'Chờ xác nhận'
        });

        return res.status(201).json(handleSuccessResponse(201, 'Tạo đơn hàng thành công', result));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * PUT /api/orders/:id/status - Cập nhật trạng thái đơn hàng
 */
export async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { TrangThai } = req.body;

        if (!TrangThai) {
            return res.status(400).json(handleErrorResponse(400, 'TrangThai bắt buộc'));
        }

        const order = await orderModel.getOrderById(id);
        if (!order) {
            return res.status(404).json(handleErrorResponse(404, 'Đơn hàng không tồn tại'));
        }

        await orderModel.updateOrderStatus(id, TrangThai);
        return res.status(200).json(handleSuccessResponse(200, 'Cập nhật trạng thái thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * DELETE /api/orders/:id - Xóa đơn hàng
 */
export async function deleteOrder(req, res) {
    try {
        const { id } = req.params;

        const order = await orderModel.getOrderById(id);
        if (!order) {
            return res.status(404).json(handleErrorResponse(404, 'Đơn hàng không tồn tại'));
        }

        await orderModel.deleteOrder(id);
        return res.status(200).json(handleSuccessResponse(200, 'Xóa đơn hàng thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/reports/revenue - Doanh thu theo ngày
 */
export async function getRevenueByDateRange(req, res) {
    try {
        const { fromDate, toDate } = req.query;

        const revenue = await orderModel.getRevenueByDateRange(fromDate, toDate);
        return res.status(200).json(handleSuccessResponse(200, 'OK', revenue));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/reports/revenue-by-movie - Doanh thu theo phim
 */
export async function getRevenueByMovie(req, res) {
    try {
        const revenue = await orderModel.getRevenueByMovie();
        return res.status(200).json(handleSuccessResponse(200, 'OK', revenue));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/reports/revenue-by-cinema - Doanh thu theo rạp
 */
export async function getRevenueBycinema(req, res) {
    try {
        const revenue = await orderModel.getRevenueBycinema();
        return res.status(200).json(handleSuccessResponse(200, 'OK', revenue));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}
