-- ORACLE VERSION: Order Total Calculation Triggers (Auto-Update Order Total)
-- ============================================================================

-- TRIGGER 1: Update order total when adding snacks (GOM table)
CREATE OR REPLACE TRIGGER TRG_GOM_UpdateTongTien_Insert
AFTER INSERT ON GOM
FOR EACH ROW
BEGIN
    UPDATE DON_HANG
    SET TongTien = TongTien + (:NEW.SoLuong * :NEW.DonGia)
    WHERE MaDonHang = :NEW.MaDonHang;
    
    COMMIT;
END TRG_GOM_UpdateTongTien_Insert;
/

-- TRIGGER 2: Update order total when removing snacks (GOM table)
CREATE OR REPLACE TRIGGER TRG_GOM_UpdateTongTien_Delete
AFTER DELETE ON GOM
FOR EACH ROW
BEGIN
    UPDATE DON_HANG
    SET TongTien = TongTien - (:OLD.SoLuong * :OLD.DonGia)
    WHERE MaDonHang = :OLD.MaDonHang;
    
    COMMIT;
END TRG_GOM_UpdateTongTien_Delete;
/

-- TRIGGER 3: Update order total when modifying snacks quantity (GOM table)
CREATE OR REPLACE TRIGGER TRG_GOM_UpdateTongTien_Update
AFTER UPDATE ON GOM
FOR EACH ROW
DECLARE
    old_subtotal        NUMBER;
    new_subtotal        NUMBER;
BEGIN
    old_subtotal := :OLD.SoLuong * :OLD.DonGia;
    new_subtotal := :NEW.SoLuong * :NEW.DonGia;

    UPDATE DON_HANG
    SET TongTien = TongTien - old_subtotal + new_subtotal
    WHERE MaDonHang = :NEW.MaDonHang;
    
    COMMIT;
END TRG_GOM_UpdateTongTien_Update;
/

-- TRIGGER 4: Update order total when adding ticket (VE_XEM_PHIM table)
CREATE OR REPLACE TRIGGER TRG_VE_UpdateTongTien_Insert
AFTER INSERT ON VE_XEM_PHIM
FOR EACH ROW
BEGIN
    UPDATE DON_HANG
    SET TongTien = TongTien + NVL(:NEW.GiaVeCuoi, 0)
    WHERE MaDonHang = :NEW.MaDonHang;
    
    COMMIT;
END TRG_VE_UpdateTongTien_Insert;
/

-- TRIGGER 5: Update order total when removing ticket (VE_XEM_PHIM table)
CREATE OR REPLACE TRIGGER TRG_VE_UpdateTongTien_Delete
AFTER DELETE ON VE_XEM_PHIM
FOR EACH ROW
BEGIN
    UPDATE DON_HANG
    SET TongTien = TongTien - NVL(:OLD.GiaVeCuoi, 0)
    WHERE MaDonHang = :OLD.MaDonHang;
    
    COMMIT;
END TRG_VE_UpdateTongTien_Delete;
/

-- TRIGGER 6: Update order total when modifying ticket price (VE_XEM_PHIM table)
CREATE OR REPLACE TRIGGER TRG_VE_UpdateTongTien_Update
AFTER UPDATE ON VE_XEM_PHIM
FOR EACH ROW
DECLARE
    old_price   NUMBER;
    new_price   NUMBER;
BEGIN
    old_price := NVL(:OLD.GiaVeCuoi, 0);
    new_price := NVL(:NEW.GiaVeCuoi, 0);

    UPDATE DON_HANG
    SET TongTien = TongTien - old_price + new_price
    WHERE MaDonHang = :NEW.MaDonHang;
    
    COMMIT;
END TRG_VE_UpdateTongTien_Update;
/

-- TRIGGER 7: Ensure TongTien is never negative
CREATE OR REPLACE TRIGGER TRG_DonHang_CheckTongTien
BEFORE UPDATE ON DON_HANG
FOR EACH ROW
BEGIN
    IF :NEW.TongTien < 0 THEN
        :NEW.TongTien := 0;
    END IF;
END TRG_DonHang_CheckTongTien;
/

-- TRIGGER 8: Auto-update payment status when full amount paid
CREATE OR REPLACE TRIGGER TRG_ThanhToan_UpdateStatus
AFTER INSERT ON THANH_TOAN
FOR EACH ROW
DECLARE
    v_TongTien  DON_HANG.TongTien%TYPE;
    v_DaTra     NUMBER;
BEGIN
    -- Get order total
    SELECT TongTien INTO v_TongTien
    FROM DON_HANG
    WHERE MaDonHang = :NEW.MaDonHang;

    -- Get total paid so far
    SELECT NVL(SUM(SoTien), 0) INTO v_DaTra
    FROM THANH_TOAN
    WHERE MaDonHang = :NEW.MaDonHang;

    -- If full amount paid, update order status
    IF v_DaTra >= v_TongTien THEN
        UPDATE DON_HANG
        SET TrangThai = 'Đã thanh toán'
        WHERE MaDonHang = :NEW.MaDonHang;
    END IF;
    
    COMMIT;
END TRG_ThanhToan_UpdateStatus;
/
