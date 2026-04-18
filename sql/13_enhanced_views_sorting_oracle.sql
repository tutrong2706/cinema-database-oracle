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
    TO_CHAR(ve.NgayDat, 'YYYY-MM-DD') AS Ngay,
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
GROUP BY TO_CHAR(ve.NgayDat, 'YYYY-MM-DD')
ORDER BY Ngay DESC;
/

CREATE OR REPLACE VIEW V_DOANH_THU_BY_VOLUME AS
SELECT 
    TO_CHAR(ve.NgayDat, 'YYYY-MM') AS Thang,
    COUNT(DISTINCT ve.MaVe) AS SoVeBan,
    ROUND(SUM(ve.GiaVeCuoi), 2) AS DoanhThuVe,
    COUNT(DISTINCT dh.MaDonHang) AS SoHoaDon,
    ROUND(SUM(g.SoLuong * g.DonGia), 2) AS DoanhThuHang,
    ROUND(SUM(ve.GiaVeCuoi) + SUM(g.SoLuong * g.DonGia), 2) AS TongDoanhThu
FROM VE_XEM_PHIM ve
LEFT JOIN DON_HANG dh ON ve.MaDonHang = dh.MaDonHang
LEFT JOIN GOM g ON dh.MaDonHang = g.MaDonHang
WHERE ve.TrangThai IN ('Đã thanh toán', 'Đã xem')
GROUP BY TO_CHAR(ve.NgayDat, 'YYYY-MM')
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
    pc.Ten AS TenPhong,
    pc.SucChua,
    (SELECT COUNT(*) FROM GHE WHERE MaPhong = pc.MaPhong) - 
    COALESCE((SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = s.MaSuatChieu 
     AND TrangThai IN ('Đã thanh toán', 'Đã xem')), 0) AS GheTrong,
    COALESCE((SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = s.MaSuatChieu 
     AND TrangThai IN ('Đã thanh toán', 'Đã xem')), 0) AS GheDaBan,
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
    pc.Ten AS TenPhong,
    pc.SucChua,
    (SELECT COUNT(*) FROM GHE WHERE MaPhong = pc.MaPhong) - 
    COALESCE((SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = s.MaSuatChieu 
     AND TrangThai IN ('Đã thanh toán', 'Đã xem')), 0) AS GheTrong,
    COALESCE((SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = s.MaSuatChieu 
     AND TrangThai IN ('Đã thanh toán', 'Đã xem')), 0) AS GheDaBan,
    ROUND(((SELECT COUNT(*) FROM GHE WHERE MaPhong = pc.MaPhong) - 
    COALESCE((SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = s.MaSuatChieu 
     AND TrangThai IN ('Đã thanh toán', 'Đã xem')), 0)) * 100.0 / pc.SucChua, 2) AS PhanTramTrong,
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
-- NOTE: Procedures with flexible CASE logic cannot use direct SELECT
-- Instead, implement sorting logic in application layer (Node.js/Backend)
-- The above Views provide all necessary sorted result sets
-- ============================================================================

BEGIN
    DBMS_OUTPUT.PUT_LINE('Enhanced views created successfully!');
    DBMS_OUTPUT.PUT_LINE('Use these views from application layer:');
    DBMS_OUTPUT.PUT_LINE('  - V_PHIM_BY_RELEASE_DATE, V_PHIM_BY_RATING, V_PHIM_BY_REVENUE');
    DBMS_OUTPUT.PUT_LINE('  - V_DOANH_THU_BY_DATE, V_DOANH_THU_BY_VOLUME');
    DBMS_OUTPUT.PUT_LINE('  - V_SUAT_CHIEU_BY_TIME, V_SUAT_CHIEU_BY_AVAILABILITY');
    DBMS_OUTPUT.PUT_LINE('  - V_KHACH_HANG_BY_SPENDING, V_KHACH_HANG_BY_FREQUENCY');
END;
/
