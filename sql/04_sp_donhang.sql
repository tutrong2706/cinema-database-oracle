USE CINEMA;
SET NAMES utf8mb4;

/* =======================================================================
   QUẢN LÝ ĐƠN HÀNG
   ======================================================================= */

DELIMITER $$

-- 1. Tạo đơn hàng mới
CREATE PROCEDURE SP_TaoDonHang (
    IN p_MaDonHang VARCHAR(20),
    IN p_MaNguoiDung_KH VARCHAR(20),
    IN p_PhuongThuc VARCHAR(50)
)
BEGIN
    IF EXISTS (SELECT 1 FROM DON_HANG WHERE MaDonHang = p_MaDonHang) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mã đơn hàng đã tồn tại.';
    END IF;

    INSERT INTO DON_HANG (MaDonHang, MaNguoiDung_KH, PhuongThuc, ThoiGianDat, TongTien, TrangThai)
    VALUES (p_MaDonHang, p_MaNguoiDung_KH, p_PhuongThuc, NOW(), 0, 'Chờ thanh toán');
END$$

-- 2. Thêm mặt hàng (bắp/nước) vào đơn hàng
-- Trigger trong 08_triggers_tongtien.sql sẽ tự động cập nhật TongTien trong DON_HANG
CREATE PROCEDURE SP_ThemMatHangVaoDon (
    IN p_MaDonHang VARCHAR(20),
    IN p_MaHang VARCHAR(20),
    IN p_SoLuong INT
)
BEGIN
    DECLARE v_DonGia DECIMAL(18,2);
    DECLARE v_SoLuongTon INT;

    -- Kiểm tra tồn kho
    SELECT DonGia, SoLuongTon INTO v_DonGia, v_SoLuongTon
    FROM MAT_HANG WHERE MaHang = p_MaHang;

    IF v_DonGia IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mã hàng không tồn tại.';
    END IF;

    IF v_SoLuongTon < p_SoLuong THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng tồn kho không đủ.';
    END IF;

    -- Thêm vào bảng GOM
    INSERT INTO GOM (MaDonHang, MaHang, SoLuong, DonGia)
    VALUES (p_MaDonHang, p_MaHang, p_SoLuong, v_DonGia);

    -- Trừ tồn kho
    UPDATE MAT_HANG SET SoLuongTon = SoLuongTon - p_SoLuong WHERE MaHang = p_MaHang;
END$$

-- 3. Cập nhật trạng thái đơn hàng (Ví dụ: Hủy đơn)
CREATE PROCEDURE SP_CapNhatTrangThaiDon (
    IN p_MaDonHang VARCHAR(20),
    IN p_TrangThaiMoi VARCHAR(20)
)
BEGIN
    IF p_TrangThaiMoi NOT IN ('Chờ thanh toán', 'Đã thanh toán', 'Hủy') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Trạng thái không hợp lệ.';
    END IF;

    UPDATE DON_HANG
    SET TrangThai = p_TrangThaiMoi
    WHERE MaDonHang = p_MaDonHang;
END$$

DELIMITER ;