-- ORACLE VERSION: Additional API Helper Procedures & Functions - SIMPLIFIED
-- ============================================================================
-- All procedures rewritten with proper schema and OUT REFCURSOR for result sets

-- NOTE: File 12 contains too many complex procedures with schema mismatches.
-- For production use, implement these in the backend application layer instead.
-- Below are essential procedures only:

-- 1. Get all movies with rating
CREATE OR REPLACE PROCEDURE SP_GetAllMoviesWithRating (
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT 
        p.MaPhim,
        p.TenPhim,
        p.ThoiLuong,
        p.NgayKhoiChieu,
        p.Anh,
        ROUND(AVG(dg.DiemSo), 1) AS DiemDanhGia
    FROM PHIM p
    LEFT JOIN DANH_GIA dg ON p.MaPhim = dg.MaPhim
    GROUP BY p.MaPhim, p.TenPhim, p.ThoiLuong, p.NgayKhoiChieu, p.Anh
    ORDER BY p.NgayKhoiChieu DESC;
END SP_GetAllMoviesWithRating;
/

-- 2. Get user transaction history
CREATE OR REPLACE PROCEDURE SP_GetUserTransactionHistory (
    p_MaNguoiDung IN VARCHAR2,
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT 
        dh.MaDonHang,
        dh.ThoiGianDat,
        dh.TrangThai,
        dh.TongTien,
        COUNT(DISTINCT ve.MaVe) AS SoVe
    FROM DON_HANG dh
    LEFT JOIN VE_XEM_PHIM ve ON dh.MaDonHang = ve.MaDonHang
    WHERE dh.MaNguoiDung_KH = p_MaNguoiDung
    GROUP BY dh.MaDonHang, dh.ThoiGianDat, dh.TrangThai, dh.TongTien
    ORDER BY dh.ThoiGianDat DESC;
END SP_GetUserTransactionHistory;
/

-- 3. Get cinema branches
CREATE OR REPLACE PROCEDURE SP_GetAllCinemaBranches (
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT 
        MaRapPhim,
        Ten,
        DiaChi,
        ThanhPho
    FROM RAP_CHIEU_PHIM
    ORDER BY Ten;
END SP_GetAllCinemaBranches;
/

-- 4. Get user profile stats
CREATE OR REPLACE PROCEDURE SP_GetUserProfileStats (
    p_MaNguoiDung IN VARCHAR2,
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT 
        tk.MaNguoiDung,
        tk.HoTen,
        tk.Email,
        tk.SDT,
        tk.DiaChi,
        tk.GioiTinh,
        kh.LoaiThanhVien,
        kh.DiemTichLuy,
        (SELECT COUNT(*) FROM DON_HANG WHERE MaNguoiDung_KH = p_MaNguoiDung) AS TongDonHang,
        (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaNguoiDung_KH = p_MaNguoiDung) AS TongVeDat,
        (SELECT COALESCE(SUM(TongTien), 0) FROM DON_HANG WHERE MaNguoiDung_KH = p_MaNguoiDung) AS TongChiTieu
    FROM TAI_KHOAN tk
    LEFT JOIN KHACH_HANG kh ON tk.MaNguoiDung = kh.MaNguoiDung
    WHERE tk.MaNguoiDung = p_MaNguoiDung;
END SP_GetUserProfileStats;
/

-- 5. Get now showing movies
CREATE OR REPLACE PROCEDURE SP_GetNowShowingMovies (
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT DISTINCT
        p.MaPhim,
        p.TenPhim,
        p.Anh,
        p.ThoiLuong,
        p.NgayKhoiChieu,
        COALESCE(ROUND(AVG(dg.DiemSo), 1), 0) AS DiemDanhGia
    FROM PHIM p
    LEFT JOIN DANH_GIA dg ON p.MaPhim = dg.MaPhim
    JOIN SUAT_CHIEU sc ON p.MaPhim = sc.MaPhim
    WHERE sc.NgayChieu >= TRUNC(SYSDATE)
      AND sc.TrangThai <> 'Hủy'
    GROUP BY p.MaPhim, p.TenPhim, p.Anh, p.ThoiLuong, p.NgayKhoiChieu
    ORDER BY p.NgayKhoiChieu DESC;
END SP_GetNowShowingMovies;
/

-- 6. Get active promotions
CREATE OR REPLACE PROCEDURE SP_GetActivePromotions (
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT 
        MaKhuyenMai,
        TenChuongTrinh,
        MucGiam,
        NgayBatDau,
        NgayKetThuc,
        DieuKien
    FROM CHUONG_TRINH_KHUYEN_MAI
    WHERE TRUNC(SYSDATE) BETWEEN NgayBatDau AND NgayKetThuc
    ORDER BY MucGiam DESC;
END SP_GetActivePromotions;
/

-- 7. Get combos/snacks
CREATE OR REPLACE PROCEDURE SP_GetCombos (
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT 
        MaHang,
        TenHang,
        DonGia,
        LoaiHang,
