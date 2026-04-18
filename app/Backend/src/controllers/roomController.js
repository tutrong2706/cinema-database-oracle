import * as roomModel from '../models/roomModel.js';
import * as generalModel from '../models/generalModel.js';
import { handleSuccessResponse, handleErrorResponse } from '../helpers/responseHandler.js';

/**
 * GET /api/rooms - Lấy tất cả phòng chiếu
 */
export async function getAllRooms(req, res) {
    try {
        const rooms = await roomModel.getAllRooms();
        return res.status(200).json(handleSuccessResponse(200, 'OK', rooms));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/rooms/:id - Lấy chi tiết phòng
 */
export async function getRoomById(req, res) {
    try {
        const { id } = req.params;

        const room = await roomModel.getRoomById(id);
        if (!room) {
            return res.status(404).json(handleErrorResponse(404, 'Phòng chiếu không tồn tại'));
        }

        const seats = await roomModel.getRoomSeats(id);
        return res.status(200).json(handleSuccessResponse(200, 'OK', {
            ...room,
            seats: seats
        }));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/rooms/cinema/:cinemaId - Lấy phòng theo rạp
 */
export async function getRoomsBycinema(req, res) {
    try {
        const { cinemaId } = req.params;

        // Check cinema exists
        const cinema = await generalModel.getCinemaById(cinemaId);
        if (!cinema) {
            return res.status(404).json(handleErrorResponse(404, 'Rạp không tồn tại'));
        }

        const rooms = await roomModel.getRoomsBycinema(cinemaId);
        return res.status(200).json(handleSuccessResponse(200, 'OK', rooms));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /api/admin/rooms - Tạo phòng chiếu (admin only)
 */
export async function createRoom(req, res) {
    try {
        const { MaRapPhim, TenPhong, SoChoNgoi } = req.body;

        if (!MaRapPhim || !TenPhong || !SoChoNgoi) {
            return res.status(400).json(handleErrorResponse(400, 'MaRapPhim, TenPhong, SoChoNgoi bắt buộc'));
        }

        const result = await roomModel.createRoom({
            MaRapPhim,
            TenPhong,
            SoChoNgoi
        });

        return res.status(201).json(handleSuccessResponse(201, 'Tạo phòng chiếu thành công', result));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * PUT /api/admin/rooms/:id - Cập nhật phòng chiếu (admin only)
 */
export async function updateRoom(req, res) {
    try {
        const { id } = req.params;
        const { TenPhong, SoChoNgoi } = req.body;

        const room = await roomModel.getRoomById(id);
        if (!room) {
            return res.status(404).json(handleErrorResponse(404, 'Phòng chiếu không tồn tại'));
        }

        await roomModel.updateRoom(id, { TenPhong, SoChoNgoi });
        return res.status(200).json(handleSuccessResponse(200, 'Cập nhật phòng chiếu thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * DELETE /api/admin/rooms/:id - Xóa phòng chiếu (admin only)
 */
export async function deleteRoom(req, res) {
    try {
        const { id } = req.params;

        const room = await roomModel.getRoomById(id);
        if (!room) {
            return res.status(404).json(handleErrorResponse(404, 'Phòng chiếu không tồn tại'));
        }

        await roomModel.deleteRoom(id);
        return res.status(200).json(handleSuccessResponse(200, 'Xóa phòng chiếu thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /api/rooms/:id/seats - Lấy danh sách ghế
 */
export async function getRoomSeats(req, res) {
    try {
        const { id } = req.params;

        const room = await roomModel.getRoomById(id);
        if (!room) {
            return res.status(404).json(handleErrorResponse(404, 'Phòng chiếu không tồn tại'));
        }

        const seats = await roomModel.getRoomSeats(id);
        return res.status(200).json(handleSuccessResponse(200, 'OK', seats));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /api/admin/rooms/:id/seats - Thêm ghế (admin only)
 */
export async function addSeat(req, res) {
    try {
        const { id } = req.params;
        const { SoHieu, LoaiGhe } = req.body;

        if (!SoHieu) {
            return res.status(400).json(handleErrorResponse(400, 'SoHieu bắt buộc'));
        }

        const room = await roomModel.getRoomById(id);
        if (!room) {
            return res.status(404).json(handleErrorResponse(404, 'Phòng chiếu không tồn tại'));
        }

        const result = await roomModel.addSeat({
            MaPhong: id,
            SoHieu,
            LoaiGhe: LoaiGhe || 'Thường'
        });

        return res.status(201).json(handleSuccessResponse(201, 'Thêm ghế thành công', result));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * DELETE /api/admin/seats/:seatId - Xóa ghế (admin only)
 */
export async function deleteSeat(req, res) {
    try {
        const { seatId } = req.params;

        await roomModel.deleteSeat(seatId);
        return res.status(200).json(handleSuccessResponse(200, 'Xóa ghế thành công'));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}
