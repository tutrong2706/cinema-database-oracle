import express from 'express';
import * as movieController from '../controllers/movieController.js';

const router = express.Router();

/**
 * @swagger
 * /phim:
 *   get:
 *     summary: Lấy danh sách tất cả phim
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Danh sách phim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                 message:
 *                   type: string
 *                 meta:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', movieController.getAllMovies);

/**
 * @swagger
 * /phim/search:
 *   get:
 *     summary: Tìm kiếm phim
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 */
router.get('/search', movieController.searchMovies);

/**
 * @swagger
 * /phim/{id}:
 *   get:
 *     summary: Lấy chi tiết phim
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết phim
 *       404:
 *         description: Phim không tồn tại
 */
router.get('/:id', movieController.getMovieDetail);

/**
 * @swagger
 * /phim/{id}/reviews:
 *   get:
 *     summary: Lấy đánh giá phim
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách đánh giá
 *       404:
 *         description: Phim không tồn tại
 */
router.get('/:id/reviews', movieController.getMovieReviews);

export default router;
