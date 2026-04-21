import * as screeningModel from '../models/screeningModel.js';
import * as ticketModel from '../models/ticketModel.js';
import * as generalModel from '../models/generalModel.js';
import * as orderModel from '../models/orderModel.js';
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

/**
 * POST /booking - Tạo đơn hàng mới với vé và combo
 * Body: MaSuatChieu, MaPhong, DanhSachGhe, DanhSachCombo, isPayLater
 */
export async function createBooking(req, res) {
    try {
        const { userId } = req.user;
        const { MaSuatChieu, MaPhong, DanhSachGhe, DanhSachCombo, isPayLater } = req.body;

        // Validate input
        if (!MaSuatChieu || !MaPhong || !DanhSachGhe || DanhSachGhe.length === 0) {
            return res.status(400).json(handleErrorResponse(400, 'MaSuatChieu, MaPhong, và danh sách ghế bắt buộc'));
        }

        // Lấy thông tin suất chiếu
        const suat = await screeningModel.getScreeningById(MaSuatChieu);
        if (!suat) {
            return res.status(404).json(handleErrorResponse(404, 'Suất chiếu không tồn tại'));
        }

        // Tính tổng tiền
        const ticketTotal = DanhSachGhe.length * (suat.GIAVECOBAN || 0);
        let comboTotal = 0;
        
        if (DanhSachCombo && DanhSachCombo.length > 0) {
            for (const combo of DanhSachCombo) {
                const comboItem = await generalModel.getComboById(combo.MaHang);
                if (comboItem) {
                    comboTotal += (comboItem.DONGIA || 0) * (combo.SoLuong || 1);
                }
            }
        }

        const totalPrice = ticketTotal + comboTotal;

        // Tạo mã đơn hàng
        const maDonHang = `DH_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Tạo đơn hàng
        const orderStatus = isPayLater ? 'Chờ thanh toán' : 'Đã thanh toán';
        await orderModel.createOrder({
            MaDonHang: maDonHang,
            MaNguoiDung_KH: userId,
            PhuongThuc: 'Trực tuyến',
            TongTien: totalPrice,
            TrangThai: orderStatus
        });

        // Tạo vé cho mỗi ghế
        for (const ghe of DanhSachGhe) {
            const maVe = `VE_${Date.now()}_${Math.random() * 10000}`;
            await ticketModel.createTicket({
                MaVe: maVe,
                MaSuatChieu: MaSuatChieu,
                MaPhong: MaPhong,
                HangGhe: ghe.HangGhe,
                SoGhe: ghe.SoGhe,
                MaNguoiDung_KH: userId,
                MaDonHang: maDonHang,
                GiaVeCuoi: suat.GIAVECOBAN,
                TrangThai: orderStatus
            });
        }

        // Thêm combo vào đơn hàng nếu có
        if (DanhSachCombo && DanhSachCombo.length > 0) {
            for (const combo of DanhSachCombo) {
                const comboItem = await generalModel.getComboById(combo.MaHang);
                if (comboItem) {
                    await orderModel.addOrderItem(
                        maDonHang,
                        combo.MaHang,
                        combo.SoLuong || 1,
                        comboItem.DONGIA || 0
                    );
                }
            }
        }

        return res.status(201).json(handleSuccessResponse(201, 'Tạo đơn hàng thành công', {
            MaDonHang: maDonHang,
            TongTien: totalPrice,
            TrangThai: orderStatus
        }));
    } catch (error) {
        console.error('❌ Error creating booking:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /orders/:id/pay - Thanh toán đơn hàng
 */
export async function payOrder(req, res) {
    try {
        const { id } = req.params;

        // Kiểm tra đơn hàng tồn tại
        const order = await orderModel.getOrderById(id);
        if (!order) {
            return res.status(404).json(handleErrorResponse(404, 'Đơn hàng không tồn tại'));
        }

        if (order.TRANGTHAI === 'Đã thanh toán') {
            return res.status(400).json(handleErrorResponse(400, 'Đơn hàng đã thanh toán'));
        }

        // Cập nhật trạng thái đơn hàng
        await orderModel.updateOrderStatus(id, 'Đã thanh toán');

        // Cập nhật trạng thái vé liên quan
        const ticketsOfOrder = await ticketModel.getTicketsByOrder(id);
        for (const ticket of ticketsOfOrder) {
            await ticketModel.updateTicketStatus(ticket.MAVE, 'Đã thanh toán');
        }

        return res.status(200).json(handleSuccessResponse(200, 'Thanh toán thành công'));
    } catch (error) {
        console.error('❌ Error paying order:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /orders/:id/cancel - Hủy đơn hàng
 */
export async function cancelOrder(req, res) {
    try {
        const { id } = req.params;

        // Kiểm tra đơn hàng tồn tại
        const order = await orderModel.getOrderById(id);
        if (!order) {
            return res.status(404).json(handleErrorResponse(404, 'Đơn hàng không tồn tại'));
        }

        if (order.TRANGTHAI === 'Hủy' || order.TRANGTHAI === 'Đã thanh toán') {
            return res.status(400).json(handleErrorResponse(400, 'Không thể hủy đơn hàng này'));
        }

        // Cập nhật trạng thái đơn hàng
        await orderModel.updateOrderStatus(id, 'Hủy');

        // Cập nhật trạng thái vé liên quan
        const ticketsOfOrder = await ticketModel.getTicketsByOrder(id);
        for (const ticket of ticketsOfOrder) {
            await ticketModel.updateTicketStatus(ticket.MAVE, 'Hủy');
        }

        return res.status(200).json(handleSuccessResponse(200, 'Hủy đơn hàng thành công'));
    } catch (error) {
        console.error('❌ Error canceling order:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}
