import * as screeningModel from '../models/screeningModel.js';
import * as ticketModel from '../models/ticketModel.js';
import * as generalModel from '../models/generalModel.js';
import { handleSuccessResponse, handleErrorResponse } from '../helpers/responseHandler.js';

/**
 * GET /raps - Lấy danh sách rạp
 */
export async function getRaps(req, res) {
    try {
        const raps = await generalModel.getAllCinemas();
        return res.status(200).json(handleSuccessResponse(200, 'OK', raps));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /combos - Lấy danh sách combo
 */
export async function getCombos(req, res) {
    try {
        const combos = await generalModel.getAllCombos();
        return res.status(200).json(handleSuccessResponse(200, 'OK', combos));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /suat-chieus - Lấy danh sách suất chiếu theo bộ lọc
 * Query params: MaPhim, MaRapPhim, NgayChieu
 */
export async function getScreenings(req, res) {
    try {
        const { MaPhim, MaRapPhim, NgayChieu } = req.query;

        if (!MaPhim) {
            return res.status(400).json(handleErrorResponse(400, 'MaPhim bắt buộc'));
        }

        const screenings = await screeningModel.getScreeningsByFilter(MaPhim, MaRapPhim, NgayChieu);
        return res.status(200).json(handleSuccessResponse(200, 'OK', screenings));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /suat-chieus/:id/booked-seats - Lấy ghế đã đặt của suất chiếu
 */
export async function getBookedSeats(req, res) {
    try {
        const { id } = req.params;

        const seats = await ticketModel.getBookedSeats(id);
        return res.status(200).json(handleSuccessResponse(200, 'OK', seats));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /orders - Lấy danh sách đơn hàng của người dùng
 */
export async function getUserOrders(req, res) {
    try {
        const { userId } = req.user;

        const orders = await generalModel.getOrdersByUser(userId);
        
        console.log('📦 Orders for user:', userId);
        console.log('📋 Orders data:', JSON.stringify(orders, null, 2));
        
        return res.status(200).json(handleSuccessResponse(200, 'OK', orders));
    } catch (error) {
        console.error('❌ Error fetching orders:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /orders/:id - Lấy chi tiết đơn hàng
 */
export async function getOrderDetail(req, res) {
    try {
        const { id } = req.params;

        const detail = await generalModel.getOrderDetail(id);
        return res.status(200).json(handleSuccessResponse(200, 'OK', detail));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /tickets - Lấy các vé của người dùng
 */
export async function getUserTickets(req, res) {
    try {
        const { userId } = req.user;

        const tickets = await ticketModel.getTicketsByUser(userId);
        return res.status(200).json(handleSuccessResponse(200, 'OK', tickets));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}
