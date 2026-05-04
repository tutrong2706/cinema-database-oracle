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
        SELECT P.MaPhim, P.TenPhim,
               COUNT(DISTINCT V.MaVe) AS SOVE,
               SUM(V.GiaVeCuoi) AS DOANHTHU,
               ROUND(AVG(V.GiaVeCuoi), 2) AS GIAB_TRUNGBINH
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
               SUM(V.GiaVeCuoi) AS DOANHTHU,
               ROUND(AVG(V.GiaVeCuoi), 2) AS GIAB_TRUNGBINH
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

/**
 * Lấy top phim phổ biến
 */
export async function getPopularMovies(limit) {
    const sql = `
        SELECT P.MaPhim, P.TenPhim,
               COUNT(DISTINCT V.MaVe) AS SOVE,
               SUM(V.GiaVeCuoi) AS DOANHTHU,
               ROUND(AVG(DG.DiemSo), 1) AS DIEMDANHGIA
        FROM PHIM P
        LEFT JOIN SUAT_CHIEU SC ON P.MaPhim = SC.MaPhim
        LEFT JOIN VE_XEM_PHIM V ON SC.MaSuatChieu = V.MaSuatChieu AND V.TrangThai = 'Đã thanh toán'
        LEFT JOIN DANH_GIA DG ON P.MaPhim = DG.MaPhim
        GROUP BY P.MaPhim, P.TenPhim
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
