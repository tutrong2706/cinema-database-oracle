-- ORACLE VERSION: Additional API Helper Procedures & Functions
-- ============================================================================
-- These procedures support backend API queries with proper business logic

-- 1. Get all movies with rating and performance
CREATE OR REPLACE PROCEDURE SP_GetAllMoviesWithRating
AS
BEGIN
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
        ROUND(AVG(dg.DiemSo), 1) AS DiemDanhGia,
        FUNC_DanhGiaHieuQuaPhim(p.MaPhim) AS HieuQua
    FROM PHIM p
    LEFT JOIN DANH_GIA dg ON p.MaPhim = dg.MaPhim
    GROUP BY p.MaPhim, p.TenPhim, p.ThoiLuong, p.NgonNgu, p.QuocGia, 
             p.DaoDien, p.DienVienChinh, p.NgayKhoiChieu, p.MoTaNoiDung, 
             p.DoTuoi, p.ChuDePhim, p.Anh
    ORDER BY p.NgayKhoiChieu DESC;
END SP_GetAllMoviesWithRating;
/

-- 2. Search movies by name or genre with rating
CREATE OR REPLACE PROCEDURE SP_SearchMoviesWithRating (
    p_Keyword IN VARCHAR2
)
AS
    v_SearchPattern VARCHAR2(500);
BEGIN
    v_SearchPattern := '%' || UPPER(p_Keyword) || '%';
    
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
        ROUND(AVG(dg.DiemSo), 1) AS DiemDanhGia,
        FUNC_DanhGiaHieuQuaPhim(p.MaPhim) AS HieuQua
    FROM PHIM p
    LEFT JOIN DANH_GIA dg ON p.MaPhim = dg.MaPhim
    WHERE UPPER(p.TenPhim) LIKE v_SearchPattern 
       OR UPPER(p.ChuDePhim) LIKE v_SearchPattern
    GROUP BY p.MaPhim, p.TenPhim, p.ThoiLuong, p.NgonNgu, p.QuocGia,
             p.DaoDien, p.DienVienChinh, p.NgayKhoiChieu, p.MoTaNoiDung,
             p.DoTuoi, p.ChuDePhim, p.Anh
    ORDER BY p.NgayKhoiChieu DESC;
END SP_SearchMoviesWithRating;
/

-- 3. Get user transaction history
CREATE OR REPLACE PROCEDURE SP_GetUserTransactionHistory (
    p_MaNguoiDung IN VARCHAR2
)
AS
BEGIN
    SELECT 
        dh.MaDonHang,
        dh.ThoiGianDat,
        dh.TrangThai,
        dh.TongTien,
        dh.PhuongThuc,
        COUNT(DISTINCT ve.MaVe) AS SoVe,
        COUNT(DISTINCT g.MaHang) AS SoHang
    FROM DON_HANG dh
    LEFT JOIN VE_XEM_PHIM ve ON dh.MaDonHang = ve.MaDonHang
    LEFT JOIN GOM g ON dh.MaDonHang = g.MaDonHang
    WHERE dh.MaNguoiDung_KH = p_MaNguoiDung
    GROUP BY dh.MaDonHang, dh.ThoiGianDat, dh.TrangThai, dh.TongTien, dh.PhuongThuc
    ORDER BY dh.ThoiGianDat DESC;
END SP_GetUserTransactionHistory;
/

-- 4. Get order details with tickets and items
CREATE OR REPLACE PROCEDURE SP_GetOrderDetailWithItems (
    p_MaDonHang IN VARCHAR2
)
AS
BEGIN
    SELECT 
        dh.MaDonHang,
        dh.ThoiGianDat,
        dh.TrangThai,
        dh.TongTien,
        ve.MaVe,
        ve.LoaiVe,
        ve.GiaVe,
        ve.GiaVeCuoi,
        p.TenPhim,
        sc.NgayChieu,
        sc.GioBatDau,
        g.MaHang,
        mh.TenHang,
        gom.SoLuong,
        gom.DonGia
    FROM DON_HANG dh
    LEFT JOIN VE_XEM_PHIM ve ON dh.MaDonHang = ve.MaDonHang
    LEFT JOIN SUAT_CHIEU sc ON ve.MaSuatChieu = sc.MaSuatChieu
    LEFT JOIN PHIM p ON sc.MaPhim = p.MaPhim
    LEFT JOIN GOM gom ON dh.MaDonHang = gom.MaDonHang
    LEFT JOIN MAT_HANG mh ON gom.MaHang = mh.MaHang
    LEFT JOIN GHE g ON ve.MaGhe = g.MaGhe
    WHERE dh.MaDonHang = p_MaDonHang;
END SP_GetOrderDetailWithItems;
/

-- 5. Get all cinema branches
CREATE OR REPLACE PROCEDURE SP_GetAllCinemaBranches
AS
BEGIN
    SELECT 
        MaRapPhim,
        TenRap,
        DiaChi
    FROM RAP_CHIEU_PHIM
    ORDER BY TenRap;
END SP_GetAllCinemaBranches;
/

-- 6. Get movies by cinema
CREATE OR REPLACE PROCEDURE SP_GetMoviesByCinema (
    p_MaRapPhim IN VARCHAR2
)
AS
BEGIN
    SELECT DISTINCT
        p.MaPhim,
        p.TenPhim,
        p.ThoiLuong,
        p.NgayKhoiChieu,
        p.ChuDePhim,
        p.Anh,
        COUNT(DISTINCT sc.MaSuatChieu) AS SoSuatChieu
    FROM PHIM p
    JOIN SUAT_CHIEU sc ON p.MaPhim = sc.MaPhim
    JOIN PHONG_CHIEU pc ON sc.MaPhong = pc.MaPhong
    WHERE pc.MaRapPhim = p_MaRapPhim
      AND sc.TrangThai <> 'Hủy'
      AND sc.NgayChieu >= TRUNC(SYSDATE)
    GROUP BY p.MaPhim, p.TenPhim, p.ThoiLuong, p.NgayKhoiChieu, 
             p.ChuDePhim, p.Anh
    ORDER BY p.NgayKhoiChieu DESC;
END SP_GetMoviesByCinema;
/

-- 7. Get movie details with reviews
CREATE OR REPLACE PROCEDURE SP_GetMovieDetailFull (
    p_MaPhim IN VARCHAR2
)
AS
BEGIN
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
        ROUND(AVG(dg.DiemSo), 1) AS DiemTrungBinh,
        COUNT(DISTINCT dg.MaDanhGia) AS TongDanhGia,
        COUNT(DISTINCT sc.MaSuatChieu) AS SoSuatChieu
    FROM PHIM p
    LEFT JOIN DANH_GIA dg ON p.MaPhim = dg.MaPhim
    LEFT JOIN SUAT_CHIEU sc ON p.MaPhim = sc.MaPhim AND sc.TrangThai <> 'Hủy'
    WHERE p.MaPhim = p_MaPhim
    GROUP BY p.MaPhim, p.TenPhim, p.ThoiLuong, p.NgonNgu, p.QuocGia,
             p.DaoDien, p.DienVienChinh, p.NgayKhoiChieu, p.MoTaNoiDung,
             p.DoTuoi, p.ChuDePhim, p.Anh;
END SP_GetMovieDetailFull;
/

-- 8. Get all reviews for a movie
CREATE OR REPLACE PROCEDURE SP_GetMovieReviews (
    p_MaPhim IN VARCHAR2
)
AS
BEGIN
    SELECT 
        dg.MaDanhGia,
        dg.NoiDung,
        dg.DiemSo,
        dg.NgayDanhGia,
        nd.TenNguoiDung,
        nd.Anh AS UserAvatar
    FROM DANH_GIA dg
    JOIN NGUOI_DUNG nd ON dg.MaNguoiDung = nd.MaNguoiDung
    WHERE dg.MaPhim = p_MaPhim
    ORDER BY dg.NgayDanhGia DESC;
END SP_GetMovieReviews;
/

-- 9. Get showtimes with available seats info
CREATE OR REPLACE PROCEDURE SP_GetShowtimesDetailByMovie (
    p_MaPhim IN VARCHAR2
)
AS
BEGIN
    SELECT 
        sc.MaSuatChieu,
        sc.MaPhim,
        sc.NgayChieu,
        sc.GioBatDau,
        sc.GioKetThuc,
        sc.GiaVe,
        pc.TenPhong,
        pc.SucChua,
        (SELECT COUNT(*) FROM GHE WHERE MaPhong = pc.MaPhong 
         AND TrangThai IN ('Trống', 'Có thể đặt')) AS GheTrong,
        (SELECT COUNT(*) FROM VE_XEM_PHIM 
         WHERE MaSuatChieu = sc.MaSuatChieu 
         AND TrangThai IN ('Đã thanh toán', 'Chờ thanh toán')) AS GheDaBan
    FROM SUAT_CHIEU sc
    JOIN PHONG_CHIEU pc ON sc.MaPhong = pc.MaPhong
    WHERE sc.MaPhim = p_MaPhim
      AND sc.TrangThai <> 'Hủy'
      AND sc.NgayChieu >= TRUNC(SYSDATE)
    ORDER BY sc.NgayChieu, sc.GioBatDau;
END SP_GetShowtimesDetailByMovie;
/

-- 10. Get seat map for specific showtimes
CREATE OR REPLACE PROCEDURE SP_GetSeatMapByShowtime (
    p_MaSuatChieu IN VARCHAR2
)
AS
BEGIN
    SELECT 
        g.MaGhe,
        g.HangGhe,
        g.CotGhe,
        g.TrangThai,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM VE_XEM_PHIM 
                WHERE MaSuatChieu = p_MaSuatChieu 
                AND MaGhe = g.MaGhe 
                AND TrangThai IN ('Đã thanh toán', 'Chờ thanh toán')
            ) THEN 'Booked'
            ELSE g.TrangThai
        END AS SeatStatus
    FROM GHE g
    JOIN PHONG_CHIEU pc ON g.MaPhong = pc.MaPhong
    JOIN SUAT_CHIEU sc ON pc.MaPhong = sc.MaPhong
    WHERE sc.MaSuatChieu = p_MaSuatChieu
    ORDER BY g.HangGhe, g.CotGhe;
END SP_GetSeatMapByShowtime;
/

-- 11. Get user profile with stats
CREATE OR REPLACE PROCEDURE SP_GetUserProfileStats (
    p_MaNguoiDung IN VARCHAR2
)
AS
BEGIN
    SELECT 
        nd.MaNguoiDung,
        nd.TenNguoiDung,
        nd.Email,
        nd.SoDienThoai,
        nd.NgaySinh,
        nd.GioiTinh,
        nd.DiaChi,
        nd.Anh,
        kh.LoaiThanhVien,
        kh.DiemTichLuy,
        COUNT(DISTINCT ve.MaVe) AS TongVeDat,
        COUNT(DISTINCT dh.MaDonHang) AS TongDonHang,
        COALESCE(SUM(dh.TongTien), 0) AS TongChiTieu
    FROM NGUOI_DUNG nd
    LEFT JOIN KHACH_HANG kh ON nd.MaNguoiDung = kh.MaNguoiDung
    LEFT JOIN VE_XEM_PHIM ve ON nd.MaNguoiDung = ve.MaNguoiDung
    LEFT JOIN DON_HANG dh ON nd.MaNguoiDung = dh.MaNguoiDung_KH
    WHERE nd.MaNguoiDung = p_MaNguoiDung
    GROUP BY nd.MaNguoiDung, nd.TenNguoiDung, nd.Email, nd.SoDienThoai,
             nd.NgaySinh, nd.GioiTinh, nd.DiaChi, nd.Anh,
             kh.LoaiThanhVien, kh.DiemTichLuy;
END SP_GetUserProfileStats;
/

-- 12. Get admin revenue report with details
CREATE OR REPLACE PROCEDURE SP_GetRevenueReportDetailed (
    p_FromDate IN DATE DEFAULT TRUNC(SYSDATE) - 30,
    p_ToDate IN DATE DEFAULT TRUNC(SYSDATE)
)
AS
BEGIN
    SELECT 
        p.MaPhim,
        p.TenPhim,
        COUNT(DISTINCT ve.MaVe) AS TongVe,
        SUM(CASE WHEN ve.TrangThai IN ('Đã thanh toán', 'Đã xem') THEN ve.GiaVe ELSE 0 END) AS DoanhThuVe,
        COUNT(DISTINCT dh.MaDonHang) AS TongDonHang,
        SUM(CASE WHEN ve.TrangThai IN ('Đã thanh toán', 'Đã xem') THEN gom.SoLuong * gom.DonGia ELSE 0 END) AS DoanhThuHang,
        SUM(CASE WHEN ve.TrangThai IN ('Đã thanh toán', 'Đã xem') THEN ve.GiaVe ELSE 0 END) 
        + SUM(CASE WHEN ve.TrangThai IN ('Đã thanh toán', 'Đã xem') THEN gom.SoLuong * gom.DonGia ELSE 0 END) AS TongDoanhThu
    FROM PHIM p
    LEFT JOIN SUAT_CHIEU sc ON p.MaPhim = sc.MaPhim
    LEFT JOIN VE_XEM_PHIM ve ON sc.MaSuatChieu = ve.MaSuatChieu
    LEFT JOIN DON_HANG dh ON ve.MaDonHang = dh.MaDonHang
    LEFT JOIN GOM g ON dh.MaDonHang = g.MaDonHang
    LEFT JOIN GOM gom ON g.MaDonHang = gom.MaDonHang AND gom.MaHang = g.MaHang
    WHERE TRUNC(ve.ThoiGianThanhToan) BETWEEN p_FromDate AND p_ToDate
    GROUP BY p.MaPhim, p.TenPhim
    ORDER BY TongDoanhThu DESC;
END SP_GetRevenueReportDetailed;
/

-- 13. Get top movies by revenue
CREATE OR REPLACE PROCEDURE SP_GetTopMoviesByRevenue (
    p_Limit IN NUMBER DEFAULT 10
)
AS
BEGIN
    SELECT * FROM (
        SELECT 
            p.MaPhim,
            p.TenPhim,
            p.Anh,
            COUNT(DISTINCT ve.MaVe) AS TongVe,
            SUM(CASE WHEN ve.TrangThai IN ('Đã thanh toán', 'Đã xem') THEN ve.GiaVe ELSE 0 END) AS DoanhThu,
            ROUND(AVG(CASE WHEN ve.TrangThai IN ('Đã thanh toán', 'Đã xem') THEN ve.GiaVe END), 0) AS GiaTrungBinh
        FROM PHIM p
        JOIN SUAT_CHIEU sc ON p.MaPhim = sc.MaPhim
        LEFT JOIN VE_XEM_PHIM ve ON sc.MaSuatChieu = ve.MaSuatChieu
        WHERE ve.TrangThai IN ('Đã thanh toán', 'Đã xem')
        GROUP BY p.MaPhim, p.TenPhim, p.Anh
        ORDER BY DoanhThu DESC
    )
    WHERE ROWNUM <= p_Limit;
END SP_GetTopMoviesByRevenue;
/

-- 14. Get customer payment history
CREATE OR REPLACE PROCEDURE SP_GetCustomerPaymentHistory (
    p_MaNguoiDung IN VARCHAR2
)
AS
BEGIN
    SELECT 
        tt.MaThanhToan,
        dh.MaDonHang,
        tt.SoTienThanhToan,
        tt.PhuongThuc,
        tt.ThoiGianThanhToan,
        tt.TrangThai,
        dh.TongTien,
        CASE WHEN tt.SoTienThanhToan >= dh.TongTien THEN 'Đã thanh toán' ELSE 'Chưa thanh toán' END AS PaymentStatus
    FROM THANH_TOAN tt
    JOIN DON_HANG dh ON tt.MaDonHang = dh.MaDonHang
    WHERE dh.MaNguoiDung_KH = p_MaNguoiDung
    ORDER BY tt.ThoiGianThanhToan DESC;
END SP_GetCustomerPaymentHistory;
/

-- 15. Get available promotions
CREATE OR REPLACE PROCEDURE SP_GetActivePromotions
AS
BEGIN
    SELECT 
        MaKhuyenMai,
        TenKhuyenMai,
        PhanTramGiam,
        NgayBatDau,
        NgayKetThuc,
        MoTa
    FROM KHUYẾN_MÃI
    WHERE TRUNC(SYSDATE) BETWEEN NgayBatDau AND NgayKetThuc
    ORDER BY PhanTramGiam DESC;
END SP_GetActivePromotions;
/

-- ============================================================================
-- ADDITIONAL PROCEDURES FOR AUTH SERVICE METHODS
-- ============================================================================

-- 16. Get showtimes by movie, cinema and date
CREATE OR REPLACE PROCEDURE SP_GetShowtimesByMovieCinemaDate (
    p_MaPhim IN VARCHAR2,
    p_MaRapPhim IN NUMBER,
    p_NgayChieu IN DATE
)
AS
BEGIN
    SELECT 
        sc.MaSuatChieu,
        sc.MaPhim,
        sc.MaPhong,
        sc.NgayChieu,
        sc.GioBatDau,
        sc.GioKetThuc,
        sc.GiaVeCoBan,
        sc.TrangThai,
        pc.TenPhong,
        pc.SoGheToiDa,
        (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = sc.MaSuatChieu AND TrangThai <> 'Hủy') AS GheDaBan,
        (pc.SoGheToiDa - (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaSuatChieu = sc.MaSuatChieu AND TrangThai <> 'Hủy')) AS GheTrong
    FROM SUAT_CHIEU sc
    JOIN PHONG_CHIEU pc ON sc.MaPhong = pc.MaPhong
    WHERE sc.MaPhim = p_MaPhim
      AND pc.MaRapPhim = p_MaRapPhim
      AND TRUNC(sc.NgayChieu) = TRUNC(p_NgayChieu)
      AND sc.TrangThai <> 'Hủy'
    ORDER BY sc.GioBatDau ASC;
END SP_GetShowtimesByMovieCinemaDate;
/

-- 17. Get booked seats for a showtime
CREATE OR REPLACE PROCEDURE SP_GetBookedSeats (
    p_MaSuatChieu IN VARCHAR2
)
AS
BEGIN
    SELECT 
        HangGhe,
        SoGhe,
        TrangThai
    FROM VE_XEM_PHIM
    WHERE MaSuatChieu = p_MaSuatChieu
      AND TrangThai <> 'Hủy'
    ORDER BY HangGhe, SoGhe;
END SP_GetBookedSeats;
/

-- 18. Get now showing movies (with showtimes in future)
CREATE OR REPLACE PROCEDURE SP_GetNowShowingMovies
AS
BEGIN
    SELECT DISTINCT
        p.MaPhim,
        p.TenPhim,
        p.Anh,
        p.ThoiLuong,
        p.NgayKhoiChieu,
        COALESCE(ROUND(AVG(dg.DiemSo), 1), 0) AS DiemDanhGia,
        COUNT(DISTINCT sc.MaSuatChieu) AS SoSuatChieu
    FROM PHIM p
    LEFT JOIN DANH_GIA dg ON p.MaPhim = dg.MaPhim
    JOIN SUAT_CHIEU sc ON p.MaPhim = sc.MaPhim
    WHERE sc.NgayChieu >= TRUNC(SYSDATE)
      AND sc.TrangThai <> 'Hủy'
    GROUP BY p.MaPhim, p.TenPhim, p.Anh, p.ThoiLuong, p.NgayKhoiChieu
    ORDER BY p.NgayKhoiChieu DESC;
END SP_GetNowShowingMovies;
/

-- 19. Get movies sorted by rating
CREATE OR REPLACE PROCEDURE SP_GetMoviesSortedByRating (
    p_Limit IN NUMBER DEFAULT 10
)
AS
BEGIN
    SELECT *
    FROM (
        SELECT 
            p.MaPhim,
            p.TenPhim,
            p.Anh,
            p.ThoiLuong,
            p.NgayKhoiChieu,
            COALESCE(ROUND(AVG(dg.DiemSo), 1), 0) AS DiemDanhGia,
            COUNT(DISTINCT dg.MaDanhGia) AS TongDanhGia
        FROM PHIM p
        LEFT JOIN DANH_GIA dg ON p.MaPhim = dg.MaPhim
        GROUP BY p.MaPhim, p.TenPhim, p.Anh, p.ThoiLuong, p.NgayKhoiChieu
        ORDER BY DiemDanhGia DESC, TongDanhGia DESC
    )
    WHERE ROWNUM <= p_Limit;
END SP_GetMoviesSortedByRating;
/

-- 20. Filter movies by name, genre, and year
CREATE OR REPLACE PROCEDURE SP_FilterMovies (
    p_TenPhim IN VARCHAR2 DEFAULT NULL,
    p_TheLoai IN VARCHAR2 DEFAULT NULL,
    p_Nam IN NUMBER DEFAULT NULL
)
AS
    v_SearchName VARCHAR2(500);
BEGIN
    v_SearchName := CASE WHEN p_TenPhim IS NOT NULL THEN '%' || UPPER(p_TenPhim) || '%' ELSE NULL END;
    
    SELECT DISTINCT
        p.MaPhim,
        p.TenPhim,
        p.Anh,
        p.ThoiLuong,
        p.NgayKhoiChieu,
        COALESCE(ROUND(AVG(dg.DiemSo), 1), 0) AS DiemDanhGia
    FROM PHIM p
    LEFT JOIN THE_LOAI_PHIM tlp ON p.MaPhim = tlp.MaPhim
    LEFT JOIN DANH_GIA dg ON p.MaPhim = dg.MaPhim
    WHERE (v_SearchName IS NULL OR UPPER(p.TenPhim) LIKE v_SearchName)
      AND (p_TheLoai IS NULL OR tlp.TheLoai = p_TheLoai)
      AND (p_Nam IS NULL OR YEAR(p.NgayKhoiChieu) = p_Nam)
    GROUP BY p.MaPhim, p.TenPhim, p.Anh, p.ThoiLuong, p.NgayKhoiChieu
    ORDER BY p.NgayKhoiChieu DESC;
END SP_FilterMovies;
/

-- 21. Get combos/snacks available for booking
CREATE OR REPLACE PROCEDURE SP_GetCombos
AS
BEGIN
    SELECT 
        MaHang,
        TenHang,
        DonGia,
        LoaiHang,
        MoTa
    FROM MAT_HANG
    WHERE LoaiHang = 'DO_AN'
    ORDER BY TenHang;
END SP_GetCombos;
/

-- 22. Get user profile with stats
CREATE OR REPLACE PROCEDURE SP_GetUserProfileWithStats (
    p_MaNguoiDung IN VARCHAR2
)
AS
BEGIN
    SELECT 
        tk.MaNguoiDung,
        tk.HoTen,
        tk.Email,
        tk.SDT,
        tk.DiaChi,
        tk.GioiTinh,
        kh.LoaiThanhVien,
        kh.DiemTichLuy,
        FUNC_XepHangThanhVien(p_MaNguoiDung) AS HangThanhVienCurrent,
        (SELECT COUNT(*) FROM DON_HANG WHERE MaNguoiDung_KH = p_MaNguoiDung) AS TongDonHang,
        (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaNguoiDung_KH = p_MaNguoiDung AND TrangThai <> 'Hủy') AS TongVeDat,
        (SELECT COALESCE(SUM(TongTien), 0) FROM DON_HANG WHERE MaNguoiDung_KH = p_MaNguoiDung AND TrangThai = 'Đã thanh toán') AS TongChiTieu
    FROM TAI_KHOAN tk
    LEFT JOIN KHACH_HANG kh ON tk.MaNguoiDung = kh.MaNguoiDung
    WHERE tk.MaNguoiDung = p_MaNguoiDung;
END SP_GetUserProfileWithStats;
/

-- 23. Get order details with items
CREATE OR REPLACE PROCEDURE SP_GetOrderDetailsWithItems (
    p_MaDonHang IN VARCHAR2
)
AS
BEGIN
    SELECT 
        dh.MaDonHang,
        dh.MaNguoiDung_KH,
        dh.PhuongThuc,
        dh.ThoiGianDat,
        dh.TongTien,
        dh.TrangThai,
        vxp.MaVe,
        vxp.HangGhe,
        vxp.SoGhe,
        vxp.GiaVeCuoi,
        sc.NgayChieu,
        sc.GioBatDau,
        sc.GioKetThuc,
        p.TenPhim,
        pc.TenPhong,
        r.TenRap,
        gom.MaHang,
        mh.TenHang,
        gom.SoLuong,
        gom.DonGia
    FROM DON_HANG dh
    LEFT JOIN VE_XEM_PHIM vxp ON dh.MaDonHang = vxp.MaDonHang
    LEFT JOIN SUAT_CHIEU sc ON vxp.MaSuatChieu = sc.MaSuatChieu
    LEFT JOIN PHIM p ON sc.MaPhim = p.MaPhim
    LEFT JOIN PHONG_CHIEU pc ON vxp.MaPhong = pc.MaPhong
    LEFT JOIN RAP_CHIEU_PHIM r ON pc.MaRapPhim = r.MaRapPhim
    LEFT JOIN GOM gom ON dh.MaDonHang = gom.MaDonHang
    LEFT JOIN MAT_HANG mh ON gom.MaHang = mh.MaHang
    WHERE dh.MaDonHang = p_MaDonHang
    ORDER BY vxp.MaVe, gom.MaHang;
END SP_GetOrderDetailsWithItems;
/
