USE CINEMA;
SET NAMES utf8mb4;

/* =======================================================================
   QUẢN LÝ ĐẶT VÉ
   ======================================================================= */

DELIMITER $$

-- 1. Đặt vé xem phim
CREATE PROCEDURE SP_DatVe (
    IN p_MaVe VARCHAR(20),
    IN p_MaSuatChieu VARCHAR(20),
    IN p_MaPhong VARCHAR(20),
    IN p_HangGhe VARCHAR(10),
    IN p_SoGhe INT,
    IN p_MaNguoiDung_KH VARCHAR(20),
    IN p_MaDonHang VARCHAR(20)
)
BEGIN
    DECLARE v_GiaVe DECIMAL(18,2);
    DECLARE v_TrangThaiSuat VARCHAR(20);

    -- Kiểm tra suất chiếu
    SELECT GiaVeCoBan, TrangThai INTO v_GiaVe, v_TrangThaiSuat
    FROM SUAT_CHIEU WHERE MaSuatChieu = p_MaSuatChieu;

    IF v_TrangThaiSuat <> 'Đang mở' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Suất chiếu không mở bán hoặc đã hủy.';
    END IF;

    -- Kiểm tra ghế đã có người đặt chưa (Dựa vào Unique Key trong bảng VE_XEM_PHIM)
    IF EXISTS (
        SELECT 1 FROM VE_XEM_PHIM 
        WHERE MaSuatChieu = p_MaSuatChieu 
          AND MaPhong = p_MaPhong 
          AND HangGhe = p_HangGhe 
          AND SoGhe = p_SoGhe
          AND TrangThai <> 'Hủy'
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ghế này đã được đặt.';
    END IF;

    -- Insert vé
    INSERT INTO VE_XEM_PHIM (MaVe, MaSuatChieu, MaPhong, HangGhe, SoGhe, MaNguoiDung_KH, MaDonHang, GiaVeCuoi, NgayDat, TrangThai)
    VALUES (p_MaVe, p_MaSuatChieu, p_MaPhong, p_HangGhe, p_SoGhe, p_MaNguoiDung_KH, p_MaDonHang, v_GiaVe, NOW(), 'Đã đặt');

    -- Cập nhật tổng tiền đơn hàng (Vì trigger 08 chỉ tính bảng GOM)
    UPDATE DON_HANG 
    SET TongTien = TongTien + v_GiaVe
    WHERE MaDonHang = p_MaDonHang;

END$$

-- 2. Hủy vé
CREATE PROCEDURE SP_HuyVe (
    IN p_MaVe VARCHAR(20)
)
BEGIN
    DECLARE v_GiaVe DECIMAL(18,2);
    DECLARE v_MaDonHang VARCHAR(20);
    DECLARE v_TrangThaiHienTai VARCHAR(20);

    SELECT GiaVeCuoi, MaDonHang, TrangThai INTO v_GiaVe, v_MaDonHang, v_TrangThaiHienTai
    FROM VE_XEM_PHIM WHERE MaVe = p_MaVe;

    IF v_TrangThaiHienTai = 'Hủy' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vé đã bị hủy trước đó.';
    END IF;

    UPDATE VE_XEM_PHIM
    SET TrangThai = 'Hủy'
    WHERE MaVe = p_MaVe;

    -- Trừ tiền đơn hàng
    UPDATE DON_HANG
    SET TongTien = TongTien - v_GiaVe
    WHERE MaDonHang = v_MaDonHang;
END$$

DELIMITER ;