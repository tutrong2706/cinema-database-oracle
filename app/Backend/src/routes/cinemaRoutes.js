import express from 'express';
import * as generalModel from '../models/generalModel.js';
import * as roomModel from '../models/roomModel.js';
import { handleSuccessResponse, handleErrorResponse } from '../helpers/responseHandler.js';

const router = express.Router();

/**
 * GET /rap - Lấy danh sách rạp chiếu phim
 */
router.get('/rap', async (req, res) => {
    try {
        const cinemas = await generalModel.getAllCinemas();
        return res.status(200).json(handleSuccessResponse(200, 'OK', cinemas));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
});

/**
 * GET /rap/:id - Lấy chi tiết rạp
 */
router.get('/rap/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cinema = await generalModel.getCinemaById(id);
        if (!cinema) {
            return res.status(404).json(handleErrorResponse(404, 'Rạp không tồn tại'));
        }
        return res.status(200).json(handleSuccessResponse(200, 'OK', cinema));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
});

/**
 * GET /phong - Lấy danh sách phòng (có filter theo rạp)
 * Query params: rap (optional - MaRapPhim)
 */
router.get('/phong', async (req, res) => {
    try {
        const { rap } = req.query;

        let rooms;
        if (rap) {
            // Fetch phòng của rạp cụ thể
            rooms = await roomModel.getRoomsBycinema(rap);
        } else {
            // Fetch tất cả phòng
            rooms = await roomModel.getAllRooms();
        }

        return res.status(200).json(handleSuccessResponse(200, 'OK', rooms));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
});

/**
 * GET /phong/:id - Lấy chi tiết phòng
 */
router.get('/phong/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const room = await roomModel.getRoomById(id);
        if (!room) {
            return res.status(404).json(handleErrorResponse(404, 'Phòng không tồn tại'));
        }
        return res.status(200).json(handleSuccessResponse(200, 'OK', room));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
});

export default router;
