import * as movieModel from '../models/movieModel.js';
import { handleSuccessResponse, handleErrorResponse } from '../helpers/responseHandler.js';

/**
 * GET /phim - Lấy danh sách phim
 */
export async function getAllMovies(req, res) {
    try {
        const phims = await movieModel.getAllMovies();
        return res.status(200).json(handleSuccessResponse(200, 'Lấy danh sách phim thành công', phims));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /phim/:id - Lấy chi tiết phim
 */
export async function getMovieDetail(req, res) {
    try {
        const { id } = req.params;
        const phim = await movieModel.getMovieById(id);

        if (!phim) {
            return res.status(404).json(handleErrorResponse(404, 'Phim không tồn tại'));
        }

        return res.status(200).json(handleSuccessResponse(200, 'OK', phim));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /phim/search?keyword=... - Tìm kiếm phim
 */
export async function searchMovies(req, res) {
    try {
        const { keyword = '', genre = '', rating = '0', special = '' } = req.query;
        const phims = await movieModel.searchMovies(keyword, genre, rating, special);
        return res.status(200).json(handleSuccessResponse(200, 'Tìm kiếm thành công', phims));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /phim/:id/reviews - Lấy đánh giá phim
 */
export async function getMovieReviews(req, res) {
    try {
        const { id } = req.params;
        
        // Check movie exists
        const phim = await movieModel.getMovieById(id);
        if (!phim) {
            return res.status(404).json(handleErrorResponse(404, 'Phim không tồn tại'));
        }
        
        // Get reviews & average rating
        const reviews = await movieModel.getMovieReviews(id);
        const avgRating = await movieModel.getMovieAverageRating(id);
        
        return res.status(200).json(handleSuccessResponse(200, 'Lấy đánh giá thành công', {
            reviews: reviews,
            averageRating: avgRating.DIEMTRUNGBINH || 0,
            totalReviews: avgRating.SOLUOTDANHGIA || 0
        }));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}
