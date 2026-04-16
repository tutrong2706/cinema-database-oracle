-- ORACLE VERSION: Stored Procedures for DON_HANG (Order) Management
-- ============================================================================

-- 1. CREATE NEW ORDER
CREATE OR REPLACE PROCEDURE SP_TaoDonHang (
    p_MaDonHang      IN DON_HANG.MaDonHang%TYPE,
    p_MaNguoiDung_KH IN DON_HANG.MaNguoiDung_KH%TYPE,
    p_PhuongThuc     IN DON_HANG.PhuongThuc%TYPE
)
AS
BEGIN
    -- Check if order code already exists
    IF (SELECT COUNT(*) FROM DON_HANG WHERE MaDonHang = p_MaDonHang) > 0 THEN
        RAISE_APPLICATION_ERROR(-20010, 'Mã đơn hàng đã tồn tại.');
    END IF;

    -- Check if customer exists
    IF (SELECT COUNT(*) FROM NGUOI_DUNG WHERE MaNguoiDung = p_MaNguoiDung_KH) = 0 THEN
        RAISE_APPLICATION_ERROR(-20011, 'Mã người dùng không tồn tại.');
    END IF;

    INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai)
    VALUES (p_MaDonHang, p_MaNguoiDung_KH, p_PhuongThuc, SYSDATE, 0, 'Chờ thanh toán');

    COMMIT;
END SP_TaoDonHang;
/

-- 2. ADD ITEM TO ORDER (Snacks/Drinks)
-- Trigger in 08_triggers_oracle.sql will auto-update TongTien in DON_HANG
CREATE OR REPLACE PROCEDURE SP_ThemMatHangVaoDon (
    p_MaDonHang IN GOM.MaDonHang%TYPE,
    p_MaHang    IN GOM.MaHang%TYPE,
    p_SoLuong   IN GOM.SoLuong%TYPE
)
AS
    v_DonGia        MAT_HANG.DonGia%TYPE;
    v_SoLuongTon    MAT_HANG.SoLuongTon%TYPE;
BEGIN
    -- Get price and stock info
    SELECT DonGia, SoLuongTon 
    INTO v_DonGia, v_SoLuongTon
    FROM MAT_HANG 
    WHERE MaHang = p_MaHang;

    IF v_DonGia IS NULL THEN
        RAISE_APPLICATION_ERROR(-20012, 'Mã hàng không tồn tại.');
    END IF;

    -- Check stock availability
    IF v_SoLuongTon < p_SoLuong THEN
        RAISE_APPLICATION_ERROR(-20013, 'Số lượng tồn kho không đủ.');
    END IF;

    -- Add to GOM table
    INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia)
    VALUES (p_MaDonHang, p_MaHang, p_SoLuong, v_DonGia);

    -- Reduce stock
    UPDATE MAT_HANG 
    SET SoLuongTon = SoLuongTon - p_SoLuong 
    WHERE MaHang = p_MaHang;

    COMMIT;
END SP_ThemMatHangVaoDon;
/

-- 3. UPDATE ORDER STATUS
CREATE OR REPLACE PROCEDURE SP_CapNhatTrangThaiDon (
    p_MaDonHang    IN DON_HANG.MaDonHang%TYPE,
    p_TrangThaiMoi IN DON_HANG.TrangThai%TYPE
)
AS
BEGIN
    -- Validate status
    IF p_TrangThaiMoi NOT IN ('Chờ thanh toán', 'Đã thanh toán', 'Hủy') THEN
        RAISE_APPLICATION_ERROR(-20014, 'Trạng thái không hợp lệ.');
    END IF;

    UPDATE DON_HANG
    SET TrangThai = p_TrangThaiMoi
    WHERE MaDonHang = p_MaDonHang;

    COMMIT;
END SP_CapNhatTrangThaiDon;
/

-- 4. GET ORDER BY CODE
CREATE OR REPLACE PROCEDURE SP_Get_DonHang_ByCode (
    p_MaDonHang IN DON_HANG.MaDonHang%TYPE
)
AS
BEGIN
    SELECT * FROM DON_HANG WHERE MaDonHang = p_MaDonHang;
END SP_Get_DonHang_ByCode;
/

-- 5. GET ALL ORDERS FOR CUSTOMER
CREATE OR REPLACE PROCEDURE SP_Get_DonHang_ByCustomer (
    p_MaNguoiDung IN DON_HANG.MaNguoiDung_KH%TYPE
)
AS
BEGIN
    SELECT * FROM DON_HANG 
    WHERE MaNguoiDung_KH = p_MaNguoiDung 
    ORDER BY ThoiGianDat DESC;
END SP_Get_DonHang_ByCustomer;
/

-- 6. GET ORDER DETAILS (Items in order)
CREATE OR REPLACE PROCEDURE SP_Get_ChiTietDonHang (
    p_MaDonHang IN GOM.MaDonHang%TYPE
)
AS
BEGIN
    SELECT 
        g.MaDonHang,
        g.MaHang,
        mh.TenHang,
        g.SoLuong,
        g.DonGia,
        (g.SoLuong * g.DonGia) AS ThanhTien
    FROM GOM g
    JOIN MAT_HANG mh ON g.MaHang = mh.MaHang
    WHERE g.MaDonHang = p_MaDonHang;
END SP_Get_ChiTietDonHang;
/

-- 7. REMOVE ITEM FROM ORDER
CREATE OR REPLACE PROCEDURE SP_XoaMatHangTuDon (
    p_MaDonHang IN GOM.MaDonHang%TYPE,
    p_MaHang    IN GOM.MaHang%TYPE
)
AS
    v_SoLuong MAT_HANG.SoLuongTon%TYPE;
BEGIN
    -- Get quantity removed
    SELECT SoLuong INTO v_SoLuong FROM GOM 
    WHERE MaDonHang = p_MaDonHang AND MaHang = p_MaHang;

    -- Restore stock
    UPDATE MAT_HANG 
    SET SoLuongTon = SoLuongTon + v_SoLuong 
    WHERE MaHang = p_MaHang;

    -- Remove from order
    DELETE FROM GOM 
    WHERE MaDonHang = p_MaDonHang AND MaHang = p_MaHang;

    COMMIT;
END SP_XoaMatHangTuDon;
/

-- 8. CANCEL ORDER (restore all stock)
CREATE OR REPLACE PROCEDURE SP_HuyDonHang (
    p_MaDonHang IN DON_HANG.MaDonHang%TYPE
)
AS
    CURSOR order_items IS 
        SELECT MaHang, SoLuong FROM GOM WHERE MaDonHang = p_MaDonHang;
BEGIN
    -- Restore all stock
    FOR item IN order_items LOOP
        UPDATE MAT_HANG 
        SET SoLuongTon = SoLuongTon + item.SoLuong 
        WHERE MaHang = item.MaHang;
    END LOOP;

    -- Delete order items
    DELETE FROM GOM WHERE MaDonHang = p_MaDonHang;

    -- Update order status
    UPDATE DON_HANG 
    SET TrangThai = 'Hủy' 
    WHERE MaDonHang = p_MaDonHang;

    COMMIT;
END SP_HuyDonHang;
/
