import * as reviewModel from '../models/reviewModel.js';
import * as movieModel from '../models/movieModel.js';
import { handleSuccessResponse, handleErrorResponse } from '../helpers/responseHandler.js';

/**
 * GET /api/reviews/:maPhim - Lấy đánh giá phim
 */
export async function getMovieReviews(req, res) {
    try {
        const { maPhim } = req.params;

        // Check movie exists
        const phim = await movieModel.getMovieById(maPhim);
        if (!phim) {
            return res.status(404).json(handleErrorResponse(404, 'Phim không tồn tại'));
        }

        const reviews = await reviewModel.getMovieReviews(maPhim);
        const avgRating = await reviewModel.getMovieAverageRating(maPhim);
        const distribution = await reviewModel.getRatingDistribution(maPhim);

        return res.status(200).json(handleSuccessResponse(200, 'OK', {
            reviews: reviews,
            averageRating: avgRating?.DIEMTRUNGBINH || 0,
            totalReviews: avgRating?.SOLUOTDANHGIA || 0,
            distribution: distribution
        }));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/reviews/:reviewId - Lấy chi tiết đánh giá
 */
export async function getReviewById(req, res) {
    try {
        const { reviewId } = req.params;

        const review = await reviewModel.getReviewById(reviewId);
        if (!review) {
            return res.status(404).json(handleErrorResponse(404, 'Đánh giá không tồn tại'));
        }

        return res.status(200).json(handleSuccessResponse(200, 'OK', review));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/customer/reviews - Lấy đánh giá của customer
 */
export async function getMyReviews(req, res) {
    try {
        const maNguoiDung = req.user?.MaNguoiDung;
        if (!maNguoiDung) {
            return res.status(401).json(handleErrorResponse(401, 'Chưa đăng nhập'));
        }

        const reviews = await reviewModel.getCustomerReviews(maNguoiDung);
        return res.status(200).json(handleSuccessResponse(200, 'OK', reviews));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /api/reviews/:maPhim - Tạo đánh giá
 */
export async function createReview(req, res) {
    try {
        const { maPhim } = req.params;
        const maNguoiDung = req.user?.MaNguoiDung;
        const { Diem, NoiDung } = req.body;

        if (!maNguoiDung) {
            return res.status(401).json(handleErrorResponse(401, 'Chưa đăng nhập'));
        }

        if (!Diem || Diem < 1 || Diem > 5) {
            return res.status(400).json(handleErrorResponse(400, 'Điểm phải từ 1 đến 5'));
        }

        // Check if already reviewed
        const existing = await reviewModel.hasReviewed(maNguoiDung, maPhim);
        if (existing) {
            return res.status(400).json(handleErrorResponse(400, 'Bạn đã đánh giá phim này rồi'));
        }

        const result = await reviewModel.createReview({
            MaPhim: maPhim,
            MaNguoiDung: maNguoiDung,
            Diem: Diem,
            NoiDung: NoiDung || '',
            NgayDanhGia: new Date()
        });

        return res.status(201).json(handleSuccessResponse(201, 'Đánh giá phim thành công', result));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * PUT /api/reviews/:reviewId - Cập nhật đánh giá
 */
export async function updateReview(req, res) {
    try {
        const { reviewId } = req.params;
        const maNguoiDung = req.user?.MaNguoiDung;
        const { Diem, NoiDung } = req.body;

        if (!maNguoiDung) {
            return res.status(401).json(handleErrorResponse(401, 'Chưa đăng nhập'));
        }

        const review = await reviewModel.getReviewById(reviewId);
        if (!review) {
            return res.status(404).json(handleErrorResponse(404, 'Đánh giá không tồn tại'));
        }

        if (review.MANGUOIDUNG !== maNguoiDung) {
            return res.status(403).json(handleErrorResponse(403, 'Bạn không có quyền chỉnh sửa'));
        }

        await reviewModel.updateReview(reviewId, { Diem, NoiDung });
        return res.status(200).json(handleSuccessResponse(200, 'Cập nhật đánh giá thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * DELETE /api/reviews/:reviewId - Xóa đánh giá
 */
export async function deleteReview(req, res) {
    try {
        const { reviewId } = req.params;
        const maNguoiDung = req.user?.MaNguoiDung;

        if (!maNguoiDung) {
            return res.status(401).json(handleErrorResponse(401, 'Chưa đăng nhập'));
        }

        const review = await reviewModel.getReviewById(reviewId);
        if (!review) {
            return res.status(404).json(handleErrorResponse(404, 'Đánh giá không tồn tại'));
        }

        if (review.MANGUOIDUNG !== maNguoiDung) {
            return res.status(403).json(handleErrorResponse(403, 'Bạn không có quyền xóa'));
        }

        await reviewModel.deleteReview(reviewId);
        return res.status(200).json(handleSuccessResponse(200, 'Xóa đánh giá thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}
