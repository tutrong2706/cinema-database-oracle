import { query, execute } from '../config/database.js';

/**
 * Lấy danh sách vé
 */
export async function getAllTickets() {
    const sql = `
        SELECT V.MaVe, V.MaSuatChieu, V.MaNguoiDung_KH, V.HangGhe, V.SoGhe, V.GiaVeCuoi, 
               V.TrangThai, V.NgayDat, SC.MaPhim, P.TenPhim, PC.Ten AS TENPHONG, RC.Ten AS TENRAP
        FROM VE_XEM_PHIM V
        JOIN SUAT_CHIEU SC ON V.MaSuatChieu = SC.MaSuatChieu
        JOIN PHIM P ON SC.MaPhim = P.MaPhim
        JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
        JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
        ORDER BY V.NgayDat DESC
    `;
    return await query(sql);
}

/**
 * Lấy vé theo ID
 */
export async function getTicketById(maVe) {
    const sql = `
        SELECT V.MaVe, V.MaSuatChieu, V.MaNguoiDung_KH, V.HangGhe, V.SoGhe, V.GiaVeCuoi, V.TrangThai, V.NgayDat,
               P.TenPhim, RC.Ten AS TENRAP, SC.NgayChieu, SC.GioBatDau
        FROM VE_XEM_PHIM V
        JOIN SUAT_CHIEU SC ON V.MaSuatChieu = SC.MaSuatChieu
        JOIN PHIM P ON SC.MaPhim = P.MaPhim
        JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
        JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
        WHERE V.MaVe = :1
    `;
    const results = await query(sql, [maVe]);
    return results.length > 0 ? results[0] : null;
}

/**
 * Lấy các vé của người dùng
 */
export async function getTicketsByUser(maNguoiDung) {
    const sql = `
        SELECT V.MaVe, V.MaSuatChieu, V.HangGhe, V.SoGhe, V.GiaVeCuoi, V.TrangThai, 
               V.NgayDat, P.TenPhim, SC.NgayChieu, SC.GioBatDau, RC.Ten AS TENRAP
        FROM VE_XEM_PHIM V
        JOIN SUAT_CHIEU SC ON V.MaSuatChieu = SC.MaSuatChieu
        JOIN PHIM P ON SC.MaPhim = P.MaPhim
        JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
        JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
        WHERE V.MaNguoiDung_KH = :1
        ORDER BY V.NgayDat DESC
    `;
    return await query(sql, [maNguoiDung]);
}

/**
 * Lấy các ghế đã đặt của suất chiếu
 */
export async function getBookedSeats(maSuatChieu) {
    const sql = `
        SELECT HangGhe, SoGhe FROM VE_XEM_PHIM
        WHERE MaSuatChieu = :1 AND TrangThai IN ('Đã đặt', 'Đã thanh toán')
    `;
    return await query(sql, [maSuatChieu]);
}

/**
 * Tạo vé
 */
export async function createTicket(ticketData) {
    const { MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, TrangThai } = ticketData;

    const sql = `
        INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, TrangThai)
        VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9)
    `;

    return await execute(sql, [
        MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, TrangThai || 'Đã đặt'
    ]);
}

/**
 * Cập nhật trạng thái vé
 */
export async function updateTicketStatus(maVe, trangThai) {
    const sql = `UPDATE VE_XEM_PHIM SET TrangThai = :1 WHERE MaVe = :2`;
    return await execute(sql, [trangThai, maVe]);
}

/**
 * Xóa vé
 */
export async function deleteTicket(maVe) {
    const sql = `DELETE FROM VE_XEM_PHIM WHERE MaVe = :1`;
    return await execute(sql, [maVe]);
}

/**
 * Kiểm tra ghế đã tồn tại
 */
export async function seatExists(maSuatChieu, hangGhe, soGhe) {
    const sql = `
        SELECT COUNT(*) as CNT FROM VE_XEM_PHIM
        WHERE MaSuatChieu = :1 AND HangGhe = :2 AND SoGhe = :3 AND TrangThai IN ('Đã đặt', 'Đã thanh toán')
    `;
    const results = await query(sql, [maSuatChieu, hangGhe, soGhe]);
    return results[0].CNT > 0;
}
