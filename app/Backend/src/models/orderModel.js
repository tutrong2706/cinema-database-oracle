import { query, execute } from '../config/database.js';

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
 * Lấy đơn hàng theo ID với đầy đủ thông tin (phim, rạp, suất chiếu, ghế, combo)
 */
export async function getOrderById(maDonHang) {
    // Lấy thông tin đơn hàng cơ bản
    const orderSql = `
        SELECT DH.MaDonHang AS MADONHANG, 
               DH.MaNguoiDung_KH AS MANGUOIDUNG,
               DH.ThoiGianDat AS THOIGIANDAT,
               DH.TongTien AS TONGTIEN, 
               DH.TrangThai AS TRANGTHAI
        FROM DON_HANG DH
        WHERE DH.MaDonHang = :1
    `;
    const orderResults = await query(orderSql, [maDonHang]);
    if (orderResults.length === 0) return null;

    const order = orderResults[0];

    // Lấy thông tin vé (phim, rạp, suất chiếu, ghế)
    const ticketSql = `
        SELECT DISTINCT
               SC.MaSuatChieu AS MASUATCHIEU,
               P.TenPhim AS TENPHIM,
               RC.Ten AS TENRAP,
               SC.NgayChieu AS NGAYCHIEU,
               SC.GioBatDau AS GIOBATDAU,
               SC.GioKetThuc AS GIOKETHUC,
               PC.MaPhong AS MAPHONG,
               P.Anh AS ANH,
               P.DoTuoi AS DOTUOI
        FROM VE_XEM_PHIM V
        JOIN SUAT_CHIEU SC ON V.MaSuatChieu = SC.MaSuatChieu
        JOIN PHIM P ON SC.MaPhim = P.MaPhim
        JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
        JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
        WHERE V.MaDonHang = :1
        FETCH FIRST 1 ROWS ONLY
    `;
    const ticketResults = await query(ticketSql, [maDonHang]);
    const suatChieu = ticketResults.length > 0 ? ticketResults[0] : null;

    // Lấy danh sách ghế đã đặt
    const seatsSql = `
        SELECT V.MaVe,
               V.HangGhe,
               V.SoGhe,
               V.GiaVeCuoi,
               V.TrangThai
        FROM VE_XEM_PHIM V
        WHERE V.MaDonHang = :1
    `;
    const seatsResults = await query(seatsSql, [maDonHang]);

    // Lấy danh sách combo (mặt hàng) trong đơn hàng
    const comboSql = `
        SELECT G.MaHang AS MAHANG,
               MH.TenHang AS TENHANG,
               G.SoLuong AS SOLUONG,
               G.DonGia AS DONGIA
        FROM GOM G
        JOIN MAT_HANG MH ON G.MaHang = MH.MaHang
        WHERE G.MaDonHang = :1
    `;
    const comboResults = await query(comboSql, [maDonHang]);

    // Trả về đầy đủ dữ liệu
    return {
        ...order,
        suatChieu: suatChieu,
        seats: seatsResults,
        combos: comboResults
    };
}



/**
 * Lấy các mặt hàng trong đơn hàng
 */
export async function getOrderItems(maDonHang) {
    const sql = `
        SELECT G.MaDonHang AS MADONHANG, G.MaHang AS MAHANG, G.SoLuong AS SOLUONG, G.DonGia AS DONGIA,
               MH.TenHang AS TENHANG, (G.SoLuong * G.DonGia) AS TONG
        FROM GOM G
        JOIN MAT_HANG MH ON G.MaHang = MH.MaHang
        WHERE G.MaDonHang = :1
    `;
    return await query(sql, [maDonHang]);
}

/**
 * Lấy đơn hàng của khách hàng
 */
export async function getCustomerOrders(maNguoiDung) {
    const sql = `
        SELECT 
            DH.MaDonHang AS MADONHANG, 
            DH.ThoiGianDat AS THOIGIANDAT, 
            DH.TongTien AS TONGTIEN, 
            DH.TrangThai AS TRANGTHAI,
            -- Lấy thông tin phim và rạp (dùng LISTAGG để gộp nếu có nhiều vé)
            (SELECT LISTAGG(P.TenPhim || ' (' || RC.Ten || ')', ', ') WITHIN GROUP (ORDER BY P.TenPhim)
             FROM VE_XEM_PHIM V
             JOIN SUAT_CHIEU SC ON V.MaSuatChieu = SC.MaSuatChieu
             JOIN PHIM P ON SC.MaPhim = P.MaPhim
             JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
             JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
             WHERE V.MaDonHang = DH.MaDonHang) AS THONG_TIN_PHIM,
            -- Lấy danh sách ghế
            (SELECT LISTAGG(V.HangGhe || V.SoGhe, ', ') WITHIN GROUP (ORDER BY V.HangGhe, V.SoGhe)
             FROM VE_XEM_PHIM V
             WHERE V.MaDonHang = DH.MaDonHang) AS DANH_SACH_GHE
        FROM DON_HANG DH
        WHERE DH.MaNguoiDung_KH = :1
        ORDER BY DH.ThoiGianDat DESC -- Sắp xếp mới nhất lên đầu
    `;
    return await query(sql, [maNguoiDung]);
}

/**
 * Tạo đơn hàng mới
 */
export async function createOrder(orderData) {
    const { MaDonHang, MaNguoiDung_KH, PhuongThuc, TongTien, TrangThai } = orderData;

    // Ép Oracle lấy giờ hiện tại cộng thêm 7 tiếng (Múi giờ VN)
    const sql = `
        INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, TongTien, TrangThai, ThoiGianDat)
        VALUES (:1, :2, :3, :4, :5, SYSTIMESTAMP + INTERVAL '7' HOUR)
    `;

    return await execute(sql, [
        MaDonHang, 
        MaNguoiDung_KH, 
        PhuongThuc, 
        TongTien, 
        TrangThai || 'Chờ thanh toán'
    ]);
}

/**
 * Cập nhật trạng thái đơn hàng
 */
export async function updateOrderStatus(maDonHang, trangThai) {
    const sql = `UPDATE DON_HANG SET TrangThai = :1 WHERE MaDonHang = :2`;
    return await execute(sql, [trangThai, maDonHang]);
}

/**
 * Thêm mặt hàng vào đơn hàng
 */
export async function addOrderItem(maDonHang, maHang, soLuong, donGia) {
    const sql = `
        INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia)
        VALUES (:1, :2, :3, :4)
    `;

    return await execute(sql, [maDonHang, maHang, soLuong, donGia]);
}

/**
 * Xóa đơn hàng
 */
export async function deleteOrder(maDonHang) {
    const sql = `DELETE FROM DON_HANG WHERE MaDonHang = :1`;
    return await execute(sql, [maDonHang]);
}

/**
 * Lấy tổng doanh thu theo khoảng thời gian
 */
export async function getRevenueByDateRange(startDate, endDate) {
    const sql = `
        SELECT TRUNC(DH.ThoiGianDat) AS NGAY, 
               COUNT(DH.MaDonHang) AS SOHOADON,
               SUM(DH.TongTien) AS TONGTIEN
        FROM DON_HANG DH
        WHERE DH.TrangThai = 'Đã thanh toán'
          AND TRUNC(DH.ThoiGianDat) BETWEEN :1 AND :2
        GROUP BY TRUNC(DH.ThoiGianDat)
        ORDER BY TRUNC(DH.ThoiGianDat) DESC
    `;
    return await query(sql, [startDate, endDate]);
}

/**
 * Lấy doanh thu theo phim
 */
export async function getRevenueByMovie(startDate, endDate) {
    const sql = `
        SELECT P.MaPhim, P.TenPhim,
               COUNT(DISTINCT V.MaVe) AS SOVE,
               SUM(V.GiaVeCuoi) AS DOANHTHU
        FROM VE_XEM_PHIM V
        JOIN SUAT_CHIEU SC ON V.MaSuatChieu = SC.MaSuatChieu
        JOIN PHIM P ON SC.MaPhim = P.MaPhim
        WHERE V.TrangThai = 'Đã thanh toán'
          AND (:1 IS NULL OR TRUNC(V.NgayDat) >= TO_DATE(:1, 'YYYY-MM-DD'))
          AND (:2 IS NULL OR TRUNC(V.NgayDat) <= TO_DATE(:2, 'YYYY-MM-DD'))
        GROUP BY P.MaPhim, P.TenPhim
        ORDER BY DOANHTHU DESC
    `;
    return await query(sql, [startDate || null, endDate || null]);
}

/**
 * Lấy doanh thu theo rạp
 */
export async function getRevenueBycinema(startDate, endDate) {
    const sql = `
        SELECT RC.MaRapPhim, RC.Ten AS TENRAP,
               COUNT(DISTINCT V.MaVe) AS SOVE,
               SUM(V.GiaVeCuoi) AS DOANHTHU
        FROM VE_XEM_PHIM V
        JOIN SUAT_CHIEU SC ON V.MaSuatChieu = SC.MaSuatChieu
        JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
        JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
        WHERE V.TrangThai = 'Đã thanh toán'
          AND (:1 IS NULL OR TRUNC(V.NgayDat) >= TO_DATE(:1, 'YYYY-MM-DD'))
          AND (:2 IS NULL OR TRUNC(V.NgayDat) <= TO_DATE(:2, 'YYYY-MM-DD'))
        GROUP BY RC.MaRapPhim, RC.Ten
        ORDER BY DOANHTHU DESC
    `;
    return await query(sql, [startDate || null, endDate || null]);
}

