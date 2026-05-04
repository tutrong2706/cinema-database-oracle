import * as reportModel from '../models/reportModel.js';
import { handleSuccessResponse, handleErrorResponse } from '../helpers/responseHandler.js';

/**
 * GET /api/reports/daily-revenue - Doanh thu hằng ngày
 */
export async function getDailyRevenue(req, res) {
    try {
        const { fromDate, toDate } = req.query;

        const revenue = await reportModel.getDailyRevenue(fromDate, toDate);
        return res.status(200).json(handleSuccessResponse(200, 'OK', revenue));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/reports/monthly-revenue - Doanh thu hàng tháng
 */
export async function getMonthlyRevenue(req, res) {
    try {
        const { year } = req.query;
        const selectedYear = year || new Date().getFullYear().toString();

        const revenue = await reportModel.getMonthlyRevenue(selectedYear);
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
        const { fromDate, toDate } = req.query;
        const revenue = await reportModel.getRevenueByMovie(fromDate, toDate);
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
        const { fromDate, toDate } = req.query;
        const revenue = await reportModel.getRevenueBycinema(fromDate, toDate);
        return res.status(200).json(handleSuccessResponse(200, 'OK', revenue));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/reports/popular-movies - Phim nổi tiếp nhất
 */
export async function getPopularMovies(req, res) {
    try {
        const { limit = 10 } = req.query;

        const movies = await reportModel.getPopularMovies(parseInt(limit));
        return res.status(200).json(handleSuccessResponse(200, 'OK', movies));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/reports/customer-stats - Thống kê khách hàng
 */
export async function getCustomerStats(req, res) {
    try {
        const stats = await reportModel.getCustomerStats();
        return res.status(200).json(handleSuccessResponse(200, 'OK', stats));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/reports/top-spenders - Top khách hàng chi tiêu nhiều nhất
 */
export async function getTopSpenders(req, res) {
    try {
        const { limit = 10 } = req.query;

        const spenders = await reportModel.getTopSpenders(parseInt(limit));
        return res.status(200).json(handleSuccessResponse(200, 'OK', spenders));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/reports/overview - Thống kê tổng quan
 */
export async function getOverviewStats(req, res) {
    try {
        const { fromDate, toDate } = req.query;
        const overview = await reportModel.getOverviewStats(fromDate, toDate);
        return res.status(200).json(handleSuccessResponse(200, 'OK', overview));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/reports/occupancy-rate - Tỷ lệ nhập tối thiểu
 */
export async function getRoomOccupancyRate(req, res) {
    try {
        const { fromDate, toDate } = req.query;
        const occupancy = await reportModel.getRoomOccupancyRate(fromDate, toDate);
        return res.status(200).json(handleSuccessResponse(200, 'OK', occupancy));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}
