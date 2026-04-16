-- ORACLE VERSION: Enhanced Views with Multiple Sorting Options
-- ============================================================================
-- Improved views with flexible sorting capabilities for different business needs
-- Date: April 13, 2026

-- ============================================================================
-- ENHANCED VIEW 1: Movies with flexible ordering support
-- ============================================================================
CREATE OR REPLACE VIEW V_PHIM_SORTED AS
SELECT 
    p.MaPhim,
    p.TenPhim,
    p.ThoiLuong,
    p.NgonNgu,
    p.QuocGia,
    p.DaoDien,
    p.DienVienChinh,
    p.NgayKhoiChieu,
    p.MoTaNoiDung,
    p.DoTuoi,
    p.ChuDePhim,
    p.Anh,
    -- Metrics for sorting
    (SELECT COUNT(*) FROM SUAT_CHIEU WHERE MaPhim = p.MaPhim AND TrangThai <> 'Hủy') AS SoSuatChieu,
    (SELECT COUNT(*) FROM VE_XEM_PHIM v
     JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
     WHERE s.MaPhim = p.MaPhim AND v.TrangThai IN ('Đã thanh toán', 'Đã xem')) AS SoVeDaBan,
    (SELECT COALESCE(ROUND(AVG(DiemSo), 1), 0) FROM DANH_GIA WHERE MaPhim = p.MaPhim) AS DiemTrungBinh,
    (SELECT COUNT(*) FROM DANH_GIA WHERE MaPhim = p.MaPhim) AS TongDanhGia,
    (SELECT COALESCE(SUM(ve.GiaVeCuoi), 0) 
     FROM VE_XEM_PHIM ve
     JOIN SUAT_CHIEU s ON ve.MaSuatChieu = s.MaSuatChieu
     WHERE s.MaPhim = p.MaPhim AND ve.TrangThai IN ('Đã thanh toán', 'Đã xem')) AS TongDoanhThu,
    (SELECT MAX(NgayChieu) FROM SUAT_CHIEU WHERE MaPhim = p.MaPhim) AS NgayChieuCuoi
FROM PHIM p;
/

-- ============================================================================
-- ENHANCED VIEW 2: Movies sorted by different criteria
-- ============================================================================
CREATE OR REPLACE VIEW V_PHIM_BY_RELEASE_DATE AS
SELECT * FROM V_PHIM_SORTED
ORDER BY NgayKhoiChieu DESC;
/

CREATE OR REPLACE VIEW V_PHIM_BY_RATING AS
SELECT * FROM V_PHIM_SORTED
ORDER BY DiemTrungBinh DESC, TongDanhGia DESC;
/

CREATE OR REPLACE VIEW V_PHIM_BY_REVENUE AS
SELECT * FROM V_PHIM_SORTED
ORDER BY TongDoanhThu DESC;
/

CREATE OR REPLACE VIEW V_PHIM_BY_POPULARITY AS
SELECT * FROM V_PHIM_SORTED
ORDER BY SoVeDaBan DESC, DiemTrungBinh DESC;
/

CREATE OR REPLACE VIEW V_PHIM_BY_SHOWTIMES AS
SELECT * FROM V_PHIM_SORTED
ORDER BY SoSuatChieu DESC, NgayChieuCuoi DESC;
/

-- ============================================================================
-- ENHANCED VIEW 3: Revenue Report with sorting options
-- ============================================================================
CREATE OR REPLACE VIEW V_DOANH_THU_BY_DATE AS
SELECT 
    TO_CHAR(ve.ThoiGianThanhToan, 'YYYY-MM-DD') AS Ngay,
    COUNT(DISTINCT ve.MaVe) AS SoVeBan,
    ROUND(SUM(ve.GiaVeCuoi), 2) AS DoanhThuVe,
    COUNT(DISTINCT dh.MaDonHang) AS SoHoaDon,
    ROUND(SUM(g.SoLuong * g.DonGia), 2) AS DoanhThuHang,
    ROUND(SUM(ve.GiaVeCuoi) + SUM(g.SoLuong * g.DonGia), 2) AS TongDoanhThu,
    ROUND(AVG(ve.GiaVeCuoi), 2) AS GiaVeTrungBinh,
    (ROUND(SUM(ve.GiaVeCuoi) + SUM(g.SoLuong * g.DonGia), 2) / 
     NULLIF(COUNT(DISTINCT dh.MaDonHang), 0)) AS DoanhThuTrungBinh
FROM VE_XEM_PHIM ve
LEFT JOIN DON_HANG dh ON ve.MaDonHang = dh.MaDonHang
LEFT JOIN GOM g ON dh.MaDonHang = g.MaDonHang
WHERE ve.TrangThai IN ('Đã thanh toán', 'Đã xem')
GROUP BY TO_CHAR(ve.ThoiGianThanhToan, 'YYYY-MM-DD')
ORDER BY Ngay DESC;
/

CREATE OR REPLACE VIEW V_DOANH_THU_BY_VOLUME AS
SELECT 
    TO_CHAR(ve.ThoiGianThanhToan, 'YYYY-MM') AS Thang,
    COUNT(DISTINCT ve.MaVe) AS SoVeBan,
    ROUND(SUM(ve.GiaVeCuoi), 2) AS DoanhThuVe,
    COUNT(DISTINCT dh.MaDonHang) AS SoHoaDon,
    ROUND(SUM(g.SoLuong * g.DonGia), 2) AS DoanhThuHang,
    ROUND(SUM(ve.GiaVeCuoi) + SUM(g.SoLuong * g.DonGia), 2) AS TongDoanhThu
FROM VE_XEM_PHIM ve
LEFT JOIN DON_HANG dh ON ve.MaDonHang = dh.MaDonHang
LEFT JOIN GOM g ON dh.MaDonHang = g.MaDonHang
WHERE ve.TrangThai IN ('Đã thanh toán', 'Đã xem')
GROUP BY TO_CHAR(ve.ThoiGianThanhToan, 'YYYY-MM')
ORDER BY TongDoanhThu DESC;
/

-- ============================================================================
-- ENHANCED VIEW 4: Showtimes with sorted results
-- ============================================================================
CREATE OR REPLACE VIEW V_SUAT_CHIEU_BY_TIME AS
SELECT 
    s.MaSuatChieu,
    s.MaPhim,
    p.TenPhim,
    s.NgayChieu,
    s.GioBatDau,
    s.GioKetThuc,
    s.GioBatDau || '-' || s.GioKetThuc AS ThoiGianChieu,
    pc.MaPhong,
    pc.TenPhong,
    pc.SucChua,
    (SELECT COUNT(*) FROM GHE WHERE MaPhong = pc.MaPhong AND TrangThai = 'Trống') AS GheTrong,
    (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = s.MaSuatChieu 
     AND TrangThai IN ('Đã thanh toán', 'Đã xem')) AS GheDaBan,
    s.GiaVeCoBan,
    s.TrangThai
FROM SUAT_CHIEU s
JOIN PHIM p ON s.MaPhim = p.MaPhim
JOIN PHONG_CHIEU pc ON s.MaPhong = pc.MaPhong
WHERE s.TrangThai <> 'Hủy'
ORDER BY s.NgayChieu ASC, s.GioBatDau ASC;
/

CREATE OR REPLACE VIEW V_SUAT_CHIEU_BY_AVAILABILITY AS
SELECT 
    s.MaSuatChieu,
    s.MaPhim,
    p.TenPhim,
    s.NgayChieu,
    s.GioBatDau || '-' || s.GioKetThuc AS ThoiGianChieu,
    pc.TenPhong,
    pc.SucChua,
    (SELECT COUNT(*) FROM GHE WHERE MaPhong = pc.MaPhong AND TrangThai = 'Trống') AS GheTrong,
    (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = s.MaSuatChieu 
     AND TrangThai IN ('Đã thanh toán', 'Đã xem')) AS GheDaBan,
    ROUND((SELECT COUNT(*) FROM GHE WHERE MaPhong = pc.MaPhong AND TrangThai = 'Trống') * 100.0 / pc.SucChua, 2) AS PhanTramTrong,
    s.GiaVeCoBan,
    s.TrangThai
FROM SUAT_CHIEU s
JOIN PHIM p ON s.MaPhim = p.MaPhim
JOIN PHONG_CHIEU pc ON s.MaPhong = pc.MaPhong
WHERE s.TrangThai <> 'Hủy'
ORDER BY PhanTramTrong DESC, s.NgayChieu ASC;
/

-- ============================================================================
-- ENHANCED VIEW 5: Customer data with sorting options
-- ============================================================================
CREATE OR REPLACE VIEW V_KHACH_HANG_BY_SPENDING AS
SELECT 
    tk.MaNguoiDung,
    tk.HoTen,
    tk.Email,
    tk.SDT,
    kh.LoaiThanhVien,
    kh.DiemTichLuy,
    COUNT(DISTINCT ve.MaVe) AS SoVeDat,
    COUNT(DISTINCT dh.MaDonHang) AS SoLanMua,
    ROUND(SUM(ve.GiaVeCuoi), 2) AS TongTienVe,
    ROUND(SUM(g.SoLuong * g.DonGia), 2) AS TongTienHang,
    ROUND(SUM(ve.GiaVeCuoi) + SUM(g.SoLuong * g.DonGia), 2) AS TongChiTieu,
    MAX(ve.NgayDat) AS LanMuaCuoi,
    ROUND((SUM(ve.GiaVeCuoi) + SUM(g.SoLuong * g.DonGia)) / NULLIF(COUNT(DISTINCT dh.MaDonHang), 0), 2) AS ChiTieuTrungBinh
FROM TAI_KHOAN tk
LEFT JOIN KHACH_HANG kh ON tk.MaNguoiDung = kh.MaNguoiDung
LEFT JOIN VE_XEM_PHIM ve ON tk.MaNguoiDung = ve.MaNguoiDung_KH
LEFT JOIN DON_HANG dh ON tk.MaNguoiDung = dh.MaNguoiDung_KH
LEFT JOIN GOM g ON dh.MaDonHang = g.MaDonHang
GROUP BY tk.MaNguoiDung, tk.HoTen, tk.Email, tk.SDT, kh.LoaiThanhVien, kh.DiemTichLuy
ORDER BY TongChiTieu DESC;
/

CREATE OR REPLACE VIEW V_KHACH_HANG_BY_FREQUENCY AS
SELECT 
    tk.MaNguoiDung,
    tk.HoTen,
    tk.Email,
    kh.LoaiThanhVien,
    COUNT(DISTINCT ve.MaVe) AS SoVeDat,
    COUNT(DISTINCT dh.MaDonHang) AS SoLanMua,
    ROUND(SUM(ve.GiaVeCuoi) + SUM(g.SoLuong * g.DonGia), 2) AS TongChiTieu,
    MAX(ve.NgayDat) AS LanMuaCuoi,
    TRUNC(SYSDATE) - TRUNC(MAX(ve.NgayDat)) AS NgayKhongMua
FROM TAI_KHOAN tk
LEFT JOIN KHACH_HANG kh ON tk.MaNguoiDung = kh.MaNguoiDung
LEFT JOIN VE_XEM_PHIM ve ON tk.MaNguoiDung = ve.MaNguoiDung_KH
LEFT JOIN DON_HANG dh ON tk.MaNguoiDung = dh.MaNguoiDung_KH
LEFT JOIN GOM g ON dh.MaDonHang = g.MaDonHang
GROUP BY tk.MaNguoiDung, tk.HoTen, tk.Email, kh.LoaiThanhVien
ORDER BY SoLanMua DESC, LanMuaCuoi DESC;
/

-- ============================================================================
-- ENHANCED PROCEDURE 1: Get movies with flexible sorting
-- ============================================================================
CREATE OR REPLACE PROCEDURE SP_GetMoviesSorted (
    p_SortBy IN VARCHAR2 DEFAULT 'RELEASE_DATE',
    p_Limit IN NUMBER DEFAULT 10
)
AS
BEGIN
    CASE p_SortBy
        WHEN 'RELEASE_DATE' THEN
            SELECT * FROM (SELECT * FROM V_PHIM_SORTED ORDER BY NgayKhoiChieu DESC)
            WHERE ROWNUM <= p_Limit;
        WHEN 'RATING' THEN
            SELECT * FROM (SELECT * FROM V_PHIM_SORTED ORDER BY DiemTrungBinh DESC, TongDanhGia DESC)
            WHERE ROWNUM <= p_Limit;
        WHEN 'REVENUE' THEN
            SELECT * FROM (SELECT * FROM V_PHIM_SORTED ORDER BY TongDoanhThu DESC)
            WHERE ROWNUM <= p_Limit;
        WHEN 'POPULARITY' THEN
            SELECT * FROM (SELECT * FROM V_PHIM_SORTED ORDER BY SoVeDaBan DESC, DiemTrungBinh DESC)
            WHERE ROWNUM <= p_Limit;
        WHEN 'SHOWTIMES' THEN
            SELECT * FROM (SELECT * FROM V_PHIM_SORTED ORDER BY SoSuatChieu DESC, NgayChieuCuoi DESC)
            WHERE ROWNUM <= p_Limit;
        ELSE
            -- Default to release date
            SELECT * FROM (SELECT * FROM V_PHIM_SORTED ORDER BY NgayKhoiChieu DESC)
            WHERE ROWNUM <= p_Limit;
    END CASE;
END SP_GetMoviesSorted;
/

-- ============================================================================
-- ENHANCED PROCEDURE 2: Get revenue report with flexible sorting
-- ============================================================================
CREATE OR REPLACE PROCEDURE SP_GetRevenueReport (
    p_SortBy IN VARCHAR2 DEFAULT 'DATE',
    p_NgayBatDau IN DATE DEFAULT NULL,
    p_NgayKetThuc IN DATE DEFAULT NULL
)
AS
BEGIN
    IF p_NgayBatDau IS NULL THEN
        p_NgayBatDau := TRUNC(SYSDATE) - 30;
    END IF;
    
    IF p_NgayKetThuc IS NULL THEN
        p_NgayKetThuc := TRUNC(SYSDATE);
    END IF;
    
    CASE p_SortBy
        WHEN 'DATE' THEN
            SELECT * FROM V_DOANH_THU_BY_DATE
            WHERE TO_DATE(Ngay, 'YYYY-MM-DD') BETWEEN p_NgayBatDau AND p_NgayKetThuc
            ORDER BY Ngay DESC;
        WHEN 'VOLUME' THEN
            SELECT * FROM V_DOANH_THU_BY_VOLUME
            WHERE TO_DATE(Thang || '-01', 'YYYY-MM-DD') BETWEEN p_NgayBatDau AND p_NgayKetThuc
            ORDER BY TongDoanhThu DESC;
        WHEN 'TICKETS' THEN
            SELECT * FROM V_DOANH_THU_BY_DATE
            WHERE TO_DATE(Ngay, 'YYYY-MM-DD') BETWEEN p_NgayBatDau AND p_NgayKetThuc
            ORDER BY SoVeBan DESC, TongDoanhThu DESC;
        ELSE
            SELECT * FROM V_DOANH_THU_BY_DATE
            WHERE TO_DATE(Ngay, 'YYYY-MM-DD') BETWEEN p_NgayBatDau AND p_NgayKetThuc
            ORDER BY Ngay DESC;
    END CASE;
END SP_GetRevenueReport;
/

-- ============================================================================
-- ENHANCED PROCEDURE 3: Get showtimes with flexible sorting
-- ============================================================================
CREATE OR REPLACE PROCEDURE SP_GetShowtimesSorted (
    p_MaPhim IN VARCHAR2,
    p_SortBy IN VARCHAR2 DEFAULT 'TIME'
)
AS
BEGIN
    CASE p_SortBy
        WHEN 'TIME' THEN
            SELECT * FROM V_SUAT_CHIEU_BY_TIME
            WHERE MaPhim = p_MaPhim
            ORDER BY NgayChieu ASC, GioBatDau ASC;
        WHEN 'AVAILABILITY' THEN
            SELECT * FROM V_SUAT_CHIEU_BY_AVAILABILITY
            WHERE MaPhim = p_MaPhim
            ORDER BY PhanTramTrong DESC, NgayChieu ASC;
        WHEN 'PRICE' THEN
            SELECT * FROM V_SUAT_CHIEU_BY_TIME
            WHERE MaPhim = p_MaPhim
            ORDER BY GiaVeCoBan ASC, NgayChieu ASC;
        ELSE
            SELECT * FROM V_SUAT_CHIEU_BY_TIME
            WHERE MaPhim = p_MaPhim
            ORDER BY NgayChieu ASC, GioBatDau ASC;
    END CASE;
END SP_GetShowtimesSorted;
/

-- ============================================================================
-- ENHANCED PROCEDURE 4: Get customers with flexible sorting
-- ============================================================================
CREATE OR REPLACE PROCEDURE SP_GetCustomersSorted (
    p_SortBy IN VARCHAR2 DEFAULT 'SPENDING',
    p_Limit IN NUMBER DEFAULT 50
)
AS
BEGIN
    CASE p_SortBy
        WHEN 'SPENDING' THEN
            SELECT * FROM (SELECT * FROM V_KHACH_HANG_BY_SPENDING ORDER BY TongChiTieu DESC)
            WHERE ROWNUM <= p_Limit;
        WHEN 'FREQUENCY' THEN
            SELECT * FROM (SELECT * FROM V_KHACH_HANG_BY_FREQUENCY ORDER BY SoLanMua DESC, LanMuaCuoi DESC)
            WHERE ROWNUM <= p_Limit;
        WHEN 'LOYALTY' THEN
            SELECT * FROM (SELECT * FROM V_KHACH_HANG_BY_SPENDING ORDER BY SoLanMua DESC, DiemTichLuy DESC)
            WHERE ROWNUM <= p_Limit;
        ELSE
            SELECT * FROM (SELECT * FROM V_KHACH_HANG_BY_SPENDING ORDER BY TongChiTieu DESC)
            WHERE ROWNUM <= p_Limit;
    END CASE;
END SP_GetCustomersSorted;
/

-- ============================================================================
-- HELPER PROCEDURE: List available sort options
-- ============================================================================
CREATE OR REPLACE PROCEDURE SP_GetSortOptions
AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('=== AVAILABLE SORTING OPTIONS ===');
    DBMS_OUTPUT.PUT_LINE('');
    
    DBMS_OUTPUT.PUT_LINE('MOVIES (SP_GetMoviesSorted):');
    DBMS_OUTPUT.PUT_LINE('  - RELEASE_DATE: Sort by newest release');
    DBMS_OUTPUT.PUT_LINE('  - RATING: Sort by average rating');
    DBMS_OUTPUT.PUT_LINE('  - REVENUE: Sort by total revenue');
    DBMS_OUTPUT.PUT_LINE('  - POPULARITY: Sort by tickets sold + rating');
    DBMS_OUTPUT.PUT_LINE('  - SHOWTIMES: Sort by number of showtimes');
    DBMS_OUTPUT.PUT_LINE('');
    
    DBMS_OUTPUT.PUT_LINE('REVENUE REPORT (SP_GetRevenueReport):');
    DBMS_OUTPUT.PUT_LINE('  - DATE: Sort by date (newest first)');
    DBMS_OUTPUT.PUT_LINE('  - VOLUME: Sort by total revenue amount');
    DBMS_OUTPUT.PUT_LINE('  - TICKETS: Sort by number of tickets sold');
    DBMS_OUTPUT.PUT_LINE('');
    
    DBMS_OUTPUT.PUT_LINE('SHOWTIMES (SP_GetShowtimesSorted):');
    DBMS_OUTPUT.PUT_LINE('  - TIME: Sort by date and time');
    DBMS_OUTPUT.PUT_LINE('  - AVAILABILITY: Sort by available seats %');
    DBMS_OUTPUT.PUT_LINE('  - PRICE: Sort by price (lowest first)');
    DBMS_OUTPUT.PUT_LINE('');
    
    DBMS_OUTPUT.PUT_LINE('CUSTOMERS (SP_GetCustomersSorted):');
    DBMS_OUTPUT.PUT_LINE('  - SPENDING: Sort by total spending');
    DBMS_OUTPUT.PUT_LINE('  - FREQUENCY: Sort by booking frequency');
    DBMS_OUTPUT.PUT_LINE('  - LOYALTY: Sort by loyalty (frequency + points)');
    DBMS_OUTPUT.PUT_LINE('');
END SP_GetSortOptions;
/
