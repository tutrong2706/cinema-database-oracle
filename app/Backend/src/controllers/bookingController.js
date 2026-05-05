import * as screeningModel from '../models/screeningModel.js';
import * as ticketModel from '../models/ticketModel.js';
import * as generalModel from '../models/generalModel.js';
<<<<<<< Updated upstream
import * as orderModel from '../models/orderModel.js';
import { execute } from '../config/database.js';
=======
import * as roomModel from '../models/roomModel.js';
import * as accountModel from '../models/accountModel.js';
import { withTransaction } from '../config/database.js';
>>>>>>> Stashed changes
import { handleSuccessResponse, handleErrorResponse } from '../helpers/responseHandler.js';

const ORDER_PENDING = 'Chờ thanh toán';
const ORDER_PAID = 'Đã thanh toán';
const ORDER_CANCELLED = 'Hủy';

const TICKET_BOOKED = 'Đã đặt';
const TICKET_PAID = 'Đã thanh toán';
const TICKET_CANCELLED = 'Hủy';

const PAYMENT_PAID = 'Đã thanh toán';
const PAYMENT_METHOD = 'Online';

function makeId(prefix) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

function normalizeScreeningForPayment(row) {
    return {
        MaSuatChieu: row.MASUATCHIEU,
        MaPhong: row.MAPHONG,
        GiaVeCoBan: Number(row.GIAVECOBAN || 0),
        GioBatDau: row.GIOBATDAU,
        NgayChieu: row.NGAYCHIEU,
        phim: {
            TenPhim: row.TENPHIM,
        },
        phong_chieu: {
            Ten: row.TENPHONG,
            TenRapPhim: row.TENRAP,
            rap_chieu_phim: {
                Ten: row.TENRAP,
            },
        },
    };
}

async function buildOrderDetail(connection, userId, orderId, oracledb) {
    const orderResult = await connection.execute(
        `SELECT MaDonHang AS MADONHANG,
                TongTien AS TONGTIEN,
                TrangThai AS TRANGTHAI
         FROM DON_HANG
         WHERE MaDonHang = :1
           AND MaNguoiDung_KH = :2`,
        [orderId, userId],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const order = orderResult.rows?.[0];
    if (!order) {
        return null;
    }

    const ticketResult = await connection.execute(
        `SELECT V.MaVe AS MAVE,
                V.HangGhe AS HANGGHE,
                V.SoGhe AS SOGHE,
                SC.MaSuatChieu AS MASUATCHIEU,
                SC.MaPhong AS MAPHONG,
                SC.GiaVeCoBan AS GIAVECOBAN,
                SC.GioBatDau AS GIOBATDAU,
                SC.NgayChieu AS NGAYCHIEU,
                P.TenPhim AS TENPHIM,
                PC.Ten AS TENPHONG,
                RC.Ten AS TENRAP
         FROM VE_XEM_PHIM V
         JOIN SUAT_CHIEU SC ON V.MaSuatChieu = SC.MaSuatChieu
         JOIN PHIM P ON SC.MaPhim = P.MaPhim
         JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
         JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
         WHERE V.MaDonHang = :1
         ORDER BY V.HangGhe, V.SoGhe`,
        [orderId],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const comboResult = await connection.execute(
        `SELECT G.MaHang AS MAHANG,
                G.SoLuong AS SOLUONG,
                G.DonGia AS DONGIA,
                MH.TenHang AS TENHANG,
                MH.MoTa AS MOTA
         FROM GOM G
         JOIN MAT_HANG MH ON G.MaHang = MH.MaHang
         WHERE G.MaDonHang = :1
         ORDER BY G.MaHang`,
        [orderId],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const tickets = ticketResult.rows || [];
    const combos = (comboResult.rows || []).map((combo) => ({
        MaHang: combo.MAHANG,
        TenHang: combo.TENHANG,
        DonGia: Number(combo.DONGIA || 0),
        SoLuong: Number(combo.SOLUONG || 0),
        MoTa: combo.MOTA || '',
    }));

    return {
        MaDonHang: order.MADONHANG,
        TongTien: Number(order.TONGTIEN || 0),
        TrangThai: order.TRANGTHAI,
        suatChieu: tickets.length > 0 ? normalizeScreeningForPayment(tickets[0]) : null,
        seats: tickets.map((ticket) => ({
            HangGhe: ticket.HANGGHE,
            SoGhe: Number(ticket.SOGHE || 0),
        })),
        combos,
    };
}

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
 * GET /suat-chieus/:id/seats - Lấy sơ đồ ghế của suất chiếu
 */
export async function getSeatMap(req, res) {
    try {
        const { id } = req.params;

        const screening = await screeningModel.getScreeningById(id);
        if (!screening) {
            return res.status(404).json(handleErrorResponse(404, 'Suất chiếu không tồn tại'));
        }

        const seats = await roomModel.getRoomSeats(screening.MAPHONG);
        return res.status(200).json(handleSuccessResponse(200, 'OK', seats));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /booking - Tạo đơn hàng đặt vé
 */
export async function createBooking(req, res) {
    try {
        const { userId } = req.user;
        const role = req.user?.vaiTro;
        const {
            MaSuatChieu,
            MaPhong,
            DanhSachGhe = [],
            DanhSachCombo = [],
            isPayLater = false,
        } = req.body;

        if (!MaSuatChieu || !MaPhong || !Array.isArray(DanhSachGhe) || DanhSachGhe.length === 0) {
            return res.status(400).json(handleErrorResponse(400, 'Thiếu thông tin đặt vé'));
        }

        if (role && role !== 'Khach') {
            return res.status(403).json(handleErrorResponse(403, 'Chỉ tài khoản khách hàng mới có thể đặt vé'));
        }

        await accountModel.ensureCustomerProfile(userId);

        const screening = await screeningModel.getScreeningById(MaSuatChieu);
        if (!screening) {
            return res.status(404).json(handleErrorResponse(404, 'Suất chiếu không tồn tại'));
        }

        if (screening.MAPHONG !== MaPhong) {
            return res.status(400).json(handleErrorResponse(400, 'Mã phòng không khớp với suất chiếu'));
        }

        const roomSeats = await roomModel.getRoomSeats(MaPhong);
        const seatMap = new Set(roomSeats.map((seat) => `${seat.HANGGHE ?? seat.HangGhe}-${seat.SOGHE ?? seat.SoGhe}`));
        const bookedSeats = await ticketModel.getBookedSeats(MaSuatChieu);
        const bookedSeatMap = new Set(bookedSeats.map((seat) => `${seat.HANGGHE ?? seat.HangGhe}-${seat.SOGHE ?? seat.SoGhe}`));

        const uniqueSeatMap = new Set();
        for (const seat of DanhSachGhe) {
            const seatKey = `${seat.HangGhe}-${seat.SoGhe}`;
            if (!seatMap.has(seatKey)) {
                return res.status(400).json(handleErrorResponse(400, `Ghế ${seat.HangGhe}${seat.SoGhe} không tồn tại trong phòng`));
            }

            if (bookedSeatMap.has(seatKey)) {
                return res.status(400).json(handleErrorResponse(400, `Ghế ${seat.HangGhe}${seat.SoGhe} đã được đặt`));
            }

            if (uniqueSeatMap.has(seatKey)) {
                return res.status(400).json(handleErrorResponse(400, `Ghế ${seat.HangGhe}${seat.SoGhe} bị trùng trong yêu cầu`));
            }

            uniqueSeatMap.add(seatKey);
        }

        const comboDetails = [];
        for (const combo of DanhSachCombo) {
            const comboInfo = await generalModel.getComboById(combo.MaHang);
            if (!comboInfo) {
                return res.status(404).json(handleErrorResponse(404, `Combo ${combo.MaHang} không tồn tại`));
            }

            comboDetails.push({
                MaHang: comboInfo.MAHANG,
                TenHang: comboInfo.TENHANG,
                DonGia: Number(comboInfo.DONGIA || 0),
                SoLuong: Number(combo.SoLuong || 0),
            });
        }

        const maDonHang = makeId('DH');
        const orderStatus = ORDER_PENDING;

        const result = await withTransaction(async (connection, oracledb) => {
            await connection.execute(
                `INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, TongTien, TrangThai)
                 VALUES (:1, :2, :3, :4, :5)`,
                [maDonHang, userId, PAYMENT_METHOD, 0, orderStatus]
            );

            for (const seat of DanhSachGhe) {
                await connection.execute(
                    `INSERT INTO VE_XEM_PHIM (
                        MaVe,
                        MaSuatChieu,
                        MaPhong,
                        HangGhe,
                        SoGhe,
                        MaNguoiDung_KH,
                        MaDonHang,
                        GiaVeCuoi,
                        TrangThai
                    ) VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9)`,
                    [
                        makeId('VE'),
                        MaSuatChieu,
                        MaPhong,
                        seat.HangGhe,
                        seat.SoGhe,
                        userId,
                        maDonHang,
                        Number(screening.GIAVECOBAN || 0),
                        TICKET_BOOKED,
                    ]
                );
            }

            for (const combo of comboDetails) {
                await connection.execute(
                    `INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia)
                     VALUES (:1, :2, :3, :4)`,
                    [maDonHang, combo.MaHang, combo.SoLuong, combo.DonGia]
                );
            }

            const totalResult = await connection.execute(
                `SELECT TongTien AS TONGTIEN
                 FROM DON_HANG
                 WHERE MaDonHang = :1`,
                [maDonHang],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            const tongTien = Number(totalResult.rows?.[0]?.TONGTIEN || 0);

            if (!isPayLater) {
                await connection.execute(
                    `INSERT INTO THANH_TOAN (
                        MaThanhToan,
                        MaDonHang,
                        PhuongThuc,
                        TrangThai,
                        SoTien
                    ) VALUES (:1, :2, :3, :4, :5)`,
                    [makeId('TT'), maDonHang, PAYMENT_METHOD, PAYMENT_PAID, tongTien]
                );

                await connection.execute(
                    `UPDATE DON_HANG
                     SET TrangThai = :1
                     WHERE MaDonHang = :2`,
                    [ORDER_PAID, maDonHang]
                );

                await connection.execute(
                    `UPDATE VE_XEM_PHIM
                     SET TrangThai = :1
                     WHERE MaDonHang = :2
                       AND TrangThai = :3`,
                    [TICKET_PAID, maDonHang, TICKET_BOOKED]
                );
            }

            return buildOrderDetail(connection, userId, maDonHang, oracledb);
        });

        return res.status(200).json(handleSuccessResponse(200, 'Đặt vé thành công', result));
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
        return res.status(200).json(handleSuccessResponse(200, 'OK', orders));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * GET /orders/:id - Lấy chi tiết đơn hàng cho trang thanh toán
 */
export async function getOrderDetail(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        const detail = await withTransaction((connection, oracledb) =>
            buildOrderDetail(connection, userId, id, oracledb)
        );

        if (!detail) {
            return res.status(404).json(handleErrorResponse(404, 'Không tìm thấy đơn hàng'));
        }

        return res.status(200).json(handleSuccessResponse(200, 'OK', detail));
    } catch (error) {
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /orders/:id/pay - Thanh toán đơn hàng chờ thanh toán
 */
export async function payOrder(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        const detail = await withTransaction(async (connection, oracledb) => {
            const orderResult = await connection.execute(
                `SELECT MaDonHang, TongTien, TrangThai
                 FROM DON_HANG
                 WHERE MaDonHang = :1
                   AND MaNguoiDung_KH = :2`,
                [id, userId],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            const order = orderResult.rows?.[0];
            if (!order) {
                throw new Error('ORDER_NOT_FOUND');
            }

            if (order.TRANGTHAI === ORDER_PAID) {
                throw new Error('ORDER_ALREADY_PAID');
            }

            if (order.TRANGTHAI === ORDER_CANCELLED) {
                throw new Error('ORDER_ALREADY_CANCELLED');
            }

            const paymentResult = await connection.execute(
                `SELECT MaThanhToan
                 FROM THANH_TOAN
                 WHERE MaDonHang = :1`,
                [id],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            if (paymentResult.rows?.length > 0) {
                await connection.execute(
                    `UPDATE THANH_TOAN
                     SET TrangThai = :1,
                         PhuongThuc = :2,
                         SoTien = :3,
                         NgayThanhToan = SYSTIMESTAMP
                     WHERE MaDonHang = :4`,
                    [PAYMENT_PAID, PAYMENT_METHOD, Number(order.TONGTIEN || 0), id]
                );
            } else {
                await connection.execute(
                    `INSERT INTO THANH_TOAN (
                        MaThanhToan,
                        MaDonHang,
                        PhuongThuc,
                        TrangThai,
                        SoTien
                    ) VALUES (:1, :2, :3, :4, :5)`,
                    [makeId('TT'), id, PAYMENT_METHOD, PAYMENT_PAID, Number(order.TONGTIEN || 0)]
                );
            }

            await connection.execute(
                `UPDATE DON_HANG
                 SET TrangThai = :1
                 WHERE MaDonHang = :2`,
                [ORDER_PAID, id]
            );

            await connection.execute(
                `UPDATE VE_XEM_PHIM
                 SET TrangThai = :1
                 WHERE MaDonHang = :2
                   AND TrangThai = :3`,
                [TICKET_PAID, id, TICKET_BOOKED]
            );

            return buildOrderDetail(connection, userId, id, oracledb);
        });

        return res.status(200).json(handleSuccessResponse(200, 'Thanh toán thành công', detail));
    } catch (error) {
        if (error.message === 'ORDER_NOT_FOUND') {
            return res.status(404).json(handleErrorResponse(404, 'Không tìm thấy đơn hàng'));
        }
        if (error.message === 'ORDER_ALREADY_PAID') {
            return res.status(400).json(handleErrorResponse(400, 'Đơn hàng đã thanh toán'));
        }
        if (error.message === 'ORDER_ALREADY_CANCELLED') {
            return res.status(400).json(handleErrorResponse(400, 'Đơn hàng đã bị hủy'));
        }
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /orders/:id/cancel - Hủy đơn hàng chờ thanh toán
 */
export async function cancelOrder(req, res) {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        const detail = await withTransaction(async (connection, oracledb) => {
            const orderResult = await connection.execute(
                `SELECT MaDonHang, TrangThai
                 FROM DON_HANG
                 WHERE MaDonHang = :1
                   AND MaNguoiDung_KH = :2`,
                [id, userId],
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            const order = orderResult.rows?.[0];
            if (!order) {
                throw new Error('ORDER_NOT_FOUND');
            }

            if (order.TRANGTHAI === ORDER_PAID) {
                throw new Error('PAID_ORDER_CANNOT_CANCEL');
            }

            if (order.TRANGTHAI === ORDER_CANCELLED) {
                throw new Error('ORDER_ALREADY_CANCELLED');
            }

            await connection.execute(
                `UPDATE DON_HANG SET TrangThai = :1 WHERE MaDonHang = :2`,
                [ORDER_CANCELLED, id]
            );

            await connection.execute(
                `UPDATE VE_XEM_PHIM SET TrangThai = :1 WHERE MaDonHang = :2`,
                [TICKET_CANCELLED, id]
            );

            return buildOrderDetail(connection, userId, id, oracledb);
        });

        return res.status(200).json(handleSuccessResponse(200, 'Hủy đơn hàng thành công', detail));
    } catch (error) {
        if (error.message === 'ORDER_NOT_FOUND') {
            return res.status(404).json(handleErrorResponse(404, 'Không tìm thấy đơn hàng'));
        }
        if (error.message === 'PAID_ORDER_CANNOT_CANCEL') {
            return res.status(400).json(handleErrorResponse(400, 'Đơn hàng đã thanh toán nên không thể hủy'));
        }
        if (error.message === 'ORDER_ALREADY_CANCELLED') {
            return res.status(400).json(handleErrorResponse(400, 'Đơn hàng đã bị hủy'));
        }
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

        const orderStatus = 'Chờ thanh toán';

        // Tạo đơn hàng
        await orderModel.createOrder({
            MaDonHang: maDonHang,
            MaNguoiDung_KH: userId,
            PhuongThuc: 'Trực tuyến',
            TongTien: totalPrice, // Để 0 cho Oracle tự tính
            TrangThai: 'Chờ thanh toán' // BƯỚC 1: LUÔN ÉP CỨNG LÀ CHỜ THANH TOÁN
        });

        // Tạo vé cho mỗi ghế
        for (const ghe of DanhSachGhe) {
            // 🛠 SỬA TẠI ĐÂY: Đảm bảo sinh chuỗi ID hợp lệ và không quá 20 ký tự
            const thoiGian = String(Date.now()).slice(-6); // Lấy 6 số cuối timestamp
            const ngauNhien = Math.floor(Math.random() * 1000); // Thêm số ngẫu nhiên 3 chữ số
            const maVe = `V${thoiGian}${ngauNhien}`; // Ví dụ: V84123456 (Tổng 10 ký tự, rất an toàn)

            // Gọi Model để insert vào DB
            await ticketModel.createTicket({
                MaVe: maVe, // Chắc chắn không NULL
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

        // BƯỚC 2: CÚ CHỐT HẠ KÍCH HOẠT TRIGGER
        // Sau khi Insert xong hết, Oracle đã cộng đủ Tổng Tiền.
        // Nếu khách KHÔNG chọn thanh toán sau (tức là thanh toán ngay) -> Gọi Update!
        if (!isPayLater) {
            // Lệnh Update này sẽ đánh thức toàn bộ Trigger: Cộng điểm, ghi lịch sử, đổi trạng thái vé!
            await orderModel.updateOrderStatus(maDonHang, 'Đã thanh toán');
        }

        // Chỉnh lại response trả về cho đúng
        const finalStatus = isPayLater ? 'Chờ thanh toán' : 'Đã thanh toán';
        return res.status(201).json(handleSuccessResponse(201, 'Tạo đơn hàng thành công', {
            MaDonHang: maDonHang,
            TrangThai: finalStatus
        }));
    } catch (error) {
        console.error('❌ Error creating booking:', error);
        return res.status(500).json(handleErrorResponse(500, error.message));
    }
}

/**
 * POST /orders/:id/pay - Thanh toán đơn hàng cũ (Từ tính năng Thanh Toán Sau)
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
            return res.status(400).json(handleErrorResponse(400, 'Đơn hàng đã được thanh toán rồi'));
        }

        // 1. Cập nhật trạng thái đơn hàng -> Đã thanh toán
        await orderModel.updateOrderStatus(id, 'Đã thanh toán');

        // 2. Cập nhật trạng thái các vé liên quan -> Đã thanh toán
        const ticketsOfOrder = await ticketModel.getTicketsByOrder(id);
        for (const ticket of ticketsOfOrder) {
            await ticketModel.updateTicketStatus(ticket.MAVE, 'Đã thanh toán');
        }

        // 3. GHI NHẬN LỊCH SỬ THANH TOÁN (Khắc phục lỗi mất đơn hàng ở báo cáo)
        const maThanhToan = `TT_${String(Date.now()).slice(-6)}_${Math.floor(Math.random() * 1000)}`;
        await execute(`
            INSERT INTO THANH_TOAN (MaThanhToan, MaDonHang, PhuongThuc, TrangThai, SoTien)
            VALUES (:1, :2, :3, 'Đã thanh toán', :4)
        `, [maThanhToan, id, order.PHUONGTHUC || 'Trực tuyến', order.TONGTIEN]);

        // 4. CỘNG ĐIỂM TÍCH LŨY (Tỉ lệ 10.000 VNĐ = 1 điểm)
        const diemCong = Math.round((order.TONGTIEN || 0) / 10000);
        await execute(`
            UPDATE KHACH_HANG 
            SET DiemTichLuy = NVL(DiemTichLuy, 0) + :1
            WHERE MaNguoiDung = :2
        `, [diemCong, order.MANGUOIDUNG]);
        
        // 5. TỰ ĐỘNG XÉT THĂNG HẠNG THÀNH VIÊN
        await execute(`
            UPDATE KHACH_HANG
            SET LoaiThanhVien = CASE 
                WHEN DiemTichLuy >= 1000 THEN 'Platinum'
                WHEN DiemTichLuy >= 500  THEN 'Gold'
                WHEN DiemTichLuy >= 200  THEN 'Silver'
                ELSE 'Bronze'
            END
            WHERE MaNguoiDung = :1
        `, [order.MANGUOIDUNG]);

        return res.status(200).json(handleSuccessResponse(200, 'Thanh toán đơn hàng cũ thành công!'));
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
