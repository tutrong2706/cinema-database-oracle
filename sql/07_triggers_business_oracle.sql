-- ORACLE VERSION: Business Logic Triggers
-- ============================================================================

-- TRIGGER 1: Validate screening date >= movie release date
CREATE OR REPLACE TRIGGER TRG_SC_CheckNgayPhim
BEFORE INSERT ON SUAT_CHIEU
FOR EACH ROW
DECLARE
    v_NgayKhoiChieu PHIM.NgayKhoiChieu%TYPE;
BEGIN
    SELECT NgayKhoiChieu INTO v_NgayKhoiChieu
    FROM PHIM
    WHERE MaPhim = :NEW.MaPhim;

    IF :NEW.NgayChieu < v_NgayKhoiChieu THEN
        RAISE_APPLICATION_ERROR(-20030, 'Ngày chiếu phải >= ngày khởi chiếu phim.');
    END IF;
END TRG_SC_CheckNgayPhim;
/

-- TRIGGER 1B: Check screening date on UPDATE
CREATE OR REPLACE TRIGGER TRG_SC_CheckNgayPhim_Update
BEFORE UPDATE ON SUAT_CHIEU
FOR EACH ROW
DECLARE
    v_NgayKhoiChieu PHIM.NgayKhoiChieu%TYPE;
BEGIN
    -- Only check if MaPhim or NgayChieu changes
    IF :NEW.MaPhim <> :OLD.MaPhim OR :NEW.NgayChieu <> :OLD.NgayChieu THEN
        SELECT NgayKhoiChieu INTO v_NgayKhoiChieu
        FROM PHIM
        WHERE MaPhim = :NEW.MaPhim;

        IF :NEW.NgayChieu < v_NgayKhoiChieu THEN
            RAISE_APPLICATION_ERROR(-20030, 'Ngày chiếu cập nhật phải >= ngày khởi chiếu phim.');
        END IF;
    END IF;
END TRG_SC_CheckNgayPhim_Update;
/

-- TRIGGER 2: No overlapping showtimes in same cinema room
CREATE OR REPLACE TRIGGER TRG_SC_NoOverlapInRoom
BEFORE INSERT ON SUAT_CHIEU
FOR EACH ROW
DECLARE
    v_Count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_Count
    FROM SUAT_CHIEU s
    WHERE s.MaPhong = :NEW.MaPhong
    AND s.NgayChieu = :NEW.NgayChieu
    AND s.MaSuatChieu <> :NEW.MaSuatChieu
    AND NOT (:NEW.GioKetThuc <= s.GioBatDau OR :NEW.GioBatDau >= s.GioKetThuc)
    AND s.TrangThai <> 'Hủy';

    IF v_Count > 0 THEN
        RAISE_APPLICATION_ERROR(-20031, 'Một phòng chỉ có 1 suất chiếu tại 1 thời điểm.');
    END IF;
END TRG_SC_NoOverlapInRoom;
/

-- TRIGGER 3: Validate ticket payment status with order
CREATE OR REPLACE TRIGGER TRG_VE_CheckThanhToan
BEFORE UPDATE ON VE_XEM_PHIM
FOR EACH ROW
DECLARE
    v_Count NUMBER;
BEGIN
    IF :NEW.TrangThai = 'Đã thanh toán' THEN
        SELECT COUNT(*) INTO v_Count
        FROM THANH_TOAN
        WHERE MaDonHang = :NEW.MaDonHang
        AND TrangThai = 'Đã thanh toán';

        IF v_Count = 0 THEN
            RAISE_APPLICATION_ERROR(-20032, 'Vé chỉ được thanh toán khi đơn hàng đã thanh toán.');
        END IF;
    END IF;
END TRG_VE_CheckThanhToan;
/

-- TRIGGER 4: Validate promotion date range
CREATE OR REPLACE TRIGGER TRG_AP_DUNG_CheckKhuyenMai
BEFORE INSERT ON AP_DUNG
FOR EACH ROW
DECLARE
    v_Count NUMBER;
BEGIN
    IF :NEW.MaKhuyenMai IS NOT NULL THEN
        SELECT COUNT(*) INTO v_Count
        FROM CHUONG_TRINH_KHUYEN_MAI
        WHERE MaKhuyenMai = :NEW.MaKhuyenMai
        AND TRUNC(SYSDATE) BETWEEN NgayBatDau AND NgayKetThuc;

        IF v_Count = 0 THEN
            RAISE_APPLICATION_ERROR(-20033, 'Mã khuyến mãi không hợp lệ hoặc hết hạn.');
        END IF;
    END IF;
END TRG_AP_DUNG_CheckKhuyenMai;
/

-- TRIGGER 5: Auto-calculate final price with discount
CREATE OR REPLACE TRIGGER TRG_AP_DUNG_TinhGiaCuoi
BEFORE INSERT ON AP_DUNG
FOR EACH ROW
DECLARE
    v_MucGiam NUMBER;
    v_GiaGoc NUMBER;
    v_GiaCuoi NUMBER;
BEGIN
    -- Get base price from ticket
    SELECT GiaVeCuoi INTO v_GiaGoc
    FROM VE_XEM_PHIM
    WHERE MaVe = :NEW.MaVe;
    
    -- Get discount amount
    SELECT NVL(MucGiam, 0) INTO v_MucGiam
    FROM CHUONG_TRINH_KHUYEN_MAI
    WHERE MaKhuyenMai = :NEW.MaKhuyenMai;
    
    -- Calculate final price (MucGiam is absolute amount)
    v_GiaCuoi := v_GiaGoc - v_MucGiam;
    
    -- Update ticket with final price
    UPDATE VE_XEM_PHIM
    SET GiaVeCuoi = GREATEST(v_GiaCuoi, 0)
    WHERE MaVe = :NEW.MaVe;
END TRG_AP_DUNG_TinhGiaCuoi;
/

-- TRIGGER 6: Prevent double booking of seats
CREATE OR REPLACE TRIGGER TRG_VE_CheckGheAvailable
BEFORE INSERT ON VE_XEM_PHIM
FOR EACH ROW
DECLARE
    v_Count NUMBER;
BEGIN
    -- Check if seat already booked for this showtimes
    SELECT COUNT(*) INTO v_Count
    FROM VE_XEM_PHIM
    WHERE MaSuatChieu = :NEW.MaSuatChieu
    AND MaPhong = :NEW.MaPhong
    AND HangGhe = :NEW.HangGhe
    AND SoGhe = :NEW.SoGhe
    AND TrangThai IN ('Đã đặt', 'Đã thanh toán');

    IF v_Count > 0 THEN
        RAISE_APPLICATION_ERROR(-20034, 'Ghế này đã được đặt cho suất chiếu này.');
    END IF;

    -- Check if seat exists
    SELECT COUNT(*) INTO v_Count
    FROM GHE
    WHERE MaPhong = :NEW.MaPhong
    AND HangGhe = :NEW.HangGhe
    AND SoGhe = :NEW.SoGhe;

    IF v_Count = 0 THEN
        RAISE_APPLICATION_ERROR(-20035, 'Ghế không tồn tại.');
    END IF;
END TRG_VE_CheckGheAvailable;
/

-- TRIGGER 7: Stock control for snacks/drinks
CREATE OR REPLACE TRIGGER TRG_GOM_CheckStock
BEFORE INSERT ON GOM
FOR EACH ROW
DECLARE
    v_SoLuongTon MAT_HANG.SoLuongTon%TYPE;
BEGIN
    SELECT SoLuongTon INTO v_SoLuongTon
    FROM MAT_HANG
    WHERE MaHang = :NEW.MaHang;

    IF v_SoLuongTon < :NEW.SoLuong THEN
        RAISE_APPLICATION_ERROR(-20036, 'Số lượng tồn kho không đủ: ' || v_SoLuongTon || ' cái.');
    END IF;
END TRG_GOM_CheckStock;
/

-- TRIGGER 8: Auto-deduct stock when adding snacks to order
CREATE OR REPLACE TRIGGER TRG_GOM_UpdateStock
AFTER INSERT ON GOM
FOR EACH ROW
BEGIN
    UPDATE MAT_HANG
    SET SoLuongTon = SoLuongTon - :NEW.SoLuong
    WHERE MaHang = :NEW.MaHang;
END TRG_GOM_UpdateStock;
/

-- TRIGGER 9: Auto-restore stock when removing snacks from order
CREATE OR REPLACE TRIGGER TRG_GOM_RestoreStock
AFTER DELETE ON GOM
FOR EACH ROW
BEGIN
    UPDATE MAT_HANG
    SET SoLuongTon = SoLuongTon + :OLD.SoLuong
    WHERE MaHang = :OLD.MaHang;
END TRG_GOM_RestoreStock;
/

-- TRIGGER 10: Prevent delete of paid orders and tickets
CREATE OR REPLACE TRIGGER TRG_PreventDeletePaidOrder
BEFORE DELETE ON DON_HANG
FOR EACH ROW
DECLARE
    v_Count NUMBER;
BEGIN
    -- Check if order has paid tickets
    IF :OLD.TrangThai = 'Đã thanh toán' THEN
        SELECT COUNT(*) INTO v_Count
        FROM VE_XEM_PHIM
        WHERE MaDonHang = :OLD.MaDonHang
        AND TrangThai = 'Đã thanh toán';

        IF v_Count > 0 THEN
            RAISE_APPLICATION_ERROR(-20037, 'Không thể xóa đơn hàng đã thanh toán.');
        END IF;
    END IF;
END TRG_PreventDeletePaidOrder;
/
