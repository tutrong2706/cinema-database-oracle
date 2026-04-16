-- ORACLE VERSION: Stored Procedures for VE_XEM_PHIM (Movie Ticket) Management
-- ============================================================================

-- 1. CREATE NEW TICKET BOOKING
CREATE OR REPLACE PROCEDURE SP_DatVe (
    p_MaVe          IN VE_XEM_PHIM.MaVe%TYPE,
    p_MaNguoiDung   IN VE_XEM_PHIM.MaNguoiDung%TYPE,
    p_MaSuatChieu   IN VE_XEM_PHIM.MaSuatChieu%TYPE,
    p_MaGhe         IN VE_XEM_PHIM.MaGhe%TYPE,
    p_LoaiVe        IN VE_XEM_PHIM.LoaiVe%TYPE,
    p_GiaVe         IN VE_XEM_PHIM.GiaVe%TYPE
)
AS
    v_seat_status   GHE.TrangThai%TYPE;
    v_showtimeExists INT;
BEGIN
    -- Check if ticket code already exists
    IF (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaVe = p_MaVe) > 0 THEN
        RAISE_APPLICATION_ERROR(-20020, 'Mã vé đã tồn tại.');
    END IF;

    -- Check if showtimes exist
    SELECT COUNT(*) INTO v_showtimeExists FROM SUAT_CHIEU 
    WHERE MaSuatChieu = p_MaSuatChieu AND TrangThai <> 'Hủy';
    
    IF v_showtimeExists = 0 THEN
        RAISE_APPLICATION_ERROR(-20021, 'Suất chiếu không tồn tại hoặc đã bị hủy.');
    END IF;

    -- Check seat status
    SELECT TrangThai INTO v_seat_status FROM GHE 
    WHERE MaGhe = p_MaGhe;

    IF v_seat_status IS NULL THEN
        RAISE_APPLICATION_ERROR(-20022, 'Ghế không tồn tại.');
    END IF;

    IF v_seat_status NOT IN ('Trống', 'Có thể đặt') THEN
        RAISE_APPLICATION_ERROR(-20023, 'Ghế không khả dụng.');
    END IF;

    -- Insert ticket
    INSERT INTO VE_XEM_PHIM (MaVe, MaNguoiDung, MaSuatChieu, MaGhe, LoaiVe, GiaVe, TrangThai, ThoiGianDat)
    VALUES (p_MaVe, p_MaNguoiDung, p_MaSuatChieu, p_MaGhe, p_LoaiVe, p_GiaVe, 'Chờ thanh toán', SYSDATE);

    -- Update seat status
    UPDATE GHE SET TrangThai = 'Đang giữ' WHERE MaGhe = p_MaGhe;

    COMMIT;
END SP_DatVe;
/

-- 2. CONFIRM/COMPLETE TICKET PAYMENT
CREATE OR REPLACE PROCEDURE SP_ThanhToanVe (
    p_MaVe IN VE_XEM_PHIM.MaVe%TYPE
)
AS
    v_GheCode GHE.MaGhe%TYPE;
BEGIN
    -- Check if ticket exists
    IF (SELECT COUNT(*) FROM VE_XEM_PHIM WHERE MaVe = p_MaVe) = 0 THEN
        RAISE_APPLICATION_ERROR(-20024, 'Mã vé không tồn tại.');
    END IF;

    -- Get associated seat
    SELECT MaGhe INTO v_GheCode FROM VE_XEM_PHIM WHERE MaVe = p_MaVe;

    -- Update ticket status
    UPDATE VE_XEM_PHIM 
    SET TrangThai = 'Đã thanh toán', ThoiGianThanhToan = SYSDATE 
    WHERE MaVe = p_MaVe;

    -- Update seat to sold
    UPDATE GHE SET TrangThai = 'Đã bán' WHERE MaGhe = v_GheCode;

    COMMIT;
END SP_ThanhToanVe;
/

-- 3. CANCEL TICKET
CREATE OR REPLACE PROCEDURE SP_HuyVe (
    p_MaVe IN VE_XEM_PHIM.MaVe%TYPE
)
AS
    v_GheCode       GHE.MaGhe%TYPE;
    v_TicketStatus  VE_XEM_PHIM.TrangThai%TYPE;
BEGIN
    -- Get ticket info
    SELECT MaGhe, TrangThai INTO v_GheCode, v_TicketStatus 
    FROM VE_XEM_PHIM WHERE MaVe = p_MaVe;

    IF v_GheCode IS NULL THEN
        RAISE_APPLICATION_ERROR(-20024, 'Mã vé không tồn tại.');
    END IF;

    -- Cannot cancel if already paid and viewed
    IF v_TicketStatus = 'Đã xem' THEN
        RAISE_APPLICATION_ERROR(-20025, 'Không thể hủy vé đã xem.');
    END IF;

    -- Update ticket status
    UPDATE VE_XEM_PHIM SET TrangThai = 'Hủy' WHERE MaVe = p_MaVe;

    -- Reset seat to available
    UPDATE GHE SET TrangThai = 'Trống' WHERE MaGhe = v_GheCode;

    COMMIT;
END SP_HuyVe;
/

-- 4. GET TICKET BY CODE
CREATE OR REPLACE PROCEDURE SP_Get_Ve_ByCode (
    p_MaVe IN VE_XEM_PHIM.MaVe%TYPE
)
AS
BEGIN
    SELECT * FROM VE_XEM_PHIM WHERE MaVe = p_MaVe;
END SP_Get_Ve_ByCode;
/

-- 5. GET ALL TICKETS FOR USER
CREATE OR REPLACE PROCEDURE SP_Get_Ve_ByNguoiDung (
    p_MaNguoiDung IN VE_XEM_PHIM.MaNguoiDung%TYPE
)
AS
BEGIN
    SELECT 
        v.MaVe,
        v.MaNguoiDung,
        v.MaSuatChieu,
        p.TenPhim,
        v.MaGhe,
        v.LoaiVe,
        v.GiaVe,
        v.TrangThai,
        v.ThoiGianDat
    FROM VE_XEM_PHIM v
    JOIN SUAT_CHIEU s ON v.MaSuatChieu = s.MaSuatChieu
    JOIN PHIM p ON s.MaPhim = p.MaPhim
    WHERE v.MaNguoiDung = p_MaNguoiDung
    ORDER BY v.ThoiGianDat DESC;
END SP_Get_Ve_ByNguoiDung;
/

-- 6. GET AVAILABLE SEATS FOR SHOWTIMES
CREATE OR REPLACE PROCEDURE SP_Get_GheTrong (
    p_MaSuatChieu IN SUAT_CHIEU.MaSuatChieu%TYPE
)
AS
BEGIN
    SELECT 
        g.MaGhe,
        g.MaPhong,
        g.HangGhe,
        g.CotGhe,
        g.TrangThai
    FROM GHE g
    WHERE g.MaPhong = (SELECT MaPhong FROM SUAT_CHIEU WHERE MaSuatChieu = p_MaSuatChieu)
    AND g.TrangThai IN ('Trống', 'Có thể đặt')
    ORDER BY g.HangGhe, g.CotGhe;
END SP_Get_GheTrong;
/

-- 7. GET BOOKED SEATS FOR SHOWTIMES
CREATE OR REPLACE PROCEDURE SP_Get_GheDaDat (
    p_MaSuatChieu IN SUAT_CHIEU.MaSuatChieu%TYPE
)
AS
BEGIN
    SELECT DISTINCT g.MaGhe FROM GHE g
    JOIN VE_XEM_PHIM v ON g.MaGhe = v.MaGhe
    WHERE v.MaSuatChieu = p_MaSuatChieu
    AND v.TrangThai IN ('Chờ thanh toán', 'Đã thanh toán')
    ORDER BY g.MaGhe;
END SP_Get_GheDaDat;
/

-- 8. UPDATE TICKET STATUS TO VIEWED
CREATE OR REPLACE PROCEDURE SP_CapNhatVeDaXem (
    p_MaVe IN VE_XEM_PHIM.MaVe%TYPE
)
AS
BEGIN
    -- Check if ticket is paid
    IF (SELECT TrangThai FROM VE_XEM_PHIM WHERE MaVe = p_MaVe) <> 'Đã thanh toán' THEN
        RAISE_APPLICATION_ERROR(-20026, 'Chỉ có thể đánh dấu vé đã thanh toán là đã xem.');
    END IF;

    UPDATE VE_XEM_PHIM 
    SET TrangThai = 'Đã xem', ThoiGianXem = SYSDATE 
    WHERE MaVe = p_MaVe;

    COMMIT;
END SP_CapNhatVeDaXem;
/
