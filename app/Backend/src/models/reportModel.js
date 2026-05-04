import { query, execute } from '../config/database.js';

/**
 * Lấy doanh thu theo ngày
 */
export async function getDailyRevenue(startDate, endDate) {
    const sql = `
        SELECT TRUNC(DH.ThoiGianDat) AS NGAY, 
               COUNT(DH.MaDonHang) AS SOHOADON,
               SUM(DH.TongTien) AS TONGTIEN
        FROM DON_HANG DH
        WHERE DH.TrangThai = 'Đã thanh toán'
          AND (:1 IS NULL OR TRUNC(DH.ThoiGianDat) >= TO_DATE(:1, 'YYYY-MM-DD'))
          AND (:2 IS NULL OR TRUNC(DH.ThoiGianDat) <= TO_DATE(:2, 'YYYY-MM-DD'))
        GROUP BY TRUNC(DH.ThoiGianDat)
        ORDER BY NGAY DESC
    `;
    return await query(sql, [startDate || null, endDate || null]);
}

/**
 * Lấy doanh thu theo tháng
 */
export async function getMonthlyRevenue(year) {
    const selectedYear = year || new Date().getFullYear().toString();
    const sql = `
        SELECT TO_CHAR(DH.ThoiGianDat, 'MM') AS THANG,
               TO_CHAR(DH.ThoiGianDat, 'YYYY-MM') AS THANG_FULL,
               COUNT(DH.MaDonHang) AS SOHOADON,
               SUM(DH.TongTien) AS TONGTIEN
        FROM DON_HANG DH
        WHERE DH.TrangThai = 'Đã thanh toán'
          AND TO_CHAR(DH.ThoiGianDat, 'YYYY') = :1
        GROUP BY TO_CHAR(DH.ThoiGianDat, 'MM'), TO_CHAR(DH.ThoiGianDat, 'YYYY-MM')
        ORDER BY THANG
    `;
    return await query(sql, [selectedYear]);
}

/**
 * Lấy doanh thu theo phim
 */
export async function getRevenueByMovie(startDate, endDate) {
    const sql = `
        SELECT P.MaPhim AS MAPHIM, P.TenPhim AS TENPHIM,
               COUNT(DISTINCT V.MaVe) AS SOVE,
               SUM(V.GiaVeCuoi) AS DOANHTHU,
               ROUND(AVG(V.GiaVeCuoi), 2) AS GIAB_TRUNGBINH
        FROM VE_XEM_PHIM V
        JOIN DON_HANG DH ON V.MaDonHang = DH.MaDonHang
        JOIN SUAT_CHIEU SC ON V.MaSuatChieu = SC.MaSuatChieu
        JOIN PHIM P ON SC.MaPhim = P.MaPhim
        WHERE V.TrangThai = 'Đã thanh toán'
          AND (:1 IS NULL OR TRUNC(DH.ThoiGianDat) >= TO_DATE(:1, 'YYYY-MM-DD'))
          AND (:2 IS NULL OR TRUNC(DH.ThoiGianDat) <= TO_DATE(:2, 'YYYY-MM-DD'))
        GROUP BY P.MaPhim, P.TenPhim
        ORDER BY DOANHTHU DESC
    `;
    try {
        console.log('🔍 getRevenueByMovie - Params:', { startDate, endDate });
        // 4 bind values: :1, :1, :2, :2 (each placeholder used twice in WHERE clause)
        const result = await query(sql, [startDate || null, startDate || null, endDate || null, endDate || null]);
        console.log('✅ getRevenueByMovie - Result rows:', result?.length || 0);
        return result;
    } catch (error) {
        console.error('❌ getRevenueByMovie - SQL Error:', error.message);
        console.error('   SQL:', sql.substring(0, 200) + '...');
        throw error;
    }
}

/**
 * Lấy doanh thu theo rạp
 */
export async function getRevenueBycinema(startDate, endDate) {
    const sql = `
        SELECT RC.MaRapPhim AS MARAPHIM, RC.Ten AS TENRAP,
               COUNT(DISTINCT V.MaVe) AS SOVE,
               SUM(V.GiaVeCuoi) AS DOANHTHU,
               ROUND(AVG(V.GiaVeCuoi), 2) AS GIAB_TRUNGBINH
        FROM VE_XEM_PHIM V
        JOIN DON_HANG DH ON V.MaDonHang = DH.MaDonHang
        JOIN SUAT_CHIEU SC ON V.MaSuatChieu = SC.MaSuatChieu
        JOIN PHONG_CHIEU PC ON SC.MaPhong = PC.MaPhong
        JOIN RAP_CHIEU_PHIM RC ON PC.MaRapPhim = RC.MaRapPhim
        WHERE V.TrangThai = 'Đã thanh toán'
          AND (:1 IS NULL OR TRUNC(DH.ThoiGianDat) >= TO_DATE(:1, 'YYYY-MM-DD'))
          AND (:2 IS NULL OR TRUNC(DH.ThoiGianDat) <= TO_DATE(:2, 'YYYY-MM-DD'))
        GROUP BY RC.MaRapPhim, RC.Ten
        ORDER BY DOANHTHU DESC
    `;
    try {
        console.log('🔍 getRevenueBycinema - Params:', { startDate, endDate });
        // 4 bind values: :1, :1, :2, :2 (each placeholder used twice in WHERE clause)
        const result = await query(sql, [startDate || null, startDate || null, endDate || null, endDate || null]);
        console.log('✅ getRevenueBycinema - Result rows:', result?.length || 0);
        return result;
    } catch (error) {
        console.error('❌ getRevenueBycinema - SQL Error:', error.message);
        console.error('   SQL:', sql.substring(0, 200) + '...');
        throw error;
    }
}

/**
 * Lấy top phim phổ biến
 */
export async function getPopularMovies(limit) {
    const sql = `
        SELECT P.MaPhim AS MAPHIM, P.TenPhim AS TENPHIM,
               NVL(V_STATS.SOVE, 0) AS SOVE,
               NVL(V_STATS.DOANHTHU, 0) AS DOANHTHU,
               NVL(DG_STATS.DIEMDANHGIA, 0) AS DIEMDANHGIA
        FROM PHIM P
        LEFT JOIN (
            -- Tính số vé và doanh thu riêng
            SELECT SC.MaPhim, COUNT(V.MaVe) AS SOVE, SUM(V.GiaVeCuoi) AS DOANHTHU
            FROM SUAT_CHIEU SC
            JOIN VE_XEM_PHIM V ON SC.MaSuatChieu = V.MaSuatChieu
            WHERE V.TrangThai = 'Đã thanh toán'
            GROUP BY SC.MaPhim
        ) V_STATS ON P.MaPhim = V_STATS.MaPhim
        LEFT JOIN (
            -- Tính điểm đánh giá trung bình riêng
            SELECT MaPhim, ROUND(AVG(DiemSo), 1) AS DIEMDANHGIA
            FROM DANH_GIA
            GROUP BY MaPhim
        ) DG_STATS ON P.MaPhim = DG_STATS.MaPhim
        ORDER BY SOVE DESC, DOANHTHU DESC
        FETCH FIRST :1 ROWS ONLY
    `;
    return await query(sql, [limit || 10]);
}
/**
 * Lấy thống kê khách hàng
 */
export async function getCustomerStats() {
    const sql = `
        SELECT 
            COUNT(DISTINCT KH.MaNguoiDung) AS TONGKHACHHANG,
            SUM(CASE WHEN KH.LoaiThanhVien = 'Bronze' THEN 1 ELSE 0 END) AS BRONZE,
            SUM(CASE WHEN KH.LoaiThanhVien = 'Silver' THEN 1 ELSE 0 END) AS SILVER,
            SUM(CASE WHEN KH.LoaiThanhVien = 'Gold' THEN 1 ELSE 0 END) AS GOLD,
            SUM(CASE WHEN KH.LoaiThanhVien = 'Platinum' THEN 1 ELSE 0 END) AS PLATINUM
        FROM KHACH_HANG KH
    `;
    const results = await query(sql);
    return results.length > 0 ? results[0] : null;
}

/**
 * Lấy khách hàng chi tiêu nhiều nhất
 */
export async function getTopSpenders(limit) {
    const sql = `
        SELECT TK.MaNguoiDung, TK.HoTen, TK.Email,
               COUNT(DISTINCT V.MaVe) AS SOVE,
               SUM(V.GiaVeCuoi) AS TONGCHI
        FROM VE_XEM_PHIM V
        JOIN KHACH_HANG KH ON V.MaNguoiDung_KH = KH.MaNguoiDung
        JOIN TAI_KHOAN TK ON KH.MaNguoiDung = TK.MaNguoiDung
        WHERE V.TrangThai = 'Đã thanh toán'
        GROUP BY TK.MaNguoiDung, TK.HoTen, TK.Email
        ORDER BY TONGCHI DESC
        FETCH FIRST :1 ROWS ONLY
    `;
    return await query(sql, [limit || 10]);
}

/**
 * Lấy tổng overview
 */
export async function getOverviewStats(startDate, endDate) {
    const sql = `
        SELECT 
            (SELECT COUNT(DISTINCT MaDonHang) FROM DON_HANG 
             WHERE TrangThai = 'Đã thanh toán' 
               AND (:1 IS NULL OR TRUNC(ThoiGianDat) >= TO_DATE(:1, 'YYYY-MM-DD'))
               AND (:2 IS NULL OR TRUNC(ThoiGianDat) <= TO_DATE(:2, 'YYYY-MM-DD'))) AS TONG_HOADON,
            (SELECT SUM(TongTien) FROM DON_HANG 
             WHERE TrangThai = 'Đã thanh toán' 
               AND (:1 IS NULL OR TRUNC(ThoiGianDat) >= TO_DATE(:1, 'YYYY-MM-DD'))
               AND (:2 IS NULL OR TRUNC(ThoiGianDat) <= TO_DATE(:2, 'YYYY-MM-DD'))) AS TONG_DOANHTHU,
            (SELECT COUNT(DISTINCT MaVe) FROM VE_XEM_PHIM 
             WHERE TrangThai = 'Đã thanh toán' 
               AND (:1 IS NULL OR TRUNC(NgayDat) >= TO_DATE(:1, 'YYYY-MM-DD'))
               AND (:2 IS NULL OR TRUNC(NgayDat) <= TO_DATE(:2, 'YYYY-MM-DD'))) AS TONG_VE,
            (SELECT COUNT(DISTINCT MaNguoiDung_KH) FROM VE_XEM_PHIM 
             WHERE TrangThai = 'Đã thanh toán' 
               AND (:1 IS NULL OR TRUNC(NgayDat) >= TO_DATE(:1, 'YYYY-MM-DD'))
               AND (:2 IS NULL OR TRUNC(NgayDat) <= TO_DATE(:2, 'YYYY-MM-DD'))) AS KHACHHANG_MUA
        FROM DUAL
    `;
    const results = await query(sql, [startDate || null, endDate || null]);
    return results.length > 0 ? results[0] : null;
}

/**
 * Lấy tỷ suất lấp phòng
 */
export async function getRoomOccupancyRate(startDate, endDate) {
    const sql = `
        SELECT 
            PC.MaPhong,
            PC.Ten AS TENPHONG,
            PC.SucChua,
            COUNT(DISTINCT V.MaVe) AS SOVE_THUCTE,
            ROUND((COUNT(DISTINCT V.MaVe) * 100.0 / PC.SucChua), 2) AS TYLE_LAPDAY
        FROM PHONG_CHIEU PC
        LEFT JOIN SUAT_CHIEU SC ON PC.MaPhong = SC.MaPhong
        LEFT JOIN VE_XEM_PHIM V ON SC.MaSuatChieu = V.MaSuatChieu 
            AND V.TrangThai = 'Đã thanh toán'
            AND (:1 IS NULL OR TRUNC(V.NgayDat) >= TO_DATE(:1, 'YYYY-MM-DD'))
            AND (:2 IS NULL OR TRUNC(V.NgayDat) <= TO_DATE(:2, 'YYYY-MM-DD'))
        GROUP BY PC.MaPhong, PC.Ten, PC.SucChua
        ORDER BY TYLE_LAPDAY DESC
    `;
    return await query(sql, [startDate || null, endDate || null]);
}
/**
 * Lấy doanh thu Bắp Nước (Tổng hợp từng món)
 */
export async function getComboRevenue() {
    const sql = `
        SELECT MH.MaHang AS MAHANG, MH.TenHang AS TENHANG,
               SUM(G.SoLuong) AS TONG_SOLUONG,
               SUM(G.SoLuong * G.DonGia) AS TONG_DOANHTHU
        FROM GOM G
        JOIN MAT_HANG MH ON G.MaHang = MH.MaHang
        JOIN DON_HANG DH ON G.MaDonHang = DH.MaDonHang
        WHERE DH.TrangThai = 'Đã thanh toán'
        GROUP BY MH.MaHang, MH.TenHang
        ORDER BY TONG_DOANHTHU DESC
    `;
    return await query(sql);
}

/**
 * Lấy doanh thu Bắp Nước (Thống kê theo phim mà khách xem)
 */
export async function getComboRevenueByMovie() {
    const sql = `
        SELECT P.MaPhim AS MAPHIM, P.TenPhim AS TENPHIM,
               SUM(DH_COMBO.TONG_SOLUONG) AS TONG_COMBO,
               SUM(DH_COMBO.TONG_TIEN) AS TONG_DOANHTHU
        FROM (
            SELECT MaDonHang, MAX(MaSuatChieu) as MaSuatChieu
            FROM VE_XEM_PHIM
            GROUP BY MaDonHang
        ) V_DH
        JOIN (
            SELECT MaDonHang, SUM(SoLuong) AS TONG_SOLUONG, SUM(SoLuong * DonGia) AS TONG_TIEN
            FROM GOM
            GROUP BY MaDonHang
        ) DH_COMBO ON V_DH.MaDonHang = DH_COMBO.MaDonHang
        JOIN SUAT_CHIEU SC ON V_DH.MaSuatChieu = SC.MaSuatChieu
        JOIN PHIM P ON SC.MaPhim = P.MaPhim
        JOIN DON_HANG DH ON V_DH.MaDonHang = DH.MaDonHang
        WHERE DH.TrangThai = 'Đã thanh toán'
        GROUP BY P.MaPhim, P.TenPhim
        ORDER BY TONG_DOANHTHU DESC
    `;
    return await query(sql);
}