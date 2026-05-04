import { query, execute } from '../config/database.js';

/**
 * Lấy danh sách rạp
 */
export async function getAllCinemas() {
    const sql = `SELECT MaRapPhim AS MARAPHIM, Ten AS TEN, ThanhPho AS THANHPHO, DiaChi AS DIACHI, SDT AS SODIENTHOAI FROM RAP_CHIEU_PHIM ORDER BY Ten`;
    return await query(sql);
}

/**
 * Lấy rạp theo ID
 */
export async function getCinemaById(maRap) {
    const sql = `SELECT MaRapPhim AS MARAPHIM, Ten AS TEN, ThanhPho AS THANHPHO, DiaChi AS DIACHI, SDT AS SODIENTHOAI FROM RAP_CHIEU_PHIM WHERE MaRapPhim = :1`;
    const results = await query(sql, [maRap]);
    return results.length > 0 ? results[0] : null;
}

/**
 * Lấy danh sách combo
 */
export async function getAllCombos() {
    const sql = `SELECT MaHang AS MAHANG, TenHang AS TENHANG, DonGia AS DONGIA, MoTa AS MOTA FROM MAT_HANG ORDER BY TenHang`;
    return await query(sql);
}

/**
 * Lấy combo theo ID
 */
export async function getComboById(maHang) {
    const sql = `SELECT MaHang AS MAHANG, TenHang AS TENHANG, DonGia AS DONGIA, MoTa AS MOTA FROM MAT_HANG WHERE MaHang = :1`;
    const results = await query(sql, [maHang]);
    return results.length > 0 ? results[0] : null;
}

/**
 * Lấy danh sách đơn hàng
 */
export async function getAllOrders() {
    const sql = `
        SELECT DH.MaDonHang AS MADONHANG, DH.MaNguoiDung_KH AS MANGUOIDUNG, DH.PhuongThuc AS PHUONGTHUC,
               DH.ThoiGianDat AS THOIGIANDAT, DH.TongTien AS TONGTIEN, DH.TrangThai AS TRANGTHAI,
               TK.HoTen AS HOTEN, TK.Email AS EMAIL, TK.SDT
        FROM DON_HANG DH
        LEFT JOIN KHACH_HANG KH ON DH.MaNguoiDung_KH = KH.MaNguoiDung
        LEFT JOIN TAI_KHOAN TK ON DH.MaNguoiDung_KH = TK.MaNguoiDung
        ORDER BY DH.ThoiGianDat DESC
    `;
    return await query(sql);
}

/**
 * Lấy đơn hàng của người dùng
 */
export async function getOrdersByUser(maNguoiDung) {
    const sql = `
        SELECT 
            DH.MaDonHang AS MADONHANG,
            DH.ThoiGianDat AS THOIGIANDAT,
            DH.TongTien AS TONGTIEN,
            DH.TrangThai AS TRANGTHAI,
            DH.MaNguoiDung_KH AS MANGUOIDUNG
        FROM DON_HANG DH
        WHERE DH.MaNguoiDung_KH = :1
        ORDER BY DH.ThoiGianDat DESC
    `;
    return await query(sql, [maNguoiDung]);
}

/**
 * Lấy chi tiết đơn hàng (đầy đủ: order + screening + tickets + combos)
 */
export async function getOrderDetail(maDonHang) {
    // Lấy thông tin đơn hàng + suất chiếu + phim + rạp
    const orderSql = `
        SELECT DH.MaDonHang AS MADONHANG, DH.MaNguoiDung_KH AS MANGUOIDUNG, 
               DH.PhuongThuc AS PHUONGTHUC, DH.ThoiGianDat AS THOIGIANDAT, 
               DH.TongTien AS TONGTIEN, DH.TrangThai AS TRANGTHAI,
               TK.HoTen AS HOTEN, TK.Email AS EMAIL, TK.SDT,
               SC.MaSuatChieu AS MASUATCHIEU, SC.GioBatDau AS GIOBATDAU, 
               SC.GioKetThuc AS GIOKETHUC, SC.NgayChieu AS NGAYCHIEU, SC.MaPhong AS MAPHONG,
               PH.TenPhim AS TENPHIM,
               RC.TenRap AS TENRAP
        FROM DON_HANG DH
        JOIN KHACH_HANG KH ON DH.MaNguoiDung_KH = KH.MaNguoiDung
        JOIN TAI_KHOAN TK ON KH.MaNguoiDung = TK.MaNguoiDung
        JOIN VE_XEM_PHIM VE ON DH.MaDonHang = VE.MaDonHang
        JOIN SUAT_CHIEU SC ON VE.MaSuatChieu = SC.MaSuatChieu
        JOIN PHIM PH ON SC.MaPhim = PH.MaPhim
        JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
        JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
        WHERE DH.MaDonHang = :1
        FETCH FIRST 1 ROWS ONLY
    `;
    
    const orderInfo = await query(orderSql, [maDonHang]);
    if (orderInfo.length === 0) return null;
    
    const baseOrder = orderInfo[0];
    
    // Lấy danh sách vé
    const ticketsSql = `
        SELECT VE.MaVe AS MAVE, VE.HangGhe AS HANGGHE, VE.SoGhe AS SOGHE, 
               VE.GiaVeCuoi AS GIAVEDUOI, VE.TrangThai AS TRANGTHAI
        FROM VE_XEM_PHIM VE
        WHERE VE.MaDonHang = :1
    `;
    const tickets = await query(ticketsSql, [maDonHang]);
    
    // Lấy danh sách combo
    const combosSql = `
        SELECT GOM.MaDonHang AS MADONHANG, GOM.MaHang AS MAHANG, GOM.SoLuong AS SOLUONG, 
               GOM.DonGia AS DONGIA, MH.TenHang AS TENHANG, MH.LoaiHang AS LOAIHANG
        FROM GOM
        LEFT JOIN MAT_HANG MH ON GOM.MaHang = MH.MaHang
        WHERE GOM.MaDonHang = :1
    `;
    const combos = await query(combosSql, [maDonHang]);
    
    return {
        ...baseOrder,
        seats: tickets,
        combos: combos
    };
}

/**
 * Tạo đơn hàng
 */
export async function createOrder(orderData) {
    const { MaDonHang, MaNguoiDung, TongTien, TrangThai } = orderData;

    const sql = `
        INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, ThoiGianDat, TongTien, TrangThai)
        VALUES (:1, :2, SYSDATE, :3, :4)
    `;

    return await execute(sql, [MaDonHang, MaNguoiDung, TongTien, TrangThai || 'Chờ thanh toán']);
}

/**
 * Thêm chi tiết đơn hàng
 */
export async function addOrderDetail(orderDetailData) {
    const { MaCT, MaDonHang, MaVe, MaHang, SoLuong, DonGia, ThanhTien } = orderDetailData;

    const sql = `
        INSERT INTO CHI_TIET_DON_HANG (MaCT, MaDonHang, MaVe, MaHang, SoLuong, DonGia, ThanhTien)
        VALUES (:1, :2, :3, :4, :5, :6, :7)
    `;

    return await execute(sql, [MaCT, MaDonHang, MaVe, MaHang, SoLuong, DonGia, ThanhTien]);
}

/**
 * Cập nhật trạng thái đơn hàng
 */
export async function updateOrderStatus(maDonHang, trangThai) {
    const sql = `UPDATE DON_HANG SET TrangThai = :1 WHERE MaDonHang = :2`;
    return await execute(sql, [trangThai, maDonHang]);
}

/**
 * Lấy doanh thu
 */
export async function getRevenue(startDate = null, endDate = null) {
    let sql = `
        SELECT SUM(TongTien) AS TONGDOANHTHU, COUNT(*) AS SODONHANG
        FROM DON_HANG
        WHERE TrangThai = 'Đã thanh toán'
    `;

    const params = [];

    if (startDate) {
        sql += ` AND ThoiGianDat >= TO_DATE(:${params.length + 1}, 'YYYY-MM-DD')`;
        params.push(startDate);
    }

    if (endDate) {
        sql += ` AND ThoiGianDat <= TO_DATE(:${params.length + 1}, 'YYYY-MM-DD')`;
        params.push(endDate);
    }

    const results = await query(sql, params);
    return results.length > 0 ? results[0] : { TONGDOANHTHU: 0, SODONHANG: 0 };
}
