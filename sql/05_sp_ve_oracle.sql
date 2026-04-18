-- ORACLE VERSION: Stored Procedures for VE_XEM_PHIM (Movie Ticket) Management
-- ============================================================================

-- 1. CREATE NEW TICKET BOOKING
CREATE OR REPLACE PROCEDURE SP_DatVe (
    p_MaVe          IN VE_XEM_PHIM.MaVe%TYPE,
    p_MaNguoiDung_KH IN VE_XEM_PHIM.MaNguoiDung_KH%TYPE,
    p_MaSuatChieu   IN VE_XEM_PHIM.MaSuatChieu%TYPE,
    p_MaPhong       IN VE_XEM_PHIM.MaPhong%TYPE,
    p_HangGhe       IN VE_XEM_PHIM.HangGhe%TYPE,
    p_SoGhe         IN VE_XEM_PHIM.SoGhe%TYPE,
    p_GiaVeCuoi     IN VE_XEM_PHIM.GiaVeCuoi%TYPE,
    p_MaDonHang     IN VE_XEM_PHIM.MaDonHang%TYPE
)
AS
    v_count NUMBER;
    v_suatExists NUMBER;
BEGIN
    -- Check if ticket code already exists
    SELECT COUNT(*) INTO v_count FROM VE_XEM_PHIM WHERE MaVe = p_MaVe;
    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20020, 'Mã vé đã tồn tại.');
    END IF;

    -- Check if showtimes exist and active
    SELECT COUNT(*) INTO v_suatExists FROM SUAT_CHIEU 
    WHERE MaSuatChieu = p_MaSuatChieu AND TrangThai = 'Đang mở';
    
    IF v_suatExists = 0 THEN
        RAISE_APPLICATION_ERROR(-20021, 'Suất chiếu không tồn tại hoặc đã bị hủy.');
    END IF;

    -- Check if seat exists
    SELECT COUNT(*) INTO v_count FROM GHE 
    WHERE MaPhong = p_MaPhong AND HangGhe = p_HangGhe AND SoGhe = p_SoGhe;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20022, 'Ghế không tồn tại.');
    END IF;

    -- Insert ticket
    INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai)
    VALUES (p_MaVe, p_MaSuatChieu, p_MaPhong, p_HangGhe, p_SoGhe, p_MaNguoiDung_KH, p_MaDonHang, p_GiaVeCuoi, SYSDATE, 'Đã đặt');

    COMMIT;
END SP_DatVe;
/

-- 2. UPDATE TICKET STATUS TO PAID
CREATE OR REPLACE PROCEDURE SP_ThanhToanVe (
    p_MaVe IN VE_XEM_PHIM.MaVe%TYPE
)
AS
    v_count NUMBER;
BEGIN
    -- Check if ticket exists
    SELECT COUNT(*) INTO v_count FROM VE_XEM_PHIM WHERE MaVe = p_MaVe;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20024, 'Mã vé không tồn tại.');
    END IF;

    -- Update ticket status
    UPDATE VE_XEM_PHIM 
    SET TrangThai = 'Đã thanh toán'
    WHERE MaVe = p_MaVe;

    COMMIT;
END SP_ThanhToanVe;
/

-- 3. CANCEL TICKET
CREATE OR REPLACE PROCEDURE SP_HuyVe (
    p_MaVe IN VE_XEM_PHIM.MaVe%TYPE
)
AS
    v_TicketStatus VE_XEM_PHIM.TrangThai%TYPE;
    v_count NUMBER;
BEGIN
    -- Get ticket info
    SELECT TrangThai INTO v_TicketStatus FROM VE_XEM_PHIM WHERE MaVe = p_MaVe;
    
    IF v_TicketStatus IS NULL THEN
        RAISE_APPLICATION_ERROR(-20024, 'Mã vé không tồn tại.');
    END IF;

    -- Update ticket status to cancelled
    UPDATE VE_XEM_PHIM SET TrangThai = 'Hủy' WHERE MaVe = p_MaVe;

    COMMIT;
END SP_HuyVe;
/

-- 4. GET TICKET BY CODE
CREATE OR REPLACE PROCEDURE SP_Get_Ve_ByCode (
    p_MaVe IN VE_XEM_PHIM.MaVe%TYPE,
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT * FROM VE_XEM_PHIM WHERE MaVe = p_MaVe;
END SP_Get_Ve_ByCode;
/

-- 5. GET ALL TICKETS FOR USER
CREATE OR REPLACE PROCEDURE SP_Get_Ve_ByNguoiDung (
    p_MaNguoiDung_KH IN VE_XEM_PHIM.MaNguoiDung_KH%TYPE,
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT 
        v.MaVe,
        v.MaNguoiDung_KH,
        v.MaSuatChieu,
        p.TenPhim,
        v.MaPhong,
        v.HangGhe,
        v.SoGhe,
        v.GiaVeCuoi,
        v.TrangThai,
        v.NgayDat
    FROM VE_XEM_PHIM v
    JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
    JOIN PHIM p ON s.MaPhim = p.MaPhim
    WHERE v.MaNguoiDung_KH = p_MaNguoiDung_KH
    ORDER BY v.NgayDat DESC;
END SP_Get_Ve_ByNguoiDung;
/

-- 6. GET AVAILABLE SEATS FOR SHOWTIMES
CREATE OR REPLACE PROCEDURE SP_Get_GheTrong (
    p_MaSuatChieu IN SUAT_CHIEU.MaSuatChieu%TYPE,
    p_cursor OUT SYS_REFCURSOR
)
AS
    v_MaPhong VARCHAR2(20);
BEGIN
    -- Get room from showtimes
    SELECT MaPhong INTO v_MaPhong FROM SUAT_CHIEU WHERE MaSuatChieu = p_MaSuatChieu;
    
    OPEN p_cursor FOR
    SELECT 
        g.MaPhong,
        g.HangGhe,
        g.SoGhe,
        g.LoaiGhe
    FROM GHE g
    WHERE g.MaPhong = v_MaPhong
    AND NOT EXISTS (
        SELECT 1 FROM VE_XEM_PHIM v 
        WHERE v.MaSuatChieu = p_MaSuatChieu 
        AND v.MaPhong = g.MaPhong 
        AND v.HangGhe = g.HangGhe 
        AND v.SoGhe = g.SoGhe
        AND v.TrangThai IN ('Đã đặt', 'Đã thanh toán')
    )
    ORDER BY g.HangGhe, g.SoGhe;
END SP_Get_GheTrong;
/

-- 7. GET BOOKED SEATS FOR SHOWTIMES
CREATE OR REPLACE PROCEDURE SP_Get_GheDaDat (
    p_MaSuatChieu IN SUAT_CHIEU.MaSuatChieu%TYPE,
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT DISTINCT 
        v.MaPhong,
        v.HangGhe,
        v.SoGhe
    FROM VE_XEM_PHIM v
    WHERE v.MaSuatChieu = p_MaSuatChieu
    AND v.TrangThai IN ('Đã đặt', 'Đã thanh toán')
    ORDER BY v.HangGhe, v.SoGhe;
END SP_Get_GheDaDat;
/

-- 8. GET TICKETS BY ORDER
CREATE OR REPLACE PROCEDURE SP_Get_Ve_ByDonHang (
    p_MaDonHang IN VE_XEM_PHIM.MaDonHang%TYPE,
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
    SELECT 
        v.MaVe,
        v.MaSuatChieu,
        p.TenPhim,
        v.HangGhe,
        v.SoGhe,
        v.GiaVeCuoi,
        v.TrangThai
    FROM VE_XEM_PHIM v
    JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
    JOIN PHIM p ON s.MaPhim = p.MaPhim
    WHERE v.MaDonHang = p_MaDonHang
    ORDER BY v.NgayDat DESC;
END SP_Get_Ve_ByDonHang;
/

-- 9. GET TICKET COUNT FOR SHOWTIMES
CREATE OR REPLACE PROCEDURE SP_Get_SoVeDaDat (
    p_MaSuatChieu IN SUAT_CHIEU.MaSuatChieu%TYPE,
    p_SoVeDaDat OUT NUMBER
)
AS
BEGIN
    SELECT COUNT(*) INTO p_SoVeDaDat FROM VE_XEM_PHIM
    WHERE MaSuatChieu = p_MaSuatChieu
    AND TrangThai IN ('Đã đặt', 'Đã thanh toán');
END SP_Get_SoVeDaDat;
/

-- 10. GET TOTAL REVENUE FROM TICKETS
CREATE OR REPLACE PROCEDURE SP_Get_DoanhThuVe (
    p_MaSuatChieu IN SUAT_CHIEU.MaSuatChieu%TYPE,
    p_DoanhThu OUT NUMBER
)
AS
BEGIN
    SELECT COALESCE(SUM(GiaVeCuoi), 0) INTO p_DoanhThu FROM VE_XEM_PHIM
    WHERE MaSuatChieu = p_MaSuatChieu
    AND TrangThai = 'Đã thanh toán';
END SP_Get_DoanhThuVe;
/

