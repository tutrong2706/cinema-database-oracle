-- ORACLE VERSION: Views and Data Access Procedures
-- ============================================================================
Set echo off
-- VIEW 1: Get all movies with screening status
CREATE OR REPLACE VIEW V_PHIM_FULL AS
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
    (SELECT COUNT(*) FROM SUAT_CHIEU WHERE MaPhim = p.MaPhim AND TrangThai <> 'Hủy') AS SoSuatChieu,
    (SELECT COUNT(*) FROM VE_XEM_PHIM v
     JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
     WHERE s.MaPhim = p.MaPhim AND v.TrangThai IN ('Đã thanh toán', 'Đã xem')) AS SoVeDA,
    (SELECT MAX(NgayChieu) FROM SUAT_CHIEU WHERE MaPhim = p.MaPhim) AS NgayChieuCuoi
FROM PHIM p;
/

-- VIEW 2: Movie performance analysis
CREATE OR REPLACE VIEW V_PHIM_PERFORMANCE AS
SELECT 
    p.MaPhim,
    p.TenPhim,
    COUNT(DISTINCT s.MaSuatChieu) AS SoSuatChieu,
    COUNT(DISTINCT ve.MaVe) AS TongVeDat,
    SUM(CASE WHEN ve.TrangThai IN ('Đã thanh toán') THEN 1 ELSE 0 END) AS VeDaThanhToan,
    SUM(CASE WHEN ve.TrangThai IN ('Đã thanh toán') THEN ve.GiaVeCuoi ELSE 0 END) AS TongDoanhThuVe,
    ROUND(COUNT(DISTINCT ve.MaVe) * 100.0 / NULLIF(COUNT(DISTINCT s.MaSuatChieu) * 100, 0), 2) AS TyLeLapDayTB
FROM PHIM p
LEFT JOIN SUAT_CHIEU s ON p.MaPhim = s.MaPhim AND s.TrangThai <> 'Hủy'
LEFT JOIN VE_XEM_PHIM ve ON s.MaSuatChieu = ve.MaSuatChieu
GROUP BY p.MaPhim, p.TenPhim;
/

-- VIEW 3: Cinema revenue by movie
CREATE OR REPLACE VIEW V_DOANH_THU_THEO_PHIM AS
SELECT 
    p.MaPhim,
    p.TenPhim,
    TRUNC(ve.NgayDat) AS Ngay,
    COUNT(DISTINCT ve.MaVe) AS SoVe,
    SUM(NVL(ve.GiaVeCuoi, 0)) AS DoanhThuVe,
    SUM(NVL(g.SoLuong * g.DonGia, 0)) AS DoanhThuHang,
    SUM(NVL(ve.GiaVeCuoi, 0)) + SUM(NVL(g.SoLuong * g.DonGia, 0)) AS TongDoanhThu
FROM PHIM p
JOIN SUAT_CHIEU s ON p.MaPhim = s.MaPhim
LEFT JOIN VE_XEM_PHIM ve ON s.MaSuatChieu = ve.MaSuatChieu AND ve.TrangThai = 'Đã thanh toán'
LEFT JOIN DON_HANG dh ON ve.MaDonHang = dh.MaDonHang
LEFT JOIN GOM g ON dh.MaDonHang = g.MaDonHang
WHERE ve.MaVe IS NOT NULL
GROUP BY p.MaPhim, p.TenPhim, TRUNC(ve.NgayDat);
/

-- VIEW 4: Customer booking history
CREATE OR REPLACE VIEW V_KHACH_HANG_FULL AS
SELECT 
    kh.MaNguoiDung,
    tk.HoTen,
    tk.Email,
    tk.SDT,
    COUNT(DISTINCT ve.MaVe) AS SoVeDat,
    COUNT(DISTINCT dh.MaDonHang) AS SoLanMua,
    SUM(ve.GiaVeCuoi) AS TongTienVe,
    SUM(g.SoLuong * g.DonGia) AS TongTienHang,
    MAX(ve.NgayDat) AS LanMuaCuoi
FROM KHACH_HANG kh
JOIN TAI_KHOAN tk ON kh.MaNguoiDung = tk.MaNguoiDung
LEFT JOIN VE_XEM_PHIM ve ON kh.MaNguoiDung = ve.MaNguoiDung_KH
LEFT JOIN DON_HANG dh ON kh.MaNguoiDung = dh.MaNguoiDung_KH
LEFT JOIN GOM g ON dh.MaDonHang = g.MaDonHang
GROUP BY kh.MaNguoiDung, tk.HoTen, tk.Email, tk.SDT;
/

-- VIEW 5: Seat map for each showtimes
CREATE OR REPLACE VIEW V_SEAT_MAP AS
SELECT 
    s.MaSuatChieu,
    p.TenPhim,
    s.NgayChieu,
    s.GioBatDau || ' - ' || s.GioKetThuc AS ThoiGian,
    pc.MaPhong,
    pc.Ten AS TenPhong,
    g.HangGhe,
    g.SoGhe,
    g.LoaiGhe,
    CASE WHEN ve.MaVe IS NOT NULL THEN 'Đã đặt' ELSE 'Trống' END AS GheStatus,
    CASE WHEN ve.MaVe IS NOT NULL THEN 'Y' ELSE 'N' END AS DaDat
FROM SUAT_CHIEU s
JOIN PHIM p ON s.MaPhim = p.MaPhim
JOIN PHONG_CHIEU pc ON s.MaPhong = pc.MaPhong
JOIN GHE g ON pc.MaPhong = g.MaPhong
LEFT JOIN VE_XEM_PHIM ve ON s.MaSuatChieu = ve.MaSuatChieu 
    AND g.MaPhong = ve.MaPhong 
    AND g.HangGhe = ve.HangGhe 
    AND g.SoGhe = ve.SoGhe 
    AND ve.TrangThai IN ('Chờ thanh toán', 'Đã thanh toán')
WHERE s.TrangThai <> 'Hủy'
ORDER BY s.NgayChieu, s.GioBatDau, g.HangGhe, g.SoGhe;
/

-- VIEW 6: Monthly revenue report
CREATE OR REPLACE VIEW V_REPORT_THANG_DOANH_THU AS
SELECT 
    TO_CHAR(ve.NgayDat, 'YYYY-MM') AS Thang,
    COUNT(DISTINCT ve.MaVe) AS SoVeBan,
    SUM(ve.GiaVeCuoi) AS DoanhThuVe,
    COUNT(DISTINCT dh.MaDonHang) AS SoHoaDon,
    SUM(g.SoLuong * g.DonGia) AS DoanhThuHang,
    SUM(ve.GiaVeCuoi) + SUM(g.SoLuong * g.DonGia) AS TongDoanhThu
FROM VE_XEM_PHIM ve
LEFT JOIN DON_HANG dh ON ve.MaDonHang = dh.MaDonHang
LEFT JOIN GOM g ON dh.MaDonHang = g.MaDonHang
WHERE ve.TrangThai IN ('Đã thanh toán', 'Đã xem')
GROUP BY TO_CHAR(ve.NgayDat, 'YYYY-MM')
ORDER BY Thang DESC;
/

-- VIEW 7: Top movies by revenue
CREATE OR REPLACE VIEW V_PHIM_TOP_DOANH_THU AS
SELECT 
    p.MaPhim,
    p.TenPhim,
    COUNT(ve.MaVe) AS SoVe,
    ROUND(SUM(ve.GiaVeCuoi), 2) AS DoanhThu,
    ROUND(AVG(ve.GiaVeCuoi), 2) AS GiaTrungBinh,
    ROUND(SUM(ve.GiaVeCuoi) / COUNT(ve.MaVe), 2) AS GiaVeThucTe
FROM PHIM p
JOIN SUAT_CHIEU s ON p.MaPhim = s.MaPhim
JOIN VE_XEM_PHIM ve ON s.MaSuatChieu = ve.MaSuatChieu
WHERE ve.TrangThai IN ('Đã thanh toán', 'Đã xem')
GROUP BY p.MaPhim, p.TenPhim
ORDER BY DoanhThu DESC;
/

-- VIEW 8: Showtimes with available seats info
CREATE OR REPLACE VIEW V_SUAT_CHIEU_FULL AS
SELECT 
    s.MaSuatChieu,
    p.TenPhim,
    s.NgayChieu,
    s.GioBatDau || '-' || s.GioKetThuc AS ThoiGianChieu,
    pc.Ten AS TenPhong,
    pc.SucChua,
    (SELECT COUNT(*) FROM GHE WHERE MaPhong = pc.MaPhong) - 
    (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = s.MaSuatChieu 
     AND TrangThai IN ('Đã thanh toán', 'Đã xem')) AS GheTrong,
    (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = s.MaSuatChieu 
     AND TrangThai IN ('Đã thanh toán', 'Đã xem')) AS GheDaBan,
    s.TrangThai,
    s.GiaVeCoBan
FROM SUAT_CHIEU s
JOIN PHIM p ON s.MaPhim = p.MaPhim
JOIN PHONG_CHIEU pc ON s.MaPhong = pc.MaPhong
WHERE s.TrangThai <> 'Hủy'
ORDER BY s.NgayChieu DESC, s.GioBatDau DESC;
/

-- PROCEDURE 1: Get movies by filter
CREATE OR REPLACE PROCEDURE SP_Get_PHIM_Paging (
    p_PageNum   IN NUMBER DEFAULT 1,
    p_PageSize  IN NUMBER DEFAULT 10,
    p_Keyword   IN VARCHAR2 DEFAULT NULL,
    p_cursor    OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT * FROM (
        SELECT 
            p.*,
            ROW_NUMBER() OVER (ORDER BY p.NgayKhoiChieu DESC) as RN
        FROM PHIM p
        WHERE (p_Keyword IS NULL OR 
               LOWER(p.TenPhim) LIKE LOWER('%' || p_Keyword || '%') OR
               LOWER(p.ChuDePhim) LIKE LOWER('%' || p_Keyword || '%'))
    )
    WHERE RN BETWEEN (p_PageNum - 1) * p_PageSize + 1 AND p_PageNum * p_PageSize;
END SP_Get_PHIM_Paging;
/

-- PROCEDURE 2: Get showtimes for a movie
CREATE OR REPLACE PROCEDURE SP_Get_SuatChieu_ByPhim (
    p_MaPhim IN PHIM.MaPhim%TYPE,
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT s.* FROM SUAT_CHIEU s
    WHERE s.MaPhim = p_MaPhim
    AND s.NgayChieu >= TRUNC(SYSDATE)
    AND s.TrangThai <> 'Hủy'
    ORDER BY s.NgayChieu, s.GioBatDau;
END SP_Get_SuatChieu_ByPhim;
/

-- PROCEDURE 3: Get revenue report
CREATE OR REPLACE PROCEDURE SP_Report_DoanhThu (
    p_NgayBatDau IN DATE,
    p_NgayKetThuc IN DATE,
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT 
        p.MaPhim,
        p.TenPhim,
        TRUNC(ve.NgayDat) AS Ngay,
        COUNT(DISTINCT ve.MaVe) AS SoVe,
        SUM(NVL(ve.GiaVeCuoi, 0)) AS DoanhThuVe,
        SUM(NVL(g.SoLuong * g.DonGia, 0)) AS DoanhThuHang,
        SUM(NVL(ve.GiaVeCuoi, 0)) + SUM(NVL(g.SoLuong * g.DonGia, 0)) AS TongDoanhThu
    FROM PHIM p
    JOIN SUAT_CHIEU s ON p.MaPhim = s.MaPhim
    LEFT JOIN VE_XEM_PHIM ve ON s.MaSuatChieu = ve.MaSuatChieu AND ve.TrangThai = 'Đã thanh toán'
    LEFT JOIN DON_HANG dh ON ve.MaDonHang = dh.MaDonHang
    LEFT JOIN GOM g ON dh.MaDonHang = g.MaDonHang
    WHERE ve.MaVe IS NOT NULL
        AND TRUNC(ve.NgayDat) BETWEEN p_NgayBatDau AND p_NgayKetThuc
    GROUP BY p.MaPhim, p.TenPhim, TRUNC(ve.NgayDat)
    ORDER BY TRUNC(ve.NgayDat) DESC, SUM(NVL(ve.GiaVeCuoi, 0)) DESC;
END SP_Report_DoanhThu;
/
