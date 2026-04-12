USE CINEMA;
SET NAMES utf8mb4;

/* =======================================================================
   Thêm xóa sửa phim
   ======================================================================= */
   DELIMITER $$
CREATE PROCEDURE SP_Insert_PHIM (
    IN p_MaPhim VARCHAR(20),
    IN p_TenPhim VARCHAR(200),
    IN p_ThoiLuong INT,
    IN p_NgonNgu VARCHAR(50),
    IN p_QuocGia VARCHAR(50),
    IN p_DaoDien VARCHAR(100),
    IN p_DienVienChinh VARCHAR(200),
    IN p_NgayKhoiChieu DATE,
    IN p_MoTaNoiDung TEXT,
    IN p_DoTuoi INT,
    IN p_ChuDePhim VARCHAR(100)
)
BEGIN

    IF EXISTS (SELECT 1 FROM PHIM WHERE MaPhim = p_MaPhim) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Mã Phim đã tồn tại. Vui lòng chọn mã khác.';
    END IF;

    IF p_ThoiLuong <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Thời lượng phim phải lớn hơn 0 phút.';
    END IF;

    IF p_DoTuoi < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Độ tuổi giới hạn phải lớn hơn hoặc bằng 0.';
    END IF;

    
    IF p_TenPhim IS NULL OR p_TenPhim = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tên phim không được để trống.';
    END IF;

    INSERT INTO PHIM (MaPhim, TenPhim, ThoiLuong, NgonNgu, QuocGia, DaoDien, DienVienChinh, NgayKhoiChieu, MoTaNoiDung, DoTuoi, ChuDePhim)
    VALUES (p_MaPhim, p_TenPhim, p_ThoiLuong, p_NgonNgu, p_QuocGia, p_DaoDien, p_DienVienChinh, p_NgayKhoiChieu, p_MoTaNoiDung, p_DoTuoi, p_ChuDePhim);

END$$
DELIMITER ;

-- Update Phim
DELIMITER $$
CREATE PROCEDURE SP_Update_PHIM (
    IN p_MaPhim VARCHAR(20),
    IN p_TenPhim_New VARCHAR(200),
    IN p_ThoiLuong_New INT,
    IN p_NgonNgu_New VARCHAR(50),
    IN p_QuocGia_New VARCHAR(50),
    IN p_DaoDien_New VARCHAR(100),
    IN p_DienVienChinh_New VARCHAR(200),
    IN p_NgayKhoiChieu_New DATE,
    IN p_MoTaNoiDung_New TEXT,
    IN p_DoTuoi_New INT,
    IN p_ChuDePhim_New VARCHAR(100)
)
BEGIN
    
    IF NOT EXISTS (SELECT 1 FROM PHIM WHERE MaPhim = p_MaPhim) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không tìm thấy Mã Phim cần cập nhật.';
    END IF;

    
    IF p_ThoiLuong_New <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Thời lượng phim phải lớn hơn 0 phút.';
    END IF;

    
    IF p_DoTuoi_New < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Độ tuổi giới hạn phải lớn hơn hoặc bằng 0.';
    END IF;

  
    IF p_TenPhim_New IS NULL OR p_TenPhim_New = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Tên phim không được để trống.';
    END IF;

    UPDATE PHIM
    SET
        TenPhim = p_TenPhim_New,
        ThoiLuong = p_ThoiLuong_New,
        NgonNgu = p_NgonNgu_New,
        QuocGia = p_QuocGia_New,
        DaoDien = p_DaoDien_New,
        DienVienChinh = p_DienVienChinh_New,
        NgayKhoiChieu = p_NgayKhoiChieu_New,
        MoTaNoiDung = p_MoTaNoiDung_New,
        DoTuoi = p_DoTuoi_New,
        ChuDePhim = p_ChuDePhim_New
    WHERE MaPhim = p_MaPhim;

END$$
DELIMITER ;

-- Delete Phim
DELIMITER $$
CREATE PROCEDURE SP_Delete_PHIM_Flexible (
    IN p_MaPhim VARCHAR(20)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM PHIM WHERE MaPhim = p_MaPhim) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lỗi: Không tìm thấy Mã Phim cần xóa.';
    END IF;


    IF EXISTS (
        SELECT 1 
        FROM SUAT_CHIEU 
        WHERE MaPhim = p_MaPhim

          AND NgayChieu >= CURDATE()

          AND TrangThai IN ('Đang mở', 'Hủy') 
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Lỗi: Không thể xóa Phim này. Phim vẫn còn suất chiếu chưa diễn ra hoặc đang chờ/mở.';
    END IF;
    
    DELETE FROM PHIM
    WHERE MaPhim = p_MaPhim;

END$$
DELIMITER ;
